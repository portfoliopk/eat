import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export function getUser() {
  const token = cookies().get("token")?.value;
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

export function requireAdmin() {
  const user = getUser();
  return user && user.role === "admin" ? user : null;
}
