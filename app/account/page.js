"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Account() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "customer") {
      router.replace("/login");
      return;
    }

    fetch("/api/customer/account", {
      headers: { Authorization: "Bearer " + token },
    })
      .then(r => r.json())
      .then(d => {
        if (!d.success) {
          setError("Unauthorized");
          return;
        }
        setUser(d.user);
        setOrders(d.orders || []);
      })
      .catch(() => setError("Server error"));
  }, [router]);

  if (error) {
    return <div className="p-10 text-center text-red-600">{error}</div>;
  }

  if (!user) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#f7f7f7] flex flex-col">
      <Header />

      <div className="max-w-4xl mx-auto w-full p-6 flex-1">
        <h1 className="text-2xl font-bold mb-6">My account</h1>

        <div className="bg-white rounded-xl p-6 mb-8">
          <h2 className="font-bold mb-4">Profile</h2>

          <input
            className="border p-3 w-full mb-3"
            value={user.name}
            readOnly
          />

          <input
            className="border p-3 w-full"
            value={user.phone || ""}
            readOnly
          />
        </div>

        <div className="bg-white rounded-xl p-6">
          <h2 className="font-bold mb-4">My orders</h2>

          {orders.length === 0 && (
            <p className="text-gray-500">No orders yet</p>
          )}

          {orders.map(o => (
            <div key={o.id} className="border-b py-3 flex justify-between">
              <span>Order #{o.id}</span>
              <span>Rs {o.total_amount}</span>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
