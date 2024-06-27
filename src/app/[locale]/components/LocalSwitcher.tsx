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
    const nextLocale = locale === "en" ? "ar" : "en";
    startTransition(() => {
      const currentPath = window.location.pathname;
      // Assuming the first segment of the path is the locale, replace it with the nextLocale
      const newPath = currentPath.replace(/^\/[^\/]*/, `/${nextLocale}`);

      router.replace(newPath, undefined);
    });
  };

  return (
    <div className="bg-secondary hover:bg-white hover:text-secondary text-white font-bold rounded w-3/4 m-auto shadow-lg h-10 flex items-center justify-center">
      <button
        className="text-lg text-center flex items-center justify-center gap-2"
        disabled={isPending}
        onClick={toggleLocale}
      >
        {locale === "en" ? "العربية" : "English"}
        <IoLanguage />
      </button>
    </div>
  );
}
