"use client";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Link from "next/link";

export default function CustomerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/customer/orders/list", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then(res => res.json())
      .then(res => {
        if (res.success) setOrders(res.orders);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <Header />

      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">
          My orders
        </h1>

        {orders.length === 0 && (
          <p className="text-gray-500">
            No orders yet
          </p>
        )}

        <div className="space-y-4">
          {orders.map(o => (
            <div
              key={o.id}
              className="bg-white rounded-lg p-5 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">
                  Order #{o.id}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(o.created_at).toLocaleString()}
                </p>
                <p className="text-sm capitalize">
                  Status: {o.status}
                </p>
              </div>

              <div className="text-right">
                <p className="font-bold">
                  Rs {o.total}
                </p>
                <Link
                  href={`/account/orders/${o.id}`}
                  className="text-[#d70f64] text-sm"
                >
                  View details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
