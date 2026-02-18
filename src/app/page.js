"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { PlayCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { getHomePageNews } from "./utils/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "");

const getFullUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return encodeURI(`${BASE_URL}${cleanPath}`);
};

// ─── Inner component that uses useSearchParams ────────────────────────────────
function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [newsData, setNewsData] = useState([]);
  const [liveVideos, setLiveVideos] = useState([]);
  const [slidingVideos, setSlidingVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Read search + category from URL params
  const searchQuery = searchParams.get("search") || "";
  const categoryQuery = searchParams.get("category") || "";

  useEffect(() => {
    if (searchQuery || categoryQuery) {
      fetchFilteredNews(searchQuery, categoryQuery);
    } else {
      fetchAllData();
    }
  }, [searchQuery, categoryQuery]);

  // ─── Fetch ALL homepage data (default view) ──────────────────────────────
  const fetchAllData = async () => {
    try {
      setLoading(true);

      const news = await getHomePageNews();
      setNewsData(Array.isArray(news) ? news : []);

      const liveRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/homepage/videos`,
      );
      const live = await liveRes.json();
      setLiveVideos(Array.isArray(live) ? live.slice(0, 10) : []);

      const slidingRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/homepage/videos/sliding`,
      );
      const sliding = await slidingRes.json();
      setSlidingVideos(Array.isArray(sliding) ? sliding : []);
    } catch (error) {
      console.error("Error fetching homepage data:", error);
      setNewsData([]);
      setLiveVideos([]);
      setSlidingVideos([]);
    } finally {
      setLoading(false);
    }
  };

  // ─── Fetch filtered/searched news from backend ────────────────────────────
  const fetchFilteredNews = async (query, category) => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      params.set("page", "0");
      params.set("size", "20");

      // ✅ Send keyword param for Gujarati / English text search
      if (query) {
        params.set("keyword", query);
      }

      // ✅ Send category param for category filter
      if (category && category !== "All") {
        params.set("category", category);
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/searchEngine/filter?${params.toString()}`,
      );
      const data = await res.json();

      // Handle both paginated PageResponse and plain array
      const items = Array.isArray(data)
        ? data
        : Array.isArray(data?.content)
          ? data.content
          : [];

      setNewsData(items);

      // Keep live videos visible during search
      if (liveVideos.length === 0) {
        const liveRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/homepage/videos`,
        );
        const live = await liveRes.json();
        setLiveVideos(Array.isArray(live) ? live.slice(0, 10) : []);
      }
    } catch (error) {
      console.error("Error fetching filtered news:", error);
      setNewsData([]);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    router.push("/");
  };

  const storyNews = newsData.filter((news) => news?.type !== "DIGITAL");
  const digitalNews = newsData.filter((news) => news?.type === "DIGITAL");

  const isSearching = !!(searchQuery || categoryQuery);

  return (
    <div className="min-h-screen bg-gray-100 overflow-x-hidden">
      <div className="w-full px-4 py-6">
        {/* ✅ Active Search / Category Banner */}
        {isSearching && (
          <div className="mb-4 flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl px-5 py-3">
            <div className="flex-1">
              {searchQuery && (
                <p className="text-sm text-blue-800">
                  શોધ પરિણામ: <span className="font-bold">"{searchQuery}"</span>
                </p>
              )}
              {categoryQuery && (
                <p className="text-sm text-blue-800">
                  કેટેગરી: <span className="font-bold">{categoryQuery}</span>
                </p>
              )}
              <p className="text-xs text-blue-500 mt-0.5">
                {loading
                  ? "શોધી રહ્યા છીએ..."
                  : `${newsData.length} સમાચાર મળ્યા`}
              </p>
            </div>
            <button
              onClick={clearSearch}
              className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition font-medium"
            >
              <XMarkIcon className="w-4 h-4" />
              બધા સમાચાર
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ================= LEFT SIDE — Live News (20%) ================= */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-4 h-fit self-start">
            <h2 className="text-lg font-bold text-red-600 mb-4">Live News</h2>
            <div className="space-y-4">
              {liveVideos.slice(0, 10).map((video) => {
                const videoUrl = getFullUrl(video?.mediaUrls?.[0]);
                return (
                  <div
                    key={video.id}
                    className="bg-gray-50 rounded-xl overflow-hidden shadow hover:shadow-lg transition"
                  >
                    <video
                      src={videoUrl}
                      className="w-full h-32 object-cover"
                      autoPlay
                      muted
                      loop
                      playsInline
                      controls={false}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* ================= CENTER (60%) ================= */}
          <div className="lg:col-span-8 space-y-6">
            {/* Top Ad */}
            <div className="bg-gray-100 rounded-xl shadow h-60 flex items-center justify-center overflow-hidden">
              Ads 1
            </div>

            {/* Sliding Featured Videos — hidden during search */}
            {!isSearching && slidingVideos.length > 0 && (
              <div className="bg-white rounded-xl shadow p-4">
                <div
                  className="flex gap-4 overflow-x-auto
                    [-ms-overflow-style:none]
                    [scrollbar-width:none]
                    [&::-webkit-scrollbar]:hidden"
                >
                  {slidingVideos.map((video) => {
                    const videoUrl = getFullUrl(video?.mediaUrls?.[0]);
                    return (
                      <div key={video.id} className="min-w-62.5 shrink-0">
                        <video
                          src={videoUrl}
                          className="w-full h-32 object-cover"
                          autoPlay
                          muted
                          loop
                          playsInline
                          controls={false}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ✅ Loading Spinner */}
            {loading && (
              <div className="flex items-center justify-center py-20 text-gray-400">
                <svg
                  className="animate-spin w-6 h-6 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                સમાચાર લોડ થઈ રહ્યા છે...
              </div>
            )}

            {/* ✅ No Results */}
            {!loading && isSearching && newsData.length === 0 && (
              <div className="bg-white rounded-xl shadow p-10 text-center text-gray-400">
                <p className="text-lg font-semibold">કોઈ સમાચાર મળ્યા નહીં</p>
                <p className="text-sm mt-1">
                  બીજો શબ્દ અજમાવો અથવા{" "}
                  <button
                    onClick={clearSearch}
                    className="text-blue-500 underline"
                  >
                    બધા સમાચાર જુઓ
                  </button>
                </p>
              </div>
            )}

            {/* ✅ News Grid */}
            {!loading && newsData.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* ── STORY NEWS ─────────────────────────────── */}
                <div className="space-x-3">
                  {storyNews.map((story) => (
                    <Link
                      key={story.id}
                      href={`/news/${story.id}?data=${encodeURIComponent(
                        JSON.stringify(story),
                      )}`}
                    >
                      <div className="flex gap-4 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition border-b">
                        <div className="flex-1">
                          <h2 className="font-semibold text-base line-clamp-2">
                            {story.title}
                          </h2>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {story.shortDescription}
                          </p>
                        </div>
                        {story?.mediaUrls?.[0] && (
                          <img
                            src={getFullUrl(story.mediaUrls[0])}
                            className="w-24 h-20 object-cover rounded-lg"
                            alt={story.title}
                          />
                        )}
                      </div>
                    </Link>
                  ))}
                </div>

                {/* ── DIGITAL NEWS ───────────────────────────── */}
                <div className="space-x-3">
                  {digitalNews.map((digital) => {
                    const videoSrc = digital.finalVideoUrl
                      ? getFullUrl(digital.finalVideoUrl)
                      : digital?.mediaUrls?.[0]
                        ? getFullUrl(digital.mediaUrls[0])
                        : null;

                    const isProcessing = !digital.finalVideoUrl;

                    return (
                      <Link
                        key={digital.id}
                        href={`/news/${digital.id}?data=${encodeURIComponent(
                          JSON.stringify(digital),
                        )}`}
                      >
                        <div className="flex gap-4 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition border-b">
                          <div className="flex-1">
                            <h2 className="font-semibold text-base line-clamp-2">
                              {digital.title}
                            </h2>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {digital.shortDescription}
                            </p>
                          </div>
                          {videoSrc && (
                            <div className="relative shrink-0">
                              <video
                                src={videoSrc}
                                className="w-24 h-20 object-cover rounded-lg"
                                muted
                                preload="metadata"
                              />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-lg">
                                <PlayCircleIcon className="w-6 h-6 text-white" />
                              </div>
                              {isProcessing && (
                                <div className="absolute bottom-1 left-1 right-1 bg-orange-500/90 text-white text-[9px] font-bold text-center rounded px-1 py-0.5 leading-tight">
                                  Processing...
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ================= RIGHT SIDE — Ads (20%) ================= */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-100 rounded-xl shadow h-60 overflow-hidden">
              Ads 2
            </div>
            <div className="bg-gray-100 rounded-xl shadow h-60 overflow-hidden">
              Ads 3
            </div>
            <div className="bg-gray-100 rounded-xl shadow h-60 overflow-hidden">
              Ads 4
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ✅ Wrap in Suspense — required by Next.js App Router for useSearchParams
export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-100 flex items-center justify-center text-gray-400">
          Loading...
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
