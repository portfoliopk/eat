"use client";
import { useEffect, useState } from "react";
import RestaurantMediaModal from "../components/RestaurantMediaModal";

export default function RestaurantMenu() {
  const [menu, setMenu] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    category_name: "",
    image_id: null,
  });
  const [showMedia, setShowMedia] = useState(false);

  const token = localStorage.getItem("token");

  function loadMenu() {
    fetch("/api/restaurant/menu", {
      headers: { Authorization: "Bearer " + token },
    })
      .then(res => res.json())
      .then(res => {
        if (res.success) setMenu(res.menu);
      });
  }

  useEffect(() => {
    loadMenu();
  }, []);

  async function addItem() {
    await fetch("/api/restaurant/menu", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(form),
    });

    setForm({
      name: "",
      price: "",
      category_name: "",
      image_id: null,
    });
    loadMenu();
  }

  async function updateItem(item) {
    await fetch("/api/restaurant/menu", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(item),
    });

    loadMenu();
  }

  async function deleteItem(id) {
    if (!confirm("Delete this item?")) return;

    await fetch("/api/restaurant/menu", {
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
      <h1 className="text-2xl font-bold mb-4">Menu Management</h1>

      {/* ADD ITEM */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="font-semibold mb-3">Add Menu Item</h2>

        <div className="flex gap-2 mb-3">
          <input
            className="border p-2"
            placeholder="Name"
            value={form.name}
            onChange={e =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            className="border p-2"
            placeholder="Price"
            value={form.price}
            onChange={e =>
              setForm({ ...form, price: e.target.value })
            }
          />

          <input
            className="border p-2"
            placeholder="Category"
            value={form.category_name}
            onChange={e =>
              setForm({
                ...form,
                category_name: e.target.value,
              })
            }
          />
        </div>

        {/* IMAGE PICKER */}
        <div className="flex items-center gap-4 mb-4">
          {form.image_id ? (
            <span className="text-green-600">
              Image Selected
            </span>
          ) : (
            <span className="text-gray-400">
              No image selected
            </span>
          )}

          <button
            onClick={() => setShowMedia(true)}
            className="bg-gray-200 px-3 py-1 rounded"
          >
            Select Image
          </button>
        </div>

        <button
          onClick={addItem}
          className="bg-pink-500 text-white px-4 py-2 rounded"
        >
          Add Item
        </button>
      </div>

      {/* MENU TABLE */}
      <table className="w-full bg-white shadow">
        <thead>
          <tr>
            <th className="p-3">Image</th>
            <th className="p-3">Name</th>
            <th className="p-3">Price</th>
            <th className="p-3">Category</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {menu.map(item => (
            <tr key={item.id}>
             <td className="p-3">
  {item.image_path ? (
    <img
      src={item.image_path}
      className="w-12 h-12 object-cover rounded"
    />
  ) : (
    "-"
  )}
</td>

              <td className="p-3">
                <input
                  className="border p-1"
                  value={item.name}
                  onChange={e =>
                    setMenu(menu.map(m =>
                      m.id === item.id
                        ? { ...m, name: e.target.value }
                        : m
                    ))
                  }
                />
              </td>

              <td className="p-3">
                <input
                  className="border p-1"
                  value={item.price}
                  onChange={e =>
                    setMenu(menu.map(m =>
                      m.id === item.id
                        ? { ...m, price: e.target.value }
                        : m
                    ))
                  }
                />
              </td>

              <td className="p-3">{item.category_name}</td>

              <td className="p-3">
                <button
                  onClick={() => updateItem(item)}
                  className="bg-green-500 text-white px-2 py-1 mr-2 rounded"
                >
                  Save
                </button>

                <button
                  onClick={() => deleteItem(item.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MEDIA MODAL */}
      <RestaurantMediaModal
        open={showMedia}
        onClose={() => setShowMedia(false)}
        onSelect={img =>
          setForm({ ...form, image_id: img.id })
        }
      />
    </div>
  );
}
