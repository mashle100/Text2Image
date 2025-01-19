from fastapi import FastAPI, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from diffusers import StableDiffusionPipeline
import torch
from io import BytesIO
from PIL import Image
import base64
from pymongo import MongoClient

app = FastAPI()

# MongoDB client setup
client = MongoClient("mongodb://localhost:27017/")
db = client["TexttoImage"]
images_collection = db["images"]

# CORS setup for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the Stable Diffusion pipeline
pipe = StableDiffusionPipeline.from_pretrained(
    "stabilityai/stable-diffusion-2", torch_dtype=torch.float16
)
pipe = pipe.to("cuda")


# @app.post("/generate")
# async def generate_images(username: str = Form(...), prompt: str = Form(...)):
#     if not username.strip():
#         raise HTTPException(status_code=400, detail="Username cannot be empty.")
#     if not prompt.strip():
#         raise HTTPException(status_code=400, detail="Prompt cannot be empty.")

#     try:
#         # Generate three images using the prompt
#         generated_images = [pipe(prompt).images[0] for _ in range(3)]

#         images_base64 = []
#         image_docs = []

#         for image in generated_images:
#             # Convert image to base64 string
#             buffered = BytesIO()
#             image.save(buffered, format="PNG")
#             img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
#             images_base64.append(img_str)

#             # Prepare image document for MongoDB
#             image_doc = {
#                 "username": username,
#                 "image": img_str,
#                 "prompt": prompt,
#             }
#             image_docs.append(image_doc)

#         # Save all images to MongoDB
#         result = images_collection.insert_many(image_docs)

#         return {
#             "images": images_base64,
#             "message": "Images generated and saved successfully!",
#             "image_ids": [str(id) for id in result.inserted_ids],
#         }
#     except torch.cuda.OutOfMemoryError:
#         raise HTTPException(status_code=500, detail="CUDA out of memory. Try reducing load.")
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error generating images: {str(e)}")
from googletrans import Translator

# Initialize the translator
translator = Translator()

@app.post("/generate")
async def generate_images(username: str = Form(...), prompt: str = Form(...)):
    if not username.strip():
        raise HTTPException(status_code=400, detail="Username cannot be empty.")
    if not prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt cannot be empty.")

    try:
        # Translate the prompt to English
        translated_prompt = translator.translate(prompt, dest="en").text

        # Generate three images using the translated prompt
        generated_images = [pipe(translated_prompt).images[0] for _ in range(3)]

        images_base64 = []
        image_docs = []

        for image in generated_images:
            # Convert image to base64 string
            buffered = BytesIO()
            image.save(buffered, format="PNG")
            img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
            images_base64.append(img_str)

            # Prepare image document for MongoDB
            image_doc = {
                "username": username,
                "image": img_str,
                "prompt": prompt,  # Store the original prompt
                "translated_prompt": translated_prompt,  # Store the translated prompt
            }
            image_docs.append(image_doc)

        # Save all images to MongoDB
        result = images_collection.insert_many(image_docs)

        return {
            "images": images_base64,
            "message": "Images generated and saved successfully!",
            "image_ids": [str(id) for id in result.inserted_ids],
            "translated_prompt": translated_prompt,
        }
    except torch.cuda.OutOfMemoryError:
        raise HTTPException(status_code=500, detail="CUDA out of memory. Try reducing load.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating images: {str(e)}")


@app.get("/images/{username}")
async def get_user_images(username: str):
    if not username.strip():
        raise HTTPException(status_code=400, detail="Username cannot be empty.")

    try:
        # Fetch images for a specific user
        images = images_collection.find({"username": username})
        images_list = [
            {
                "image_id": str(image["_id"]),
                "image": image["image"],
                "prompt": image["prompt"],
            }
            for image in images
        ]
        if not images_list:
            raise HTTPException(status_code=404, detail="No images found for this user.")
        return {"images": images_list}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching images: {str(e)}")

from fastapi.responses import HTMLResponse

@app.get("/view-images/{username}", response_class=HTMLResponse)
async def view_user_images(username: str):
    if not username.strip():
        raise HTTPException(status_code=400, detail="Username cannot be empty.")

    try:
        # Fetch images for a specific user
        images = images_collection.find({"username": username})
        images_html = ""

        for image in images:
            img_data = image["image"]
            prompt = image["prompt"]
            images_html += f"""
            <div style="margin-bottom: 20px;">
                <h4>Prompt: {prompt}</h4>
                <img src="data:image/png;base64,{img_data}" alt="Generated Image" style="max-width: 400px; max-height: 400px;"/>
            </div>
            """

        if not images_html:
            return "<h3>No images found for this user.</h3>"

        return f"""
        <html>
        <head><title>Generated Images for {username}</title></head>
        <body>
            <h2>Generated Images for {username}</h2>
            {images_html}
        </body>
        </html>
        """
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error rendering images: {str(e)}")


