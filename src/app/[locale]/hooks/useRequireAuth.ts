import { useRouter } from "@/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

// Define the structure of the decoded token
interface DecodedToken {
  userId: number;
  role: string;
}

// Function to manually decode a JWT token
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
        setLoading(false);
      } else {
        console.error("Failed to decode token");
        router.push("/login");
      }
    }
  }, [router]);

  useEffect(() => {
    if (!loading && (!token || !user)) {
      router.push("/login");
    }
  }, [token, user, loading, router]);

  return { token, user, loading };
};

export default useRequireAuth;
