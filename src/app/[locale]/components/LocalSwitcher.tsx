"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useTransition } from "react";
import { IoLanguage } from "react-icons/io5";

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const toggleLocale = () => {
    if (!isPending) {
      const nextLocale = locale === "en" ? "ar" : "en";
      startTransition(() => {
        const currentPath = window.location.pathname;
        const newPath = currentPath.replace(/^\/[^\/]*/, `/${nextLocale}`);
        router.replace(newPath, undefined);
      });
    }
  };

  return (
    <IoLanguage
      onClick={toggleLocale}
      className={`text-white cursor-pointer hover:text-primary ${
        isPending ? "opacity-50 cursor-not-allowed" : ""
      }`}
      size={30}
      title={locale === "en" ? "العربية" : "English"}
    />
  );
}
