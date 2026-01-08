"use client";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function OrderSuccess() {
  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <Header />

      <div className="flex flex-col items-center justify-center p-10">
        <h1 className="text-3xl font-bold mb-4">
          🎉 Order placed!
        </h1>
        <p className="text-gray-600 mb-6">
          Your food is being prepared.
        </p>
        <Link
          href="/"
          className="bg-[#d70f64] text-white px-6 py-3 rounded-lg"
        >
          Back to home
        </Link>
      </div>

      <Footer />
    </div>
  );
}
