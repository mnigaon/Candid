import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { auth } from "@/auth";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Candid - Honest Restaurant Reviews",
  description: "Find and share honest restaurant reviews in Calgary",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body className={geist.className}>
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}