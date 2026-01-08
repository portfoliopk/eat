"use client";
import { useEffect, useState } from "react";
import MediaModal from "../../components/MediaModal";

export default function AdminRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showMedia, setShowMedia] = useState(false);

  const [form, setForm] = useState({
    id: null,
    name: "",
    description: "",
    status: "active",
    logo_id: null,
    logo: null,
  });

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  function loadRestaurants() {
    fetch("/api/restaurants")
      .then(res => res.json())
      .then(data => data.success && setRestaurants(data.restaurants));
  }

  useEffect(() => {
    loadRestaurants();
  }, []);

  function openAdd() {
    setForm({
      id: null,
      name: "",
      description: "",
      status: "active",
      logo_id: null,
      logo: null,
    });
    setShowForm(true);
  }

  function openEdit(r) {
    setForm({
      id: r.id,
      name: r.name,
      description: r.description,
      status: r.status,
      logo_id: r.logo_id,
      logo: r.logo,
    });
    setShowForm(true);
  }

  async function saveRestaurant() {
    const method = form.id ? "PUT" : "POST";

    await fetch("/api/restaurants", {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(form),
    });

    setShowForm(false);
    loadRestaurants();
  }

  async function deleteRestaurant(id) {
    if (!confirm("Delete this restaurant?")) return;

    await fetch("/api/restaurants", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ id }),
    });

    loadRestaurants();
  }

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Restaurants</h1>
        <button
          onClick={openAdd}
          className="bg-pink-500 text-white px-4 py-2 rounded"
        >
          + Add Restaurant
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded shadow">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Logo</th>
              <th className="p-3">Name</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {restaurants.map(r => (
              <tr key={r.id} className="border-t">
                <td className="p-3">
                  {r.logo && (
                    <img
                      src={r.logo}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                </td>
                <td className="p-3">{r.name}</td>
                <td className="p-3">{r.status}</td>
                <td className="p-3 space-x-3">
                  <button
                    onClick={() => openEdit(r)}
                    className="text-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteRestaurant(r.id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="font-bold mb-4">
              {form.id ? "Edit Restaurant" : "Add Restaurant"}
            </h2>

            <button
              onClick={() => setShowMedia(true)}
              className="mb-3 bg-gray-200 px-3 py-1 rounded"
            >
              Select Logo
            </button>

            {form.logo && (
              <img
                src={form.logo}
                className="w-20 h-20 object-cover mb-3"
              />
            )}

            <input
              className="border p-2 w-full mb-3"
              placeholder="Name"
              value={form.name}
              onChange={e =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <textarea
              className="border p-2 w-full mb-3"
              placeholder="Description"
              value={form.description}
              onChange={e =>
                setForm({ ...form, description: e.target.value })
              }
            />

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

            <div className="flex justify-end gap-3">
              <button onClick={() => setShowForm(false)}>
                Cancel
              </button>
              <button
                onClick={saveRestaurant}
                className="bg-pink-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MEDIA MODAL */}
      <MediaModal
        open={showMedia}
        onClose={() => setShowMedia(false)}
        onSelect={img =>
          setForm({
            ...form,
            logo_id: img.id,
            logo: img.file_path,
          })
        }
      />
    </div>
  );
}
