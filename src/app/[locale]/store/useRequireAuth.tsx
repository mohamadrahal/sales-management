import { useRouter } from "../../../navigation";
import { useEffect } from "react";
import useAuthStore from "./authStore";

const useRequireAuth = () => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);
};

export default useRequireAuth;
