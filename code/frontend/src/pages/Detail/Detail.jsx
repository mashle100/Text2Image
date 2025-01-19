// import React, { useState } from "react";

// const ChatbotWithImage = () => {
//   const [imageSrc, setImageSrc] = useState(null);
//   const [inputValue, setInputValue] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleGenerateImage = async () => {
//     if (inputValue.trim() === "") return;
//     setLoading(true);

//     try {
//       const response = await fetch("http://localhost:8000/generate", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//         },
//         body: new URLSearchParams({ prompt: inputValue }),
//       });

//       const data = await response.json();
//       setImageSrc(`data:image/png;base64,${data.image}`);
//     } catch (error) {
//       console.error("Error generating image:", error);
//     } finally {
//       setLoading(false);
//       setInputValue("");
//     }
//   };

//   return (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "space-between",
//         height: "100vh",
//         padding: "10px",
//         boxSizing: "border-box",
//         backgroundColor: "#f5f7fa",
//         fontFamily: "'Arial', sans-serif",
//       }}
//     >
//       {/* Image display section */}
//       <div
//         style={{
//           flex: 1,
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           position: "relative",
//         }}
//       >
//         {loading ? (
//           <p style={{ fontSize: "18px", color: "#555" }}>Loading...</p>
//         ) : imageSrc ? (
//           <img
//             src={imageSrc}
//             alt="Generated"
//             style={{
//               maxWidth: "80%",
//               maxHeight: "80%",
//               borderRadius: "10px",
//               boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
//               animation: "fadeIn 1s ease-in-out",
//             }}
//           />
//         ) : (
//           <p style={{ color: "#888", fontSize: "16px" }}>
//             Your generated image will appear here.
//           </p>
//         )}
//       </div>

//       {/* Chat input section */}
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           padding: "10px",
//           borderTop: "1px solid #ddd",
//           backgroundColor: "#fff",
//           boxShadow: "0px -2px 5px rgba(0, 0, 0, 0.1)",
//         }}
//       >
//         <input
//           type="text"
//           value={inputValue}
//           onChange={(e) => setInputValue(e.target.value)}
//           placeholder="Type your request here..."
//           style={{
//             flex: 1,
//             padding: "12px 15px",
//             border: "1px solid #ccc",
//             borderRadius: "25px",
//             marginRight: "10px",
//             fontSize: "16px",
//             outline: "none",
//             boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
//             transition: "box-shadow 0.2s",
//           }}
//           onFocus={(e) => (e.target.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.2)")}
//           onBlur={(e) => (e.target.style.boxShadow = "0px 2px 5px rgba(0, 0, 0, 0.1)")}
//         />
//         <button
//           onClick={handleGenerateImage}
//           style={{
//             padding: "12px 20px",
//             backgroundColor: "#007BFF",
//             color: "#fff",
//             border: "none",
//             borderRadius: "25px",
//             cursor: "pointer",
//             fontSize: "16px",
//             fontWeight: "bold",
//             boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
//             transition: "background-color 0.3s, box-shadow 0.2s",
//           }}
//           disabled={loading}
//           onMouseEnter={(e) => (e.target.style.backgroundColor = "#0056b3")}
//           onMouseLeave={(e) => (e.target.style.backgroundColor = "#007BFF")}
//         >
//           {loading ? "Generating..." : "Generate"}
//         </button>
//       </div>

//       {/* Fade-in animation */}
//       <style>
//         {`
//           @keyframes fadeIn {
//             from {
//               opacity: 0;
//             }
//             to {
//               opacity: 1;
//             }
//           }
//         `}
//       </style>
//     </div>
//   );
// };

// export default ChatbotWithImage;
// import React, { useState } from "react";
// import {useNavigate} from 'react-router-dom';
// import "./Detail.css";

