import type { Metadata } from "next";
import { Inter, Nova_Slim } from "next/font/google";
import "./globals.css";
import Provider from "@/context/SessionProvider";
import { Toaster } from "@/components/ui/toaster";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Provider>
      <body className={inter.className}>
        {children}
        <Toaster/>
        </body>
      </Provider>
    </html>
  );
}
