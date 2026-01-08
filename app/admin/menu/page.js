"use client";
import { useEffect, useState } from "react";
import MediaModal from "../../components/MediaModal";

export default function AdminMenu() {
  const [menu, setMenu] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showMedia, setShowMedia] = useState(false);

  const [form, setForm] = useState({
    id: null,
    name: "",
    price: "",
    restaurant_id: "",
    category_name: "",
    image_id: null,
    image: null,
  });

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  /* LOAD MENU */
  function loadMenu() {
    fetch("/api/menu")
      .then(res => res.json())
      .then(data => data.success && setMenu(data.menu));
  }

  function loadRestaurants() {
    fetch("/api/restaurants")
      .then(res => res.json())
      .then(data => data.success && setRestaurants(data.restaurants));
  }

  useEffect(() => {
    loadMenu();
    loadRestaurants();
  }, []);

  function openAdd() {
    setForm({
      id: null,
      name: "",
      price: "",
      restaurant_id: restaurants[0]?.id || "",
      category_name: "",
      image_id: null,
      image: null,
    });
    setShowForm(true);
  }

  function openEdit(m) {
    setForm({
      id: m.id,
      name: m.name,
      price: m.price,
      restaurant_id: m.restaurant_id,
      category_name: m.category_name,
      image_id: m.image_id,
      image: m.image,
    });
    setShowForm(true);
  }

  async function saveMenu() {
    if (
      !form.name ||
      !form.price ||
      !form.restaurant_id ||
      !form.category_name
    ) {
      alert("Please fill all fields");
      return;
    }

    const method = form.id ? "PUT" : "POST";

    await fetch("/api/menu", {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(form),
    });

    setShowForm(false);
    loadMenu();
  }

  async function deleteMenu(id) {
    if (!confirm("Delete this item?")) return;

    await fetch("/api/menu", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ id }),
    });

    loadMenu();
  }

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Menu Items</h1>
        <button
          onClick={openAdd}
          className="bg-pink-500 text-white px-4 py-2 rounded"
        >
          + Add Item
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded shadow">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Image</th>
              <th className="p-3">Item</th>
              <th className="p-3">Restaurant</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {menu.map(m => (
              <tr key={m.id} className="border-t">
                <td className="p-3">
                  {m.image && (
                    <img
                      src={m.image}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                </td>
                <td className="p-3">{m.name}</td>
                <td className="p-3">{m.restaurant_name}</td>
                <td className="p-3">{m.category_name}</td>
                <td className="p-3">Rs {m.price}</td>
                <td className="p-3 space-x-3">
                  <button
                    onClick={() => openEdit(m)}
                    className="text-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteMenu(m.id)}
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
              {form.id ? "Edit Menu Item" : "Add Menu Item"}
            </h2>

            <button
              onClick={() => setShowMedia(true)}
              className="mb-3 bg-gray-200 px-3 py-1 rounded"
            >
              Select Image
            </button>

            {form.image && (
              <img
                src={form.image}
                className="w-20 h-20 object-cover mb-3"
              />
            )}

            <input
              className="border p-2 w-full mb-3"
              placeholder="Item name"
              value={form.name}
              onChange={e =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              className="border p-2 w-full mb-3"
              placeholder="Price"
              value={form.price}
              onChange={e =>
                setForm({ ...form, price: e.target.value })
              }
            />

            <input
              className="border p-2 w-full mb-3"
              placeholder="Category (e.g. Pizza, Burger)"
              value={form.category_name}
              onChange={e =>
                setForm({
                  ...form,
                  category_name: e.target.value,
                })
              }
            />

            <select
              className="border p-2 w-full mb-4"
              value={form.restaurant_id}
              onChange={e =>
                setForm({
                  ...form,
                  restaurant_id: e.target.value,
                })
              }
            >
              <option value="">Select Restaurant</option>
              {restaurants.map(r => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-3">
              <button onClick={() => setShowForm(false)}>
                Cancel
              </button>
              <button
                onClick={saveMenu}
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
            image_id: img.id,
            image: img.file_path,
          })
        }
      />
    </div>
  );
}
