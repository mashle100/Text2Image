import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

function Login() {
  const [form, setForm] = useState({ username: "", Password: "" });
  const navigate = useNavigate(); // Initialize useNavigate hook

  async function handleSubmit(e) {
    e.preventDefault();
    console.log("Form data:", form);
    try {
      const response = await axios.post("http://localhost:5000/login", form);
      console.log("Response from server:", response.data);
      if (response.data.success) {
        // Store the username in local storage
        localStorage.setItem("username", form.username);
        // Navigate to the detail page
        navigate("/detail");
      } else {
        alert(response.data.message || "Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      if (error.response) {
        console.error("Server error response:", error.response.data);
        alert(error.response.data.message || "An error occurred. Please try again.");
      } else {
        alert("Could not connect to the server. Please try again later.");
      }
    }
  }

  return (
    <div className="login-container">
      <div className="image-section">
        <img
          src="/images/window-8431870.jpg"
          alt="Nature Illustration"
          className="login-image"
        />
      </div>
      <div className="form-section">
        <h2 className="title">Sign into your account</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            placeholder="Email-address"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="input"
          />
          <input
            type="password"
            placeholder="Password"
            value={form.Password}
            onChange={(e) => setForm({ ...form, Password: e.target.value })}
            className="input"
          />
          <button type="submit" className="button">
            Login
          </button>
        </form>
        <div className="links">
          <a href="/forgot-password" className="link">
            Forgot Password?
          </a>
          <p>
            Don't have an account?{" "}
            <a href="/Signup" className="link">
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
