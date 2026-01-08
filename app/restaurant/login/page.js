"use client";

import { useState } from "react";

export default function RestaurantLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function submit(e) {
    e.preventDefault();

    const res = await fetch("/api/restaurant/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    localStorage.setItem("token", data.token);
    window.location.href = "/restaurant/dashboard";
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form className="bg-white p-6 w-full max-w-md rounded-2xl shadow" onSubmit={submit}>
        <h1 className="text-2xl font-bold text-center text-[#d70f64] mb-6">
          Restaurant Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded mb-3"
          onChange={e => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded mb-4"
          onChange={e => setPassword(e.target.value)}
          required
        />

        <button className="w-full bg-[#d70f64] text-white py-3 rounded-xl">
          Login
        </button>
      </form>
    </div>
  );
}
