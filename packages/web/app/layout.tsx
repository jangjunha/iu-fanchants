import classNames from "classnames";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "@/utils/firebase";

import "./globals.css";

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
      <body className={classNames("bg-black text-white", inter.className)}>
        <main className="container max-w-screen-md mx-auto">{children}</main>
      </body>
    </html>
  );
}
