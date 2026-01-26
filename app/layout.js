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
  title: "Retail Omega",
  description: "Personal stock manager for a small businesses.",
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
