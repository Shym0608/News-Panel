"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  GlobeAltIcon,
  TrophyIcon,
  FilmIcon,
  CpuChipIcon,
  MapPinIcon,
  FlagIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";
import cities from "../../../src/data/cities.json";

// ─── Inner component that uses useSearchParams ───────────────────────────────
function NavbarContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  /* ---------------- MOUNT FIX (IMPORTANT) ---------------- */
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  /* ---------------- STATES ---------------- */
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCityPopup, setShowCityPopup] = useState(false);
  const [selectedCities, setSelectedCities] = useState([]);

  const categories = [
    { name: "મારું શહેર", icon: MapPinIcon },
    { name: "મારું ગુજરાત", icon: FlagIcon },
    { name: "ક્રિકેટ", icon: TrophyIcon },
    { name: "મનોરંજન", icon: FilmIcon },
    { name: "ભારત", icon: FlagIcon },
    { name: "રમતગમત", icon: TrophyIcon },
    { name: "વિશ્વ", icon: GlobeAltIcon },
    { name: "ટેકનોલોજી", icon: CpuChipIcon },
    { name: "લાઇફસ્ટાઇલ", icon: SparklesIcon },
    { name: "વ્યવસાય", icon: BriefcaseIcon },
  ];

  /* ---------------- AUTH ---------------- */
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/login");
  };

  /* ---------------- SEARCH ---------------- */
  useEffect(() => {
    if (!mounted) return;

    const urlSearch = searchParams.get("search");
    if (urlSearch) {
      setSearchQuery(urlSearch);
    }
  }, [mounted, searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();

    if (!trimmed) {
      router.push("/");
      return;
    }

    router.push(`/?search=${encodeURIComponent(trimmed)}`);
  };

  /* ---------------- CATEGORY CLICK ---------------- */
  const handleCategoryClick = (catName) => {
    if (catName === "મારું શહેર") {
      setShowCityPopup(true);
      return;
    }
    router.push(`/?category=${encodeURIComponent(catName)}`);
  };

  /* ---------------- CITY SELECT ---------------- */
  const handleCitySelect = (cityName) => {
    setSelectedCities((prev) =>
      prev.includes(cityName)
        ? prev.filter((c) => c !== cityName)
        : [...prev, cityName],
    );
  };

  /* ---------------- APPLY FILTER ---------------- */
  const applyCityFilter = () => {
    if (selectedCities.length > 0) {
      router.push(`/?cities=${selectedCities.join(",")}`);
    } else {
      router.push("/");
    }
    setShowCityPopup(false);
  };

  /* ---------------- PREVENT HYDRATION MISMATCH ---------------- */
  if (!mounted) return null;

  return (
    <header className="w-full">
      {/* TOP NAVBAR */}
      <nav className="h-16 flex items-center justify-between px-6 bg-blue-900 text-white">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <img
            src="/newslogo.jpeg"
            alt="Logo"
            className="h-14 w-auto object-contain"
          />
          <span className="font-bold text-xl">ગુજરાતી નેશનલ ટીવી ન્યૂઝ</span>
        </div>

        <div className="flex items-center gap-4">
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

      {/* BREAKING NEWS STRIP */}
      <div className="w-full bg-red-600 text-white h-8 overflow-hidden relative pt-1">
        <div className="absolute whitespace-nowrap animate-marquee flex items-center gap-8 px-80">
          <span>🔴 Latest Breaking News Updates</span>
          <span>ગુજરાતી ન્યૂઝ - તાજા સમાચાર</span>
          <span>📺 Watch Digital News for Video Coverage</span>
        </div>
      </div>

      {/* CATEGORIES + SEARCH */}
      <div className="bg-white shadow-sm border-t">
        <div className="w-full px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex flex-wrap items-center gap-3">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.name}
                  onClick={() => handleCategoryClick(cat.name)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium
                   bg-gray-100 text-gray-800
                   rounded-full whitespace-nowrap
                  hover:bg-gray-200 transition"
                >
                  <Icon className="w-4 h-4" />
                  {cat.name}
                </button>
              );
            })}
          </div>

          <form
            onSubmit={handleSearch}
            className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-72 border"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="શોધો... / Search..."
              className="bg-transparent outline-none w-full text-sm"
            />
            <button type="submit">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-600" />
            </button>
          </form>
        </div>
      </div>

      {/* CITY POPUP */}
      {showCityPopup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] md:w-187.5 max-h-[85vh] rounded-2xl shadow-2xl p-6 flex flex-col">
            <div className="flex justify-between mb-4 border-b pb-3">
              <h2 className="text-xl font-semibold">Select Your Cities</h2>
              <button onClick={() => setShowCityPopup(false)}>✕</button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 overflow-y-auto max-h-[55vh]">
              {cities.map((city) => {
                const isSelected = selectedCities.includes(city.name);
                return (
                  <div
                    key={city.id}
                    onClick={() => handleCitySelect(city.name)}
                    className={`cursor-pointer px-4 py-2 rounded-xl border text-sm font-medium text-center
                    ${isSelected
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-gray-100 hover:bg-blue-100 border-gray-200"
                      }`}
                  >
                    {city.name}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setSelectedCities([])}
                className="flex-1 py-2 rounded-xl border"
              >
                Clear All
              </button>

              <button
                onClick={applyCityFilter}
                className="flex-1 py-2 rounded-xl bg-blue-600 text-white"
              >
                Apply Filter
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

// ─── Exported component with Suspense wrapper ────────────────────────────────
export default function Navbar() {
  return (
    <Suspense
      fallback={
        <header className="w-full">
          <nav className="h-16 bg-blue-900" />
          <div className="w-full bg-red-600 h-8" />
          <div className="bg-white shadow-sm border-t h-14" />
        </header>
      }
    >
      <NavbarContent />
    </Suspense>
  );
}
