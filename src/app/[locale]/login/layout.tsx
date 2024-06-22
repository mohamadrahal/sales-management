import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import "../../globals.css";

export default async function LoginLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <html
      className="h-full"
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <body className="h-full flex items-center justify-center">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
