"use client";
import { useEffect, useState } from "react";
import RestaurantMediaModal from "../components/RestaurantMediaModal";

export default function RestaurantMediaPage() {
  const [media, setMedia] = useState([]);
  const [show, setShow] = useState(false);
  const token = localStorage.getItem("token");

  function load() {
    fetch("/api/restaurant/media", {
      headers: { Authorization: "Bearer " + token },
    })
      .then(r => r.json())
      .then(r => r.success && setMedia(r.media));
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(id) {
    await fetch("/api/restaurant/media", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ id }),
    });
    load();
  }

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Media</h1>
        <button
          onClick={() => setShow(true)}
          className="bg-pink-500 text-white px-4 py-2 rounded"
        >
          Upload
        </button>
      </div>

      <div className="grid grid-cols-6 gap-4">
        {media.map(m => (
          <div key={m.id} className="relative">
            <img
              src={m.file_path}
              className="w-full h-24 object-cover rounded border"
            />
            <button
              onClick={() => remove(m.id)}
              className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <RestaurantMediaModal
        open={show}
        onClose={() => setShow(false)}
        onSelect={() => {
          setShow(false);
          load();
        }}
      />
    </div>
  );
}
