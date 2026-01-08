"use client";
import Link from "next/link";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#1a1a1a] text-white p-6">
        <h2 className="text-xl font-bold mb-6 text-pink-500">
          Foodpanda Admin
        </h2>

        <nav className="space-y-3">
          <Link className="block hover:text-pink-400" href="/admin/dashboard">
            Dashboard
          </Link>
          <Link className="block hover:text-pink-400" href="/admin/users">
            Users
          </Link>
          <Link className="block hover:text-pink-400" href="/admin/restaurants">
            Restaurants
          </Link>
          <Link className="block hover:text-pink-400" href="/admin/menu">
            Menu
          </Link>
          <Link className="block hover:text-pink-400" href="/admin/orders">
            Orders
          </Link>
          <Link className="block hover:text-pink-400" href="/admin/media">
            Media
          </Link>
        </nav>
      </aside>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <h1 className="text-lg font-semibold text-gray-700">
            Admin Dashboard
          </h1>

          <div className="flex items-center gap-4">
            <span className="text-gray-600">Admin</span>

            <button
              className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-1.5 rounded-md text-sm"
              onClick={() => {
                document.cookie =
                  "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
                window.location.href = "/test/login";
              }}
            >
              Logout
            </button>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
