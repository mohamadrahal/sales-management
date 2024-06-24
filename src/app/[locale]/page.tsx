"use client";

import { useRouter } from "@/navigation";
import React, { useEffect } from "react";
import useAuthStore from "./stores/authStore";

function Page() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (user) {
      router.push("/home/teams");
    } else {
      router.push("/login");
    }
  }, [user, router]);
  return <div>Redirecting...</div>;
}

export default Page;
