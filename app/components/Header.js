"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SideCart from "./SideCart";
import LocationInput from "./LocationInput";

export default function Header() {
  const router = useRouter();
  const [role, setRole] = useState(null);
  const [openAcc, setOpenAcc] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [address, setAddress] = useState("");
  const [openLocation, setOpenLocation] = useState(false);

  useEffect(() => {
    setRole(localStorage.getItem("role"));
    const a = localStorage.getItem("selected_address");
    if (a) setAddress(a);
  }, []);

  function logout() {
    localStorage.clear();
    router.push("/login");
  }

  return (
    <>
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

          {/* LEFT */}
          <div className="flex items-center gap-4">
            <Link href="/" className="text-2xl font-bold text-[#d70f64]">
              foods
            </Link>

            {role === "customer" && (
              <button onClick={() => setOpenCart(true)}>🛒</button>
            )}
          </div>

          {/* CENTER — EDITABLE LOCATION */}
          <button
            onClick={() => setOpenLocation(true)}
            className="text-sm max-w-md truncate flex items-center gap-1 text-gray-700 hover:underline"
          >
            📍 {address || "Select delivery location"}
          </button>

          {/* RIGHT */}
          <nav className="flex items-center gap-6 relative">
            {!role && (
              <>
                <Link href="/login">Login</Link>
                <Link
                  href="/signup"
                  className="bg-[#d70f64] text-white px-4 py-2 rounded"
                >
                  Sign up
                </Link>
              </>
            )}

            {role === "customer" && (
              <div className="relative">
                <button onClick={() => setOpenAcc(!openAcc)}>
                  My account ▾
                </button>

                {openAcc && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow">
                    <Link href="/account" className="block px-4 py-2">
                      Profile
                    </Link>
                    <Link href="/account" className="block px-4 py-2">
                      Orders
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* LOCATION MODAL */}
      {openLocation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl">
            <LocationInput
              onSaved={() => window.location.reload()}
            />
            <button
              className="mt-3 text-sm text-gray-500"
              onClick={() => setOpenLocation(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <SideCart open={openCart} onClose={() => setOpenCart(false)} />
    </>
  );
}
