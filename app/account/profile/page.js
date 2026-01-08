"use client";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import MediaModal from "../../components/MediaModal";

export default function CustomerProfile() {
  const [form, setForm] = useState(null);
  const [msg, setMsg] = useState("");
  const [openMedia, setOpenMedia] = useState(false);

  useEffect(() => {
    fetch("/api/customer/profile", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then(res => res.json())
      .then(res => {
        if (res.success) setForm(res.customer);
      });
  }, []);

  async function save() {
    const res = await fetch("/api/customer/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (data.success) setMsg("Profile updated");
  }

  if (!form) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <Header />

      <div className="max-w-xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">
          My profile
        </h1>

        {msg && (
          <p className="text-green-600 mb-3">
            {msg}
          </p>
        )}

        {/* AVATAR */}
        <div className="mb-6 flex items-center gap-4">
          <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
            {form.avatar_id && (
              <img
                src={`/api/media/${form.avatar_id}`}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <button
            onClick={() => setOpenMedia(true)}
            className="border px-4 py-2 rounded"
          >
            Change photo
          </button>
        </div>

        <label>Name</label>
        <input
          className="border p-3 w-full mb-3"
          value={form.name || ""}
          onChange={e =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <label>Phone</label>
        <input
          className="border p-3 w-full mb-3"
          value={form.phone || ""}
          onChange={e =>
            setForm({ ...form, phone: e.target.value })
          }
        />

        <label>Address</label>
        <textarea
          className="border p-3 w-full mb-4"
          value={form.address || ""}
          onChange={e =>
            setForm({
              ...form,
              address: e.target.value,
            })
          }
        />

        <button
          onClick={save}
          className="bg-[#d70f64] text-white px-6 py-3 rounded"
        >
          Save changes
        </button>
      </div>

      <MediaModal
        open={openMedia}
        onClose={() => setOpenMedia(false)}
        onSelect={m =>
          setForm({ ...form, avatar_id: m.id })
        }
      />
    </div>
  );
}
