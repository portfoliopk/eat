"use client";
import { useState } from "react";

export default function MenuTest() {
  async function addMenu() {
    await fetch("/api/menu", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer YOUR_RESTAURANT_TOKEN"
      },
      body: JSON.stringify({
        restaurant_id: 1,
        category_id: 1,
        name: "Chicken Pizza",
        price: 1100,
        image_id: 2
      })
    });

    alert("Menu item added");
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Restaurant Menu Test</h1>
      <button onClick={addMenu}>Add Menu Item</button>
    </div>
  );
}
