// app/[locale]/home/layout.tsx
import "../../globals.css";
import SideBar from "../components/SideBar";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

export default async function HomeLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="h-full flex">
        <SideBar />
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </NextIntlClientProvider>
  );
}
