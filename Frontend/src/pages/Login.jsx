import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function Login() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit() {
    setError("");
    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const res = await axios.post(`${API_BASE}${endpoint}`, { email, password }, { withCredentials: true });
      localStorage.setItem("accessToken", res.data.accessToken);
      navigate("/app");
    } catch (e) {
      setError(e.response?.data?.error || "Something went wrong");
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <div className="bg-slate-900 rounded-xl p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-1">PragatiAI</h1>
        <p className="text-slate-400 text-sm mb-6">{mode === "login" ? "Sign in to continue" : "Create your account"}</p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-slate-800 p-2 rounded-lg mb-3"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-slate-800 p-2 rounded-lg mb-3"
        />
        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded-lg font-semibold mb-3"
        >
          {mode === "login" ? "Login" : "Register"}
        </button>

        <button
          onClick={() => setMode(mode === "login" ? "register" : "login")}
          className="w-full text-sm text-slate-400 hover:text-white"
        >
          {mode === "login" ? "New here? Create an account" : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
}
