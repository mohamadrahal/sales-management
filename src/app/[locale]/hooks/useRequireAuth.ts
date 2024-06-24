// hooks/useRequireAuth.ts
import { useRouter } from "@/navigation";
import { useEffect } from "react";
import useAuthStore from "../stores/authStore";

const useRequireAuth = () => {
  const router = useRouter();
  const { user, isLoading } = useAuthStore((state) => ({
    user: state.user,
    isLoading: state.isLoading,
  }));

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);
};

export default useRequireAuth;
