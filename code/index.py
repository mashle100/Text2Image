from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from pymongo import MongoClient
import gridfs
import torch
from torchvision.utils import save_image
from transformers import BertTokenizer, BertModel
from bson import ObjectId
from PIL import Image
import json
from io import BytesIO

# Load Config
with open('config.json', 'r') as f:
    config = json.load(f)

device = torch.device(config['device'])

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# MongoDB setup
client = MongoClient('mongodb://localhost:27017/TexttoImage')
db = client["images"]
fs = gridfs.GridFS(db)

# Define Generator
class Generator(torch.nn.Module):
    def __init__(self, text_dim, noise_dim, ngf):
        super(Generator, self).__init__()
        self.fc = torch.nn.Sequential(
            torch.nn.Linear(text_dim + noise_dim,ngf* 8*4*4),  # Adjusting for larger image size
            torch.nn.BatchNorm1d(ngf*8*4*4),
            torch.nn.ReLU(True)
        )
        self.deconv = torch.nn.Sequential(
            torch.nn.ConvTranspose2d(ngf * 8, ngf * 4, 4, 2, 1),
            torch.nn.BatchNorm2d(ngf * 4),
            torch.nn.ReLU(True),
            torch.nn.ConvTranspose2d(ngf * 4, ngf * 2, 4, 2, 1),
            torch.nn.BatchNorm2d(ngf * 2),
            torch.nn.ReLU(True),
            torch.nn.ConvTranspose2d(ngf * 2, ngf, 4, 2, 1),
            torch.nn.BatchNorm2d(ngf),
            torch.nn.ReLU(True),
            torch.nn.ConvTranspose2d(ngf, 3, 4, 2, 1),  # This produces 128x128 image
            torch.nn.Tanh()
        )

    def forward(self, text_embedding, noise):
        x = torch.cat([text_embedding, noise], dim=1)
        x = self.fc(x)
        x = x.view(-1, 512, 4, 4)  # Ensure the correct shape for deconv
        img = self.deconv(x)
        return img


# Load models
generator = Generator(config['text_dim'], config['noise_dim'], config['ngf']).to(device)
generator.load_state_dict(torch.load('fine_tuned_generator.pth', map_location=device))
generator.eval()

tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")
bert_model = BertModel.from_pretrained("bert-base-uncased").to(device)
bert_model.eval()

# DF-GAN Pipeline
class DFGANPipeline:
    def __init__(self, generator, tokenizer, bert_model, device):
        self.generator = generator
        self.tokenizer = tokenizer
        self.bert_model = bert_model
        self.device = device

    def generate_embedding(self, text_prompt):
        with torch.no_grad():
            inputs = self.tokenizer(text_prompt, return_tensors="pt", padding=True, truncation=True).to(self.device)
            embedding = self.bert_model(**inputs).pooler_output
        return embedding

    def generate_image(self, text_prompt, num_samples):
        text_embedding = self.generate_embedding(text_prompt).repeat(num_samples, 1)
        noise = torch.randn(num_samples, config['noise_dim'], device=self.device)
        with torch.no_grad():
            generated_images = self.generator(text_embedding, noise)
        return generated_images

# Initialize the DF-GAN pipeline
pipeline = DFGANPipeline(generator, tokenizer, bert_model, device)

@app.route('/api/process', methods=['POST'])
def process_text():
    data = request.get_json()
    input_text = data.get('input', '')

    if not input_text:
        return jsonify({'message': 'Input text is required'}), 400

    try:
        # Generate images from text prompt
        num_samples = 3  # Adjust the number of images
        generated_images = pipeline.generate_image(input_text, num_samples)

        # Save images to MongoDB and return URLs
        image_urls = []
        for i, img_tensor in enumerate(generated_images):
            img = Image.fromarray((img_tensor.permute(1, 2, 0).cpu().numpy() * 255).astype('uint8'))
            img_io = BytesIO()
            img.save(img_io, format="PNG")
            img_io.seek(0)

            file_id = fs.put(img_io.getvalue(), filename=f"{input_text}_{i}.png")
            image_urls.append(f"/api/image/{file_id}")

        return jsonify({'image_urls': image_urls})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/image/<file_id>', methods=['GET'])
def get_image(file_id):
    try:
        file = fs.get(ObjectId(file_id))
        return send_file(BytesIO(file.read()), mimetype='image/png')
    except Exception as e:
        return jsonify({"error": "File not found"}), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
