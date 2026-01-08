"use client";
import { useEffect, useState } from "react";

export default function RestaurantOrders() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  function loadOrders() {
    fetch("/api/restaurant/orders", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setOrders(data.orders);
      });
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function updateStatus(id, status) {
    await fetch("/api/restaurant/orders", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ order_id: id, status }),
    });

    loadOrders();
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Incoming Orders
      </h1>

      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr>
            <th className="p-3">Order ID</th>
            <th className="p-3">Customer</th>
            <th className="p-3">Total</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>

        <tbody>
          {orders.map(order => (
            <tr key={order.id} className="border-t">
              <td className="p-3">{order.id}</td>
              <td className="p-3">{order.customer_name}</td>
              <td className="p-3">Rs {order.total}</td>
              <td className="p-3">
                <select
                  value={order.status}
                  onChange={e =>
                    updateStatus(order.id, e.target.value)
                  }
                  className="border p-2"
                >
                  <option value="pending">Pending</option>
                  <option value="preparing">Preparing</option>
                  <option value="on_the_way">On the way</option>
                  <option value="delivered">Delivered</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
