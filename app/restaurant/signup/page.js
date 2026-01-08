"use client";

import { useState } from "react";


export default function RestaurantSignup() {
  const [form, setForm] = useState({
    owner_name: "",
    email: "",
    password: "",
    restaurant_name: "",
    description: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/restaurant/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      alert(data.message);
      return;
    }

    window.location.href = "/restaurant/login";
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={submit}
        className="bg-white p-6 w-full max-w-xl rounded-2xl shadow"
      >
        <h1 className="text-2xl font-bold text-center text-[#d70f64] mb-6">
          Restaurant Sign Up
        </h1>

        <input
          name="owner_name"
          placeholder="Owner name"
          className="w-full border p-3 rounded mb-3"
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded mb-3"
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded mb-3"
          onChange={handleChange}
          required
        />

        <input
          name="restaurant_name"
          placeholder="Restaurant name"
          className="w-full border p-3 rounded mb-3"
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          className="w-full border p-3 rounded mb-4"
          onChange={handleChange}
        />

        {/* SAME LOCATION COMPONENT */}
        <LocationInput
          onSaved={() => {
            const addr = localStorage.getItem("selected_address");
            setForm(f => ({ ...f, address: addr }));
          }}
        />

        <button
          className="w-full mt-6 bg-[#d70f64] text-white py-3 rounded-xl"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Restaurant"}
        </button>
      </form>
    </div>
  );
}
