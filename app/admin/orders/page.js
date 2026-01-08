"use client";
import { useEffect, useState } from "react";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [riders, setRiders] = useState([]);

  function loadOrders() {
    fetch("/api/orders")
      .then(res => res.json())
      .then(data => data.success && setOrders(data.orders));
  }

  function loadRiders() {
    fetch("/api/users")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setRiders(data.users.filter(u => u.role === "rider"));
        }
      });
  }

  useEffect(() => {
    loadOrders();
    loadRiders();
  }, []);

  async function updateOrder(order_id, payload) {
    await fetch("/api/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order_id, ...payload }),
    });
    loadOrders();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Orders</h1>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Restaurant</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
              <th className="p-4">Rider</th>
            </tr>
          </thead>

          <tbody>
            {orders.map(o => (
              <tr key={o.id} className="border-t">
                <td className="p-4">#{o.id}</td>
                <td className="p-4">{o.customer_name}</td>
                <td className="p-4">{o.restaurant_name}</td>
                <td className="p-4">Rs {o.total}</td>

                <td className="p-4">
                  <select
                    value={o.status}
                    onChange={e =>
                      updateOrder(o.id, { status: e.target.value })
                    }
                    className="border p-1 rounded"
                  >
                    <option value="pending">Pending</option>
                    <option value="preparing">Preparing</option>
                    <option value="on_the_way">On the way</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </td>

                <td className="p-4">
                  <select
                    value={o.rider_id || ""}
                    onChange={e =>
                      updateOrder(o.id, { rider_id: e.target.value })
                    }
                    className="border p-1 rounded"
                  >
                    <option value="">Assign Rider</option>
                    {riders.map(r => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}

            {orders.length === 0 && (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
