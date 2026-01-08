=====import jwt from "jsonwebtoken";

export function getUserFromRequest(request) {
  const auth = request.headers.get("authorization");
  if (!auth) return null;

  const token = auth.split(" ")[1];
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

export function requireAdmin(request) {
  const user = getUserFromRequest(request);
  if (!user || user.role !== "admin") return null;
  return user;
}
