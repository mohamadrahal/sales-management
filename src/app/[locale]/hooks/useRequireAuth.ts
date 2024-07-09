import { useRouter } from "@/navigation"; // Corrected import
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

interface DecodedToken {
  userId: number;
  role: string;
}

const decodeToken = (token: string): DecodedToken | null => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

const useRequireAuth = () => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) {
      router.push("/login");
    } else {
      const decoded = decodeToken(token);
      if (decoded) {
        setUser(decoded);
        setToken(token);
      } else {
        console.error("Failed to decode token");
        router.push("/login");
      }
    }
    setLoading(false);
  }, [router]);

  return { token, user, loading };
};

export default useRequireAuth;
