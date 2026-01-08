"use client";
import { useEffect, useState } from "react";

export default function AdminMedia() {
  const [media, setMedia] = useState([]);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  function loadMedia() {
    fetch("/api/media")
      .then(res => res.json())
      .then(data => {
        if (data.success) setMedia(data.media);
      });
  }

  useEffect(() => {
    loadMedia();
  }, []);

  async function upload() {
    if (!file) {
      setError("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/media", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: formData,
    });

    const data = await res.json();
    if (!data.success) {
      setError("Upload failed");
      return;
    }

    setFile(null);
    setError("");
    loadMedia();
  }

  async function deleteImage(id) {
    if (!confirm("Delete this image?")) return;

    await fetch("/api/media", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ id }),
    });

    loadMedia();
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Media</h1>

      {error && <p className="text-red-500 mb-3">{error}</p>}

      {/* UPLOAD */}
      <div className="bg-white p-4 rounded shadow mb-6 flex gap-4">
        <input
          type="file"
          onChange={e => setFile(e.target.files[0])}
        />
        <button
          onClick={upload}
          className="bg-pink-500 text-white px-4 py-2 rounded"
        >
          Upload
        </button>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {media.map(m => (
          <div
            key={m.id}
            className="bg-white p-2 rounded shadow relative"
          >
            <img
              src={m.file_path}
              className="w-full h-32 object-cover rounded"
            />

            <button
              onClick={() => deleteImage(m.id)}
              className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 rounded"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
