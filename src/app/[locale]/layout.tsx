import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import "../globals.css";
import SideBar from "./components/SideBar";
import { TeamsProvider } from "./context/TeamsContext";

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html
      className="h-full"
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <body className="h-full flex">
        <SideBar />
        <div className="flex-1 overflow-y-auto">
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </div>
      </body>
    </html>
  );
}