// const Chatbot = () => {
//   const username = localStorage.getItem("username"); // Get username from localStorage
//   const [prompt, setPrompt] = useState("");
//   const [images, setImages] = useState([]); // Store multiple images
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const handledashboard = async()=>{
//       navigate('/');
//   }
//   const handlelogout = ()=>{
//     localStorage.removeItem('username'); 
//     localStorage.removeItem('token'); 
//     // Redirect to login page
//     navigate('/login');
//   }
//   const handleGenerateImages = async () => {
//     if (!username) {
//       alert("You are not logged in. Please log in first!");
//       return;
//     }

//     if (!prompt.trim()) {
//       alert("Please enter a prompt!");
//       return;
//     }

//     setLoading(true);
//     setImages([]); // Clear previous images

//     try {
//       const response = await fetch("http://127.0.0.1:8000/generate", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//         },
//         body: new URLSearchParams({
//           username: username, // Send username with the request
//           prompt: prompt,
//         }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setImages(data.images); // Update state with generated images
//         alert(data.message); // Show message confirming images are saved
//       } else {
//         const errorData = await response.json();
//         alert(`Error: ${errorData.detail || "Failed to generate images."}`);
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       alert("An error occurred. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };


//   return (
//     <div className="chatbot-container">
//       {/* Image display section */}
//         <div className="dashboard-row"> 
//             <button className='modern-btn' onClick={handledashboard}>Dashboard</button>
//             <button className="modern-btn" onClick={handlelogout}>Logout</button>
//       </div>
//       <div className="image-container">
//         {loading ? (
//           <div className="spinner">
//             <div className="double-bounce1"></div>
//             <div className="double-bounce2"></div>
//           </div>
//         ) : images.length > 0 ? (
//           <div className="images-row">
//             {images.map((image, index) => (
//               <img
//                 key={index}
//                 src={`data:image/png;base64,${image}`}
//                 alt={`Generated ${index + 1}`}
//                 className="generated-image"
//               />
//             ))}
//           </div>
//         ) : (
//           <p className="placeholder-text">Your images will appear here</p>
//         )}
//       </div>

//       {/* Input and button section */}
//       <div className="input-container">
//         <input
//           type="text"
//           value={prompt}
//           onChange={(e) => setPrompt(e.target.value)}
//           placeholder="Enter your prompt..."
//           className="chat-input"
//         />
//         <button onClick={handleGenerateImages} className="generate-button" disabled={loading}>
//           {loading ? "Generating..." : "Generate"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Chatbot;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Detail.css";

const Chatbot = () => {
  const username = localStorage.getItem("username"); // Get username from localStorage
  const [prompt, setPrompt] = useState("");
  const [imageUrls, setImageUrls] = useState([]); // Store URLs of images
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDashboard = () => {
    navigate('/');
  };

  const handleLogout = () => {
    localStorage.removeItem('username'); 
    localStorage.removeItem('token'); 
    navigate('/login'); // Redirect to login page
  };

  const handleGenerateImages = async () => {
    if (!username) {
      alert("You are not logged in. Please log in first!");
      return;
    }

    if (!prompt.trim()) {
      alert("Please enter a prompt!");
      return;
    }

    setLoading(true);
    setImageUrls([]); // Clear previous image URLs

    try {
      const response = await fetch("http://127.0.0.1:5000/api/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: prompt,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const imageUrls = data.image_urls; // Get the list of image URLs
        setImageUrls(imageUrls);
        alert("Images generated successfully!");
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || "Failed to generate images."}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      {/* Dashboard and Logout buttons */}
      <div className="dashboard-row"> 
        <button className="modern-btn" onClick={handleDashboard}>Dashboard</button>
        <button className="modern-btn" onClick={handleLogout}>Logout</button>
      </div>

      {/* Image display section */}
      <div className="image-container">
        {loading ? (
          <div className="spinner">
            <div className="double-bounce1"></div>
            <div className="double-bounce2"></div>
          </div>
        ) : imageUrls.length > 0 ? (
          <div className="images-row">
            {imageUrls.map((url, index) => (
              <img
                key={index}
                src={`http://127.0.0.1:5000${url}`} // Use the full URL from the Flask backend
                alt={`Generated ${index + 1}`}
                className="generated-image"
                style={{ width: '450px', height: '450px', objectFit: 'cover' }}
              />
            ))}
          </div>
        ) : (
          <p className="placeholder-text">Your images will appear here</p>
        )}
      </div>

      {/* Input and button section */}
      <div className="input-container">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt..."
          className="chat-input"
        />
        <button onClick={handleGenerateImages} className="generate-button" disabled={loading}>
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>
    </div>
  );
};

export default Chatbot;





