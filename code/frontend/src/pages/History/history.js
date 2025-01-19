import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";
import './history.css'

const UserImages = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username"); // Get the logged-in username
  const [imageCount, setImageCount] = useState(0);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImageCount = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/image-count/${username}`
        );
        setImageCount(response.data);
      } catch (error) {
        console.error("Error fetching image count:", error);
        alert("Could not fetch the image count. Please try again later.");
      }
    };
    const fetchImages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/images/${username}`
        );
        const fetchedImages = response.data.images.map(
          (image) => `data:image/png;base64,${image.image}`
        );
        setImages(fetchedImages);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    if (username) {
      fetchImages();
      fetchImageCount();
    }
  }, [username]);

  const handleDownloadAll = () => {
    images.forEach((image, index) => {
      const link = document.createElement("a");
      link.href = image;
      link.download = `generated_image_${index + 1}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  return (
    <div className="user-images-container p-4">
      <div className="header flex items-center justify-center mb-4">
        <FaUserCircle className="text-4xl text-gray-700 mr-2" />
        <h1 className="title text-2xl font-bold">
          {username}'s Generated Images ({imageCount})
        </h1>
      </div>
      <div className="image-grid grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-4">
        {images.map((image, index) => (
          <div key={index} className="image-card p-2">
            <img
              src={image}
              alt={`Generated ${index}`}
              className="image rounded-md shadow-md"
              style={{ width: "100px", height: "100px" }}
            />
          </div>
        ))}
      </div>
      {images.length > 0 && (
        <div className="download-button-container mt-6 text-center">
          <button
            onClick={handleDownloadAll}
            className="download-button bg-blue-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
          >
            Download All Images
          </button>
        </div>
      )}
    </div>
  );
};

export default UserImages;
