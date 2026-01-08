"use client";
import { useEffect, useState } from "react";

export default function RestaurantMediaModal({ open, onClose, onSelect }) {
  const [media, setMedia] = useState([]);
  const [file, setFile] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!open) return;

    fetch("/api/restaurant/media", {
      headers: { Authorization: "Bearer " + token },
    })
      .then(res => res.json())
      .then(res => {
        if (res.success) setMedia(res.media);
      });
  }, [open]);

  async function upload() {
    if (!file) return;

    const fd = new FormData();
    fd.append("file", file);

    await fetch("/api/restaurant/media", {
      method: "POST",
      headers: { Authorization: "Bearer " + token },
      body: fd,
    });

    const res = await fetch("/api/restaurant/media", {
      headers: { Authorization: "Bearer " + token },
    });
    const data = await res.json();
    setMedia(data.media);
    setFile(null);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white w-[720px] p-6 rounded-lg">
        <div className="flex justify-between mb-4">
          <h2 className="font-bold">Media Library</h2>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="flex gap-3 mb-4">
          <input type="file" onChange={e => setFile(e.target.files[0])} />
          <button onClick={upload} className="bg-pink-500 text-white px-4 rounded">
            Upload
          </button>
        </div>

        <div className="grid grid-cols-5 gap-3 max-h-[300px] overflow-y-auto">
          {media.map(m => (
            <img
              key={m.id}
              src={m.file_path}
              className="cursor-pointer border rounded hover:border-pink-500"
              onClick={() => {
                onSelect(m);
                onClose();
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
