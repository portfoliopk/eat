"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "../../../components/Header";

export default function OrderDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`/api/customer/orders/${id}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then(res => res.json())
      .then(res => {
        if (res.success) setData(res);
      });
  }, [id]);

  if (!data) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <Header />

      <div className="max-w-xl mx-auto p-6 bg-white mt-6 rounded">
        <h1 className="text-xl font-bold mb-4">
          Order #{data.order.id}
        </h1>

        <p>Status: {data.order.status}</p>

        <div className="border-t mt-4 pt-4">
          {data.items.map((i, idx) => (
            <div
              key={idx}
              className="flex justify-between mb-2"
            >
              <span>{i.name}</span>
              <span>
                {i.qty} × Rs {i.price}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t mt-4 pt-4 flex justify-between font-bold">
          <span>Total</span>
          <span>Rs {data.order.total}</span>
        </div>
      </div>
    </div>
  );
}
