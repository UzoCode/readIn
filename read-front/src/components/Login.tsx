import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/axios.ts";

const Login: React.FC = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate(); // For redirection

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiClient.post("/auth/login", formData);
      localStorage.setItem("token", response.data.token); // Save token
      setMessage("Login successful! Redirecting...");
      setTimeout(() => navigate("/"), 2000); // Redirect to BookList
    } catch (error: any) {
      setMessage("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="auth-container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
      <p>
        Don't have an account? <a href="/signup">Signup here</a>
      </p>
    </div>
  );
};

export default Login;
