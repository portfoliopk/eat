"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RestaurantDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      router.replace("/login");
      return;
    }

    if (role !== "restaurant") {
      router.replace("/");
      return;
    }

    fetch("/api/restaurant/dashboard", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then(res => res.json())
      .then(res => {
        if (!res.success) {
          setError(res.message);
          return;
        }
        setData(res.dashboard);
      })
      .catch(() => setError("Server error"));
  }, [router]);

  if (error) {
    return (
      <div className="p-6 text-red-600 font-semibold">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Restaurant Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Restaurant" value={data.restaurant} />
        <Card title="Menu Items" value={data.menu} />
        <Card title="Orders" value={data.orders} />
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white p-6 rounded shadow">
      <p className="text-gray-500">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
