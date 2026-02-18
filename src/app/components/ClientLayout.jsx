"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import ConditionalNavbar from "./ConditionalNavbar";
import { Toaster } from "react-hot-toast";

export default function ClientLayout({ children, geistSans, geistMono }) {
  const { language } = useLanguage(); // ✅ Client hook works here

  return (
    <html lang={language}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ConditionalNavbar />
        {children}
        <Toaster
          position="bottom-right"
          reverseOrder={false}
          toastOptions={{
            style: {
              fontFamily: "var(--font-geist-sans)",
              borderRadius: "8px",
              padding: "12px 16px",
              background: "#163b73",
              color: "#fff",
            },
          }}
        />
      </body>
    </html>
  );
}
