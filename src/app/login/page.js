"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { loginUser } from "../utils/api";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      toast.error("Please enter both username and password");
      return;
    }

    try {
      setLoading(true);

      const data = await loginUser(username, password);

      // If backend returns token
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      toast.success("Login successful!");

      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (error) {
      toast.error(error.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-900 to-blue-700">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          ગુજરાત ન્યૂઝ
        </h1>

        <input
          type="text"
          placeholder="editor@gujaratnews.com"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border border-gray-300 p-4 rounded-xl mb-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          placeholder="Enter a secure password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 p-4 rounded-xl mb-6 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-900 text-white py-3 rounded-xl font-semibold hover:bg-blue-800 transition duration-300 cursor-pointer disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}
