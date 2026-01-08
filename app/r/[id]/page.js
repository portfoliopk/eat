"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import {
  addToCart,
  getCart,
} from "../../lib/cart";
import CartSidebar from "../../components/CartSidebar";

export default function RestaurantDetail() {
  const SITE = process.env.NEXT_PUBLIC_SITE_NAME || "foods";
  const pathname = usePathname();
  const id = pathname.split("/").pop();

  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [error, setError] = useState("");
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setCart(getCart());
  }, []);

  useEffect(() => {
    if (!id) return;

    async function load() {
      try {
        const res = await fetch(
          `/api/customer/restaurant/${id}`
        );
        const data = await res.json();

        if (!data.success) {
          setError("Restaurant not found");
          setLoading(false);
          return;
        }

        setRestaurant(data.restaurant);
        setMenu(data.menu || []);
        setLoading(false);
      } catch {
        setError("Server error");
        setLoading(false);
      }
    }

    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-[#f7f7f7] min-h-screen flex flex-col">
      <Header />

      {/* HERO */}
      <section className="bg-white border-b">
        <div className="w-full px-10 py-8 flex gap-6">
          <div className="w-40 h-40 rounded-xl overflow-hidden bg-gray-200">
            {restaurant.image && (
              <img
                src={restaurant.image}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">
              {restaurant.name}
            </h1>
            <p className="text-gray-500 mb-3">
              {restaurant.description}
            </p>
            <span className="text-sm text-green-600 font-semibold">
              Open on {SITE}
            </span>
          </div>
        </div>
      </section>

      {/* MAIN FOODPANDA LAYOUT */}
      <section className="w-full px-10 py-10 flex gap-8 flex-1">
        {/* LEFT – MENU */}
        <div className="flex-1">
          <h2 className="text-xl font-bold mb-6">
            Menu
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {menu.map(item => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm p-4 flex gap-4 hover:shadow-md transition"
              >
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-200">
                  {item.image && (
                    <img
                      src={item.image}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-lg">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {item.category_name}
                  </p>
                  <p className="font-bold mt-1">
                    Rs {item.price}
                  </p>
                </div>

                <button
                  onClick={() =>
                    setCart(
                      addToCart({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                      })
                    )
                  }
                  className="bg-[#d70f64] text-white w-10 h-10 rounded-full flex items-center justify-center text-xl self-center"
                >
                  +
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT – CART */}
        <div className="w-[360px] hidden lg:block">
          <CartSidebar
            cart={cart}
            setCart={setCart}
          />
        </div>
      </section>

      <Footer />
    </div>
  );
}
