"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RestaurantSidebar from "./components/RestaurantSidebar";
import RestaurantHeader from "./components/RestaurantHeader";

export default function RestaurantLayout({ children }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

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

    setReady(true);
  }, [router]);

  if (!ready) return <div className="p-6">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <RestaurantSidebar />

      <div className="flex-1">
        <RestaurantHeader />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
