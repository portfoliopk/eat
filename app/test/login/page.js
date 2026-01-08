"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!data.success) {
      setError(data.message || "Login failed");
      return;
    }

    // ✅ THIS IS THE PLACE
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.user.role);
    localStorage.setItem("user_id", data.user.id); // optional but useful

    // ✅ REDIRECT BASED ON ROLE
    if (data.user.role === "admin") {
      router.push("/admin/dashboard");
    } else if (data.user.role === "restaurant") {
      router.push("/restaurant/dashboard");
    } else {
      router.push("/");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow w-96"
      >
        <h1 className="text-xl font-bold mb-4">Login</h1>

        {error && (
          <p className="text-red-500 mb-3">{error}</p>
        )}

        <input
          className="border p-2 w-full mb-3"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="border p-2 w-full mb-4"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button className="bg-pink-500 text-white w-full py-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}
