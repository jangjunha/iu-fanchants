import classNames from "classnames";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "@/utils/firebase";

import "./globals.css";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "아이유 응원법",
  description: "리듬게임으로 즐기는 아이유 응원법",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body
        className={classNames(
          "bg-no-repeat bg-fixed from-violet-600 from-[14rem] to-[14rem] to-neutral-900 text-white flex flex-col items-center h-screen",
          inter.className
        )}
        style={{
          backgroundImage:
            "linear-gradient(0.498turn, var(--tw-gradient-stops))",
        }}
      >
        <Script>
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-N8SPLDBS');`}
        </Script>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-N8SPLDBS"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        <main className="container max-w-screen-md flex-1 flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
