import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.NEXT_PUBLIC_JWT_SECRET || "your_secret_key";

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};
