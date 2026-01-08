import bcrypt from "bcryptjs";
import pool from "../../../../lib/db";

export async function POST(req) {
  const body = await req.json();

  if (!body.email || !body.password) {
    return Response.json(
      { message: "Missing fields" },
      { status: 400 }
    );
  }

  const hashed = await bcrypt.hash(body.password, 10);

  const [user] = await pool.query(
    "INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)",
    [body.owner_name, body.email, hashed, "restaurant"]
  );

  await pool.query(
    `INSERT INTO restaurants
     (user_id,name,description,address,status)
     VALUES (?,?,?,?, 'active')`,
    [
      user.insertId,
      body.restaurant_name,
      body.description,
      body.address,
    ]
  );

  return Response.json({ success: true });
}
