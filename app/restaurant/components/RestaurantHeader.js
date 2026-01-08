"use client";
import { useRouter } from "next/navigation";

export default function RestaurantHeader() {
  const router = useRouter();

  function logout() {
    localStorage.clear();
    router.replace("/login");
  }

  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between">
      <h1 className="font-semibold">Restaurant Dashboard</h1>

      <button
        onClick={logout}
        className="text-red-600 font-semibold"
      >
        Logout
      </button>
    </header>
  );
}
