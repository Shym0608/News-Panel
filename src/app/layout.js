// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
// import ConditionalNavbar from "./components/ConditionalNavbar";
// import { Toaster } from "react-hot-toast";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3002";

// export const metadata = {
//   metadataBase: new URL(baseUrl),

//   title: {
//     default: "Gujarat News - Latest Breaking News, Live Updates & City News",
//     template: "%s | Gujarat News",
//   },

//   description:
//     "Latest breaking news, live updates, politics, cricket, and city news from Gujarat.",

//   robots: {
//     index: false, // keep false during development
//     follow: false,
//   },

//   openGraph: {
//     title: "Gujarat News",
//     description: "Latest breaking news and live updates from Gujarat.",
//     url: baseUrl,
//     siteName: "Gujarat News",
//     images: [
//       {
//         url: "/newslogo.jpeg",
//         width: 1200,
//         height: 630,
//         alt: "Gujarat News",
//       },
//     ],
//     locale: "en_IN",
//     type: "website",
//   },

//   twitter: {
//     card: "summary_large_image",
//     title: "Gujarat News",
//     description: "Latest breaking news and live updates from Gujarat.",
//     images: ["/newslogo.jpeg"],
//   },

//   icons: {
//     icon: "/newslogo.jpeg",
//     shortcut: "/newslogo.jpeg",
//     apple: "/newslogo.jpeg",
//   },
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//       >
//         <ConditionalNavbar />
//         {children}
//         <Toaster
//           position="bottom-right"
//           reverseOrder={false}
//           toastOptions={{
//             style: {
//               fontFamily: "var(--font-geist-sans)",
//               borderRadius: "8px",
//               padding: "12px 16px",
//               background: "#163b73",
//               color: "#fff",
//             },
//           }}
//         />
//       </body>
//     </html>
//   );
// }

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConditionalNavbar from "./components/ConditionalNavbar";
import { Toaster } from "react-hot-toast";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3002";

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Gujarat News - Latest Breaking News, Live Updates & City News",
    template: "%s | Gujarat News",
  },
  description:
    "Latest breaking news, live updates, politics, cricket, and city news from Gujarat.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Gujarat News",
    description: "Latest breaking news and live updates from Gujarat.",
    url: baseUrl,
    siteName: "Gujarat News",
    images: [
      {
        url: "/newslogo.jpeg",
        width: 1200,
        height: 630,
        alt: "Gujarat News",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gujarat News",
    description: "Latest breaking news and live updates from Gujarat.",
    images: ["/newslogo.jpeg"],
  },
  icons: {
    icon: "/newslogo.jpeg",
    shortcut: "/newslogo.jpeg",
    apple: "/newslogo.jpeg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
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

        {/* ✅ Google AdSense Script (ADD YOUR REAL ID) */}
        <Script
          async
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXX"
          crossOrigin="anonymous"
        />
      </body>
    </html>
  );
}
