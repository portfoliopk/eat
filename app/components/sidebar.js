"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function RestaurantSidebar() {
  const pathname = usePathname();

  const linkClass = path =>
    `block px-4 py-2 rounded ${
      pathname === path
        ? "bg-pink-500 text-white"
        : "text-gray-700 hover:bg-gray-200"
    }`;

  return (
    <aside className="w-64 bg-white border-r">
      <div className="p-4 font-bold text-xl border-b">
        Restaurant Panel
      </div>

      <nav className="p-3 space-y-1">
        <Link
          href="/restaurant/dashboard"
          className={linkClass("/restaurant/dashboard")}
        >
          Dashboard
        </Link>

        <Link
          href="/restaurant/profile"
          className={linkClass("/restaurant/profile")}
        >
          Profile
        </Link>

        <Link
          href="/restaurant/menu"
          className={linkClass("/restaurant/menu")}
        >
          Menu
        </Link>

        <Link
          href="/restaurant/orders"
          className={linkClass("/restaurant/orders")}
        >
          Orders
        </Link>

        <div className="border-t my-3"></div>

        <Link
          href="/"
          className="block px-4 py-2 text-gray-600 hover:bg-gray-200 rounded"
        >
          View Website
        </Link>
      </nav>
    </aside>
  );
}
