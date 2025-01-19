import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Signup.css";

function Login() {
  const [form, setForm] = useState({ 'username': '', 'Password': ''});
  const navigate = useNavigate(); // Initialize useNavigate hook

  async function handleSubmit(e) {
    e.preventDefault();
    console.log("Form data:", form);
    try {
        const response = await axios.post('http://localhost:5000/signup', form);
        console.log('Response from server:', response.data);
        
        if (response.data.success) {
          // Redirect to login page on successful signup
          navigate('/login');
        } else {
          alert(response.data.message || 'Signup failed. Please try again.');
        }
      } catch (error) {
        console.error('Error during signup:', error);
        if (error.response) {
          console.error('Server error response:', error.response.data);
          alert(error.response.data.message || 'An error occurred. Please try again.');
        } else {
          alert('Could not connect to the server. Please try again later.');
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
        <h2 className="title">Sign up</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            placeholder="Email-address"
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="input"
          />
          <input
            type="text"
            placeholder="Password"
            onChange={(e) => setForm({ ...form, Password: e.target.value })}
            className="input"
          />
          <button type="submit" className="button">
            SignUp
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
