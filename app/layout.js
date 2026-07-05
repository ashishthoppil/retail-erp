import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import ToastProvider from "./components/ToastProvider";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Retail Omega — Inventory management for small businesses",
    template: "%s · Retail Omega",
  },
  description:
    "Track stock in real time from your phone. Retail Omega gives small business owners live inventory, low-stock alerts, orders and reports — free on Google Play.",
  keywords: [
    "inventory management app",
    "stock tracking",
    "small business",
    "low stock alerts",
    "retail app",
  ],
  openGraph: {
    title: "Retail Omega — Inventory management for small businesses",
    description:
      "Live stock levels, low-stock alerts and simple product management, right from your phone. Available now on Google Play.",
    type: "website",
    images: [{ url: "/images/logo.png" }],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${manrope.variable} antialiased`}>
        <ToastProvider />
        {children}
      </body>
    </html>
  );
}
