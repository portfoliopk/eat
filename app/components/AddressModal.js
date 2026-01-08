"use client";
import { useState } from "react";

export default function AddressModal({ data, onClose, onSaved }) {
  const [note, setNote] = useState("");
  const [type, setType] = useState("home");

  async function save() {
    await fetch("/api/customer/address", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        ...data,
        note,
        type,
      }),
    });

    onSaved();
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-[420px] rounded-xl p-6">
        <h2 className="font-bold mb-4">Save address</h2>

        <input
          className="border p-3 w-full mb-3"
          value={data.address}
          readOnly
        />

        <input
          className="border p-3 w-full mb-3"
          placeholder="Address note"
          onChange={e => setNote(e.target.value)}
        />

        <div className="flex gap-3 mb-4">
          {["home", "office", "other"].map(t => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`px-4 py-2 border rounded ${
                type === t ? "bg-[#d70f64] text-white" : ""
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <button
          onClick={save}
          className="w-full bg-[#d70f64] text-white py-3 rounded"
        >
          Use this address
        </button>
      </div>
    </div>
  );
}
