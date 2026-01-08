"use client";
import { useEffect, useState } from "react";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    id: null,
    name: "",
    email: "",
    password: "",
    role: "customer",
  });

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  /* ===============================
     LOAD USERS
  ================================ */
  function loadUsers() {
    fetch("/api/users", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (!data.success) setError(data.message);
        else setUsers(data.users);
      });
  }

  useEffect(() => {
    if (!token) {
      setError("Please login again");
      return;
    }
    loadUsers();
  }, []);

  /* ===============================
     OPEN FORM
  ================================ */
  function openAdd() {
    setForm({
      id: null,
      name: "",
      email: "",
      password: "",
      role: "customer",
    });
    setShowForm(true);
  }

  function openEdit(user) {
    setForm({ ...user, password: "" });
    setShowForm(true);
  }

  /* ===============================
     SAVE USER
  ================================ */
  async function saveUser() {
    const method = form.id ? "PUT" : "POST";

    await fetch("/api/users", {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(form),
    });

    setShowForm(false);
    loadUsers();
  }

  /* ===============================
     DELETE USER
  ================================ */
  async function deleteUser(id) {
    if (!confirm("Delete this user?")) return;

    await fetch("/api/users", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ id }),
    });

    loadUsers();
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
        <button
          onClick={openAdd}
          className="bg-pink-500 text-white px-4 py-2 rounded"
        >
          + Add User
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* TABLE */}
      <div className="bg-white rounded shadow">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-t">
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.role}</td>
                <td className="p-3 space-x-3">
                  <button
                    onClick={() => openEdit(u)}
                    className="text-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteUser(u.id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="p-4 text-center text-gray-500"
                >
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="text-lg font-semibold mb-4">
              {form.id ? "Edit User" : "Add User"}
            </h2>

            <input
              className="border p-2 w-full mb-3"
              placeholder="Name"
              value={form.name}
              onChange={e =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              className="border p-2 w-full mb-3"
              placeholder="Email"
              value={form.email}
              onChange={e =>
                setForm({ ...form, email: e.target.value })
              }
            />

            {!form.id && (
              <input
                className="border p-2 w-full mb-3"
                placeholder="Password"
                type="password"
                value={form.password}
                onChange={e =>
                  setForm({ ...form, password: e.target.value })
                }
              />
            )}

            <select
              className="border p-2 w-full mb-4"
              value={form.role}
              onChange={e =>
                setForm({ ...form, role: e.target.value })
              }
            >
              <option value="admin">Admin</option>
              <option value="restaurant">Restaurant</option>
              <option value="rider">Rider</option>
              <option value="customer">Customer</option>
            </select>

            <div className="flex justify-end gap-3">
              <button onClick={() => setShowForm(false)}>
                Cancel
              </button>
              <button
                onClick={saveUser}
                className="bg-pink-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
