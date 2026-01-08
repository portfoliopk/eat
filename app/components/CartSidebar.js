// 1️⃣ FIX: CONNECT SIDE CART → CHECKOUT
// FILE: components/CartSidebar.js

"use client";
import { useRouter } from "next/navigation";
import { increase, decrease, removeItem } from "../lib/cart";

export default function CartSidebar({ cart, setCart }) {
  const router = useRouter();

  const subtotal = cart.reduce(
    (s, i) => s + i.price * i.qty,
    0
  );

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 sticky top-28">
      <h3 className="text-lg font-bold mb-4">Your order</h3>

      {cart.length === 0 && (
        <p className="text-gray-500 text-sm">
          Add items to start your order
        </p>
      )}

      {cart.map(item => (
        <div key={item.id} className="mb-4">
          <div className="flex justify-between">
            <span className="font-semibold">{item.name}</span>
            <span>Rs {item.price * item.qty}</span>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <button
              onClick={() => setCart(decrease(item.id))}
              className="px-2 border"
            >
              −
            </button>
            <span>{item.qty}</span>
            <button
              onClick={() => setCart(increase(item.id))}
              className="px-2 border"
            >
              +
            </button>

            <button
              onClick={() => setCart(removeItem(item.id))}
              className="ml-auto text-red-500 text-sm"
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <div className="border-t pt-4">
        <div className="flex justify-between font-bold mb-3">
          <span>Subtotal</span>
          <span>Rs {subtotal}</span>
        </div>

        <button
          disabled={!cart.length}
          onClick={() => router.push("/checkout")}
          className={`w-full py-3 rounded-lg ${
            cart.length
              ? "bg-[#d70f64] text-white"
              : "bg-gray-300 text-white"
          }`}
        >
          Checkout
        </button>
      </div>
    </div>
  );
}
