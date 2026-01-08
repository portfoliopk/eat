"use client";
import { useEffect, useState } from "react";
import RestaurantMediaModal from "../components/RestaurantMediaModal";

export default function RestaurantProfile() {
  const [form, setForm] = useState(null);
  const [showMedia, setShowMedia] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("/api/restaurant/profile", {
      headers: { Authorization: "Bearer " + token },
    })
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          setForm({
            ...res.restaurant,
            description: res.restaurant.description || "",
          });
        }
      });
  }, []);

  async function saveProfile(updatedForm) {
    const token = localStorage.getItem("token");
    await fetch("/api/restaurant/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(updatedForm),
    });
  }

  if (!form) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-bold mb-4">
        Restaurant Profile
      </h1>

      {/* PROFILE IMAGE */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-24 h-24 rounded-full overflow-hidden border">
          {form.logo_path ? (
            <img
              src={form.logo_path}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
        </div>

        <button
          onClick={() => setShowMedia(true)}
          className="bg-gray-200 px-4 py-2 rounded"
        >
          Change Image
        </button>
      </div>

      <label>Name</label>
      <input
        className="border p-2 w-full mb-3"
        value={form.name}
        onChange={e =>
          setForm({ ...form, name: e.target.value })
        }
      />

      <label>Description</label>
      <textarea
        className="border p-2 w-full mb-3"
        value={form.description}
        onChange={e =>
          setForm({ ...form, description: e.target.value })
        }
      />

      <label>Status</label>
      <select
        className="border p-2 w-full mb-4"
        value={form.status}
        onChange={e =>
          setForm({ ...form, status: e.target.value })
        }
      >
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>

      <button
        onClick={() => saveProfile(form)}
        className="bg-pink-500 text-white px-4 py-2 rounded"
      >
        Save
      </button>

      {/* MEDIA MODAL */}
      <RestaurantMediaModal
        open={showMedia}
        onClose={() => setShowMedia(false)}
        onSelect={img => {
          const updated = {
            ...form,
            logo_id: img.id,
            logo_path: img.file_path,
          };
          setForm(updated);
          saveProfile(updated);
        }}
      />
    </div>
  );
}
