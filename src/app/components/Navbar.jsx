"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  GlobeAltIcon,
  TrophyIcon,
  FilmIcon,
  CpuChipIcon,
  MapPinIcon,
  FlagIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

export default function Navbar() {
  const router = useRouter();
  const [language, setLanguage] = useState("ગુજરાતી");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    // { name: "All", icon: GlobeAltIcon },
    { name: "My City", icon: MapPinIcon },
    { name: "My Gujarat", icon: FlagIcon },
    { name: "Cricket", icon: TrophyIcon },
    { name: "Entertainment", icon: FilmIcon },
    { name: "India", icon: FlagIcon },
    { name: "Sport", icon: TrophyIcon },
    { name: "World", icon: GlobeAltIcon },
    { name: "Technology", icon: CpuChipIcon },
  ];

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };
    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/login");
  };

  // ✅ Search handler — supports Gujarati Unicode
  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      router.push(`/?search=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/");
    }
  };

  // ✅ Category click handler
  const handleCategoryClick = (catName) => {
    if (catName === "All") {
      router.push("/");
    } else {
      router.push(`/?category=${encodeURIComponent(catName)}`);
    }
  };

  return (
    <header className="w-full">
      {/* Top Navbar */}
      <nav className="h-16 flex items-center justify-between px-6 bg-blue-900 text-white">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <img
            src="/newslogo.jpeg"
            alt="Logo"
            className="h-10 w-auto object-contain"
          />
          <span className="font-bold text-xl">ગુજરાત TV</span>
        </div>

        {/* <div className="flex items-center gap-6">
          <button onClick={() => router.push("/")}>Home</button>
          <button onClick={() => router.push("/story-news")}>Story News</button>
          <button onClick={() => router.push("/digital-news")}>
            Digital News
          </button>
        </div> */}

        <div className="flex items-center gap-4">
          <button
            className="px-2 py-1 border border-white rounded hover:bg-white hover:text-blue-900 transition"
            onClick={() =>
              setLanguage(language === "ગુજરાતી" ? "English" : "ગુજરાતી")
            }
          >
            {language}
          </button>

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => router.push("/login")}
              className="bg-white text-blue-900 px-3 py-1 rounded"
            >
              Login
            </button>
          )}
        </div>
      </nav>

      {/* Breaking News Strip */}
      <div className="w-full bg-red-600 text-white h-8 overflow-hidden relative pt-1">
        <div className="absolute whitespace-nowrap animate-marquee flex items-center gap-8 px-80">
          <span>🔴 Latest Breaking News Updates</span>
          <span>ગુજરાતી ન્યૂઝ - તાજા સમાચાર</span>
          <span>📺 Watch Digital News for Video Coverage</span>
        </div>
      </div>

      {/* Categories + Search Bar */}
      <div className="bg-white shadow-md border-t">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* Categories */}
          <div className="flex items-center gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.name}
                  onClick={() => handleCategoryClick(cat.name)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-full bg-gray-100 hover:bg-blue-600 hover:text-white transition"
                >
                  <Icon className="w-4 h-4" />
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* ✅ Search Bar — supports Gujarati input */}
          <form
            onSubmit={handleSearch}
            className="flex items-center bg-gray-100 rounded-full px-4 py-1.5 w-64 focus-within:ring-2 focus-within:ring-blue-500 transition"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="શોધો... / Search..."
              className="bg-transparent outline-none w-full text-sm"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
            />
            <button type="submit" aria-label="Search">
              <MagnifyingGlassIcon className="w-4 h-4 text-gray-500 hover:text-blue-600 transition" />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
