"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Signup() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  async function submit() {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!data.success) {
      alert(data.message);
      return;
    }

    router.push("/login");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 flex items-center justify-center">
        <div className="bg-white p-6 rounded w-96">
          <h1 className="text-xl font-bold mb-4">Customer Sign up</h1>

          <input
            className="border p-2 w-full mb-3"
            placeholder="Name"
            onChange={e =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            className="border p-2 w-full mb-3"
            placeholder="Email"
            onChange={e =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            type="password"
            className="border p-2 w-full mb-4"
            placeholder="Password"
            onChange={e =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <button
            onClick={submit}
            className="bg-[#d70f64] text-white w-full py-2 rounded"
          >
            Create account
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
