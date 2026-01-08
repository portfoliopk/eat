"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function RestaurantSidebar() {
  const path = usePathname();

  const menu = [
    { name: "Dashboard", href: "/restaurant/dashboard" },
    { name: "Profile", href: "/restaurant/profile" },
    { name: "Menu", href: "/restaurant/menu" },
    { name: "Orders", href: "/restaurant/orders" },
    { name: "Media", href: "/restaurant/media" },
  ];

  return (
    <aside className="w-64 bg-white shadow">
      <div className="p-4 text-xl font-bold border-b">
        Restaurant Panel
      </div>

      <nav className="p-4 space-y-2">
        {menu.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-3 py-2 rounded ${
              path === item.href
                ? "bg-pink-500 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
