"use client";

export default function OrderTest() {
  async function placeOrder() {
    await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer CUSTOMER_TOKEN"
      },
      body: JSON.stringify({
        restaurant_id: 1,
        total: 2000,
        items: [
          { menu_item_id: 1, quantity: 2, price: 1200 }
        ]
      })
    });

    alert("Order placed");
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Order Test</h1>
      <button onClick={placeOrder}>Place Order</button>
    </div>
  );
}
