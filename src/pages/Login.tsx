import React, { useState } from "react";
import API from "../services/api";
import { useAuth } from "../hooks/useAuth";
import { Navigate, Link } from "react-router-dom";

const Login = () => {
  const { user, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // État pour les messages d'erreur

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(""); // Réinitialiser le message d'erreur avant la tentative
    try {
      const { data } = await API.post("/auth/login", { email, password });
      login();
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("userEmail", email);
      localStorage.setItem("user", JSON.stringify(data.user));
      console.log(data);
    } catch (error: any) {
      // Gérer les erreurs provenant du back-end
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message); // Afficher le message d'erreur du back-end
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
      console.error("Login failed:", error);
    }
  };

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Login</h1>
      {/* Affichage du message d'erreur */}
      {errorMessage && (
        <div className="bg-red-100 text-red-700 p-2 rounded">
          {errorMessage}
        </div>
      )}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
        Login
      </button>
      <div className="text-center">
        <Link to="/forgot-password" className="text-blue-500">
          Forgot Password?
        </Link>
      </div>
    </form>
  );
};

export default Login;
