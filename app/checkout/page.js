"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getCart, clearCart } from "../lib/cart";

export default function Checkout() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    const c = getCart();
    if (!c.length) {
      router.replace("/");
      return;
    }
    setCart(c);

    fetch("/api/customer/address/get", {
      headers: { Authorization: "Bearer " + token },
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.address?.address) {
          setAddress(data.address);
        }
      });
  }, [router]);

  const total = cart.reduce(
    (s, i) => s + i.price * i.qty,
    0
  );

  async function placeOrder() {
    if (!address?.address) {
      alert("Please add delivery address");
      router.push("/");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/customer/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        items: cart,
        total,
        address,
      }),
    });

    const data = await res.json();

    if (!data.success) {
      alert("Order failed");
      setLoading(false);
      return;
    }

    clearCart();
    router.replace("/order-success");
  }

  return (
    <div className="min-h-screen bg-[#f7f7f7] flex flex-col">
      <Header />

      <div className="max-w-5xl mx-auto w-full p-6 grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
        {/* LEFT */}
        <div className="bg-white p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-4">
            Delivery address
          </h2>

          {address ? (
            <div className="border rounded p-4">
              <p className="font-semibold">
                {address.address_type}
              </p>
              <p className="text-gray-600 text-sm">
                {address.address}
              </p>
              {address.address_note && (
                <p className="text-xs text-gray-500 mt-1">
                  Note: {address.address_note}
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-500">
              No address saved
            </p>
          )}
        </div>

        {/* RIGHT */}
        <div className="bg-white p-6 rounded-xl sticky top-24">
          <h2 className="text-xl font-bold mb-4">
            Order summary
          </h2>

          {cart.map(i => (
            <div
              key={i.id}
              className="flex justify-between mb-2 text-sm"
            >
              <span>{i.qty} × {i.name}</span>
              <span>Rs {i.price * i.qty}</span>
            </div>
          ))}

          <div className="border-t mt-4 pt-4 flex justify-between font-bold">
            <span>Total</span>
            <span>Rs {total}</span>
          </div>

          <button
            onClick={placeOrder}
            disabled={loading}
            className="w-full bg-[#d70f64] text-white py-3 rounded-lg mt-6"
          >
            {loading ? "Placing order..." : "Place order"}
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
