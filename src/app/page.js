// "use client";

// import React, { useState, useEffect, Suspense } from "react";
// import Link from "next/link";
// import { useSearchParams, useRouter } from "next/navigation";
// import { PlayCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
// import { getHomePageNews, fetchStoryNews, fetchDigitalNews } from "./utils/api";

// const BASE_URL = (
//   process.env.NEXT_PUBLIC_API_BASE_URL ||
//   "https://gujarat-national-news-backend.onrender.com"
// ).replace("/api", "");

// const getFullUrl = (path) => {
//   if (!path) return "";
//   if (path.startsWith("http")) return path;
//   const cleanPath = path.startsWith("/") ? path : `/${path}`;
//   return encodeURI(`${BASE_URL}${cleanPath}`);
// };

// const API_BASE =
//   process.env.NEXT_PUBLIC_API_BASE_URL ||
//   "https://gujarat-national-news-backend.onrender.com";

// function HomeContent() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const [storyNews, setStoryNews] = useState([]);
//   const [digitalNews, setDigitalNews] = useState([]);
//   const [slidingVideos, setSlidingVideos] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Ads
//   const [topBannerAd, setTopBannerAd] = useState(null);
//   const [rightTopAd, setRightTopAd] = useState(null);
//   const [rightBottomAd, setRightBottomAd] = useState(null);

//   const searchQuery = searchParams.get("search") || "";
//   const categoryQuery = searchParams.get("category") || "";
//   const citiesQuery = searchParams.get("cities") || "";

//   const isSearching = !!(searchQuery || categoryQuery || citiesQuery);
//   const allNews = [...storyNews, ...digitalNews];

//   // ─── Fetch Ads ─────────────────────────────────────────────────
//   useEffect(() => {
//     const fetchAds = async () => {
//       try {
//         const [topRes, rightTopRes, rightBottomRes] = await Promise.all([
//           fetch(`${API_BASE}/api/ads/TOP_BANNER`),
//           fetch(`${API_BASE}/api/ads/RIGHT_TOP`),
//           fetch(`${API_BASE}/api/ads/RIGHT_BOTTOM`),
//         ]);

//         const [topData, rightTopData, rightBottomData] = await Promise.all([
//           topRes.json(),
//           rightTopRes.json(),
//           rightBottomRes.json(),
//         ]);

//         setTopBannerAd(Array.isArray(topData) ? topData[0] : null);
//         setRightTopAd(Array.isArray(rightTopData) ? rightTopData[0] : null);
//         setRightBottomAd(
//           Array.isArray(rightBottomData) ? rightBottomData[0] : null,
//         );
//       } catch (error) {
//         console.error("Error fetching ads:", error);
//       }
//     };

//     fetchAds();
//   }, []);

//   // ─── Fetch News based on filters ───────────────────────────────
//   useEffect(() => {
//     if (citiesQuery) {
//       fetchNewsByCities(citiesQuery);
//     } else if (searchQuery || categoryQuery) {
//       fetchFilteredNews(searchQuery, categoryQuery);
//     } else {
//       fetchAllData();
//     }
//   }, [searchQuery, categoryQuery, citiesQuery]);

//   // ─── Default: getHomePageNews as fallback + fetchStoryNews + fetchDigitalNews ───
//   const fetchAllData = async () => {
//     try {
//       setLoading(true);

//       // ✅ Use Promise.allSettled so one failure doesn't kill everything
//       const [homeResult, storyResult, digitalResult, slidingResult] =
//         await Promise.allSettled([
//           getHomePageNews(),
//           fetchStoryNews(),
//           fetchDigitalNews(),
//           fetch(`${API_BASE}/api/homepage/videos/sliding`).then((r) =>
//             r.json(),
//           ),
//         ]);

//       const homeNews =
//         homeResult.status === "fulfilled" && Array.isArray(homeResult.value)
//           ? homeResult.value
//           : [];

//       const story =
//         storyResult.status === "fulfilled" && Array.isArray(storyResult.value)
//           ? storyResult.value
//           : [];

//       const digital =
//         digitalResult.status === "fulfilled" &&
//         Array.isArray(digitalResult.value)
//           ? digitalResult.value
//           : [];

//       const sliding =
//         slidingResult.status === "fulfilled" &&
//         Array.isArray(slidingResult.value)
//           ? slidingResult.value
//           : [];

//       // ✅ Fallback to homeNews if story/digital endpoints return empty
//       const storyItems =
//         story.length > 0
//           ? story
//           : homeNews.filter((n) => n?.type !== "DIGITAL");

//       const digitalItems =
//         digital.length > 0
//           ? digital
//           : homeNews.filter((n) => n?.type === "DIGITAL");

//       setStoryNews(storyItems);
//       setDigitalNews(digitalItems);
//       setSlidingVideos(sliding);

//       // ✅ Log which APIs failed so you can debug easily
//       if (storyResult.status === "rejected")
//         console.warn("Story API failed:", storyResult.reason);
//       if (digitalResult.status === "rejected")
//         console.warn("Digital API failed:", digitalResult.reason);
//       if (homeResult.status === "rejected")
//         console.warn("Homepage API failed:", homeResult.reason);
//     } catch (error) {
//       console.error("Critical fetch error:", error);
//       setStoryNews([]);
//       setDigitalNews([]);
//       setSlidingVideos([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ─── City filter ────────────────────────────────────────────────
//   const fetchNewsByCities = async (citiesString) => {
//     try {
//       setLoading(true);

//       const params = new URLSearchParams();
//       citiesString.split(",").forEach((city) => params.append("cities", city));

//       const res = await fetch(
//         `${API_BASE}/api/homepage/by-cities?${params.toString()}`,
//       );
//       if (!res.ok) throw new Error("Failed to fetch city news");

//       const data = await res.json();
//       const items = Array.isArray(data) ? data : [];

//       setStoryNews(items.filter((n) => n?.type !== "DIGITAL"));
//       setDigitalNews(items.filter((n) => n?.type === "DIGITAL"));
//     } catch (error) {
//       console.error("City filter error:", error);
//       setStoryNews([]);
//       setDigitalNews([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ─── Search / Category filter ───────────────────────────────────
//   const fetchFilteredNews = async (query, category) => {
//     try {
//       setLoading(true);
//       let url = "";

//       if (category && !query) {
//         url = `${API_BASE}/api/homepage/by-category?category=${encodeURIComponent(category)}`;
//       } else {
//         const params = new URLSearchParams();
//         params.set("page", "0");
//         params.set("size", "20");
//         if (query) params.set("keyword", query);
//         if (category) params.set("category", category);
//         url = `${API_BASE}/api/searchEngine/filter?${params.toString()}`;
//       }

//       const res = await fetch(url);
//       if (!res.ok) throw new Error(`API Error: ${res.status}`);

//       const data = await res.json();
//       const items = Array.isArray(data)
//         ? data
//         : Array.isArray(data?.content)
//           ? data.content
//           : [];

//       setStoryNews(items.filter((n) => n?.type !== "DIGITAL"));
//       setDigitalNews(items.filter((n) => n?.type === "DIGITAL"));
//     } catch (error) {
//       console.error("Error fetching filtered news:", error);
//       setStoryNews([]);
//       setDigitalNews([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const clearSearch = () => router.push("/");

//   // ─── Render ─────────────────────────────────────────────────────
//   return (
//     <div className="min-h-screen bg-gray-100 overflow-x-hidden">
//       <div className="w-full px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
//         {/* Search Banner */}
//         {isSearching && (
//           <div className="mb-4 flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
//             <div className="flex-1 min-w-0">
//               {searchQuery && (
//                 <p className="text-sm text-blue-800 truncate">
//                   શોધ પરિણામ: <span className="font-bold">"{searchQuery}"</span>
//                 </p>
//               )}
//               {categoryQuery && (
//                 <p className="text-sm text-blue-800 truncate">
//                   કેટેગરી: <span className="font-bold">{categoryQuery}</span>
//                 </p>
//               )}
//               <p className="text-xs text-blue-500 mt-0.5">
//                 {loading
//                   ? "શોધી રહ્યા છીએ..."
//                   : `${allNews.length} સમાચાર મળ્યા`}
//               </p>
//             </div>
//             <button
//               onClick={clearSearch}
//               className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition font-medium shrink-0"
//             >
//               <XMarkIcon className="w-4 h-4" />
//               <span className="hidden sm:inline">બધા સમાચાર</span>
//             </button>
//           </div>
//         )}

//         {/* Main Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
//           {/* LEFT: YouTube Live */}
//           <div className="hidden lg:block lg:col-span-2 bg-white rounded-2xl shadow-md p-4 h-fit self-start sticky top-4">
//             <h2 className="text-lg font-bold text-red-600 mb-4">
//               🔴 Live News
//             </h2>
//             <div className="rounded-xl overflow-hidden shadow">
//               <iframe
//                 src="https://www.youtube.com/embed/c5gB1nv4QTc"
//                 title="Live News"
//                 className="w-full h-64 rounded-xl"
//                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                 allowFullScreen
//               />
//             </div>
//           </div>

//           {/* CENTER */}
//           <div className="lg:col-span-8 space-y-4 sm:space-y-6">
//             {/* Top Ad */}
//             {topBannerAd && (
//               <a
//                 href={topBannerAd.redirectUrl}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="hidden sm:block"
//               >
//                 <img
//                   src={getFullUrl(topBannerAd.imageUrl)}
//                   alt={topBannerAd.title}
//                   className="rounded-xl shadow sm:h-52 lg:h-60 w-full object-cover"
//                 />
//               </a>
//             )}

//             {/* Sliding Videos */}
//             {!isSearching && slidingVideos.length > 0 && (
//               <div className="bg-white rounded-xl shadow p-3 sm:p-4">
//                 <div className="flex gap-3 sm:gap-4 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
//                   {slidingVideos.map((video) => {
//                     const videoUrl = getFullUrl(video?.mediaUrls?.[0]);
//                     return (
//                       <div
//                         key={video.id}
//                         className="min-w-45 sm:min-w-55 lg:min-w-62.5 shrink-0"
//                       >
//                         <video
//                           src={videoUrl}
//                           className="w-full h-28 sm:h-32 object-cover rounded-lg"
//                           autoPlay
//                           muted
//                           loop
//                           playsInline
//                           controls={false}
//                         />
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             )}

//             {/* Loading */}
//             {loading && (
//               <div className="flex items-center justify-center py-16 text-gray-400">
//                 Loading...
//               </div>
//             )}

//             {/* News Grid */}
//             {!loading && allNews.length > 0 && (
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
//                 {/* STORY NEWS */}
//                 <div className="space-y-3">
//                   {storyNews.map((story) => (
//                     <Link key={story.id} href={`/news/${story.id}`}>
//                       <div className="flex gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg border-b">
//                         <div className="flex-1 min-w-0">
//                           <h2 className="font-semibold text-sm sm:text-base line-clamp-2">
//                             {story.title}
//                           </h2>
//                           <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">
//                             {story.shortDescription}
//                           </p>
//                         </div>
//                         {story?.mediaUrls?.[0] && (
//                           <img
//                             src={getFullUrl(story.mediaUrls[0])}
//                             className="w-20 h-16 sm:w-24 sm:h-20 object-cover rounded-lg shrink-0"
//                             alt={story.title}
//                           />
//                         )}
//                       </div>
//                     </Link>
//                   ))}
//                 </div>

//                 {/* DIGITAL NEWS */}
//                 <div className="space-y-3">
//                   {digitalNews.map((digital) => {
//                     const videoSrc = digital.finalVideoUrl
//                       ? getFullUrl(digital.finalVideoUrl)
//                       : digital?.mediaUrls?.[0]
//                         ? getFullUrl(digital.mediaUrls[0])
//                         : null;

//                     return (
//                       <Link key={digital.id} href={`/news/${digital.id}`}>
//                         <div className="flex gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg border-b">
//                           <div className="flex-1 min-w-0">
//                             <h2 className="font-semibold text-sm sm:text-base line-clamp-2">
//                               {digital.title}
//                             </h2>
//                             <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">
//                               {digital.shortDescription}
//                             </p>
//                           </div>
//                           {videoSrc && (
//                             <div className="relative shrink-0">
//                               <video
//                                 src={videoSrc}
//                                 className="w-20 h-16 sm:w-24 sm:h-20 object-cover rounded-lg"
//                                 muted
//                               />
//                               <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-lg">
//                                 <PlayCircleIcon className="w-6 h-6 text-white" />
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       </Link>
//                     );
//                   })}
//                 </div>
//               </div>
//             )}

//             {/* Empty state */}
//             {!loading && allNews.length === 0 && (
//               <div className="flex items-center justify-center py-16 text-gray-400 text-sm">
//                 કોઈ સમાચાર મળ્યા નહીં
//               </div>
//             )}
//           </div>

//           {/* RIGHT ADS */}
//           <div className="hidden lg:flex lg:col-span-2 flex-col gap-6">
//             {rightTopAd && (
//               <a
//                 href={rightTopAd.redirectUrl}
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 <img
//                   src={getFullUrl(rightTopAd.imageUrl)}
//                   alt={rightTopAd.title}
//                   className="rounded-xl shadow h-60 w-full object-cover"
//                 />
//               </a>
//             )}
//             {rightBottomAd && (
//               <a
//                 href={rightBottomAd.redirectUrl}
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 <img
//                   src={getFullUrl(rightBottomAd.imageUrl)}
//                   alt={rightBottomAd.title}
//                   className="rounded-xl shadow h-60 w-full object-cover"
//                 />
//               </a>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function Home() {
//   return (
//     <Suspense
//       fallback={
//         <div className="min-h-screen bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
//           Loading...
//         </div>
//       }
//     >
//       <HomeContent />
//     </Suspense>
//   );
// }


"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { PlayCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { getHomePageNews, fetchStoryNews, fetchDigitalNews } from "./utils/api";

const BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://gujarat-national-news-backend.onrender.com"
).replace("/api", "");

const getFullUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return encodeURI(`${BASE_URL}${cleanPath}`);
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://gujarat-national-news-backend.onrender.com";

// ✅ FIX: Normalize ad response — handles both array and single object
const extractAd = (data) => {
  if (Array.isArray(data)) return data[0] ?? null;
  if (data?.id) return data;
  return null;
};

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [storyNews, setStoryNews] = useState([]);
  const [digitalNews, setDigitalNews] = useState([]);
  const [slidingVideos, setSlidingVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [topBannerAd, setTopBannerAd] = useState(null);
  const [rightTopAd, setRightTopAd] = useState(null);
  const [rightBottomAd, setRightBottomAd] = useState(null);

  const searchQuery = searchParams.get("search") || "";
  const categoryQuery = searchParams.get("category") || "";
  const citiesQuery = searchParams.get("cities") || "";

  const isSearching = !!(searchQuery || categoryQuery || citiesQuery);
  const allNews = [...storyNews, ...digitalNews];

  // ─── Fetch Ads ─────────────────────────────────────────────────
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const [topRes, rightTopRes, rightBottomRes] = await Promise.all([
          fetch(`${API_BASE}/api/ads/TOP_BANNER`),
          fetch(`${API_BASE}/api/ads/RIGHT_TOP`),
          fetch(`${API_BASE}/api/ads/RIGHT_BOTTOM`),
        ]);

        const [topData, rightTopData, rightBottomData] = await Promise.all([
          topRes.json(),
          rightTopRes.json(),
          rightBottomRes.json(),
        ]);

        // ✅ FIX: Use extractAd instead of Array.isArray check
        setTopBannerAd(extractAd(topData));
        setRightTopAd(extractAd(rightTopData));
        setRightBottomAd(extractAd(rightBottomData));
      } catch (error) {
        console.error("Error fetching ads:", error);
      }
    };

    fetchAds();
  }, []);

  // ─── Fetch News based on filters ───────────────────────────────
  useEffect(() => {
    if (citiesQuery) {
      fetchNewsByCities(citiesQuery);
    } else if (searchQuery || categoryQuery) {
      fetchFilteredNews(searchQuery, categoryQuery);
    } else {
      fetchAllData();
    }
  }, [searchQuery, categoryQuery, citiesQuery]);

  // ─── Default fetch ──────────────────────────────────────────────
  const fetchAllData = async () => {
    try {
      setLoading(true);

      const [homeResult, storyResult, digitalResult, slidingResult] =
        await Promise.allSettled([
          getHomePageNews(),
          fetchStoryNews(),
          fetchDigitalNews(),
          fetch(`${API_BASE}/api/homepage/videos/sliding`).then((r) =>
            r.json()
          ),
        ]);

      const homeNews =
        homeResult.status === "fulfilled" && Array.isArray(homeResult.value)
          ? homeResult.value
          : [];

      const story =
        storyResult.status === "fulfilled" && Array.isArray(storyResult.value)
          ? storyResult.value
          : [];

      const digital =
        digitalResult.status === "fulfilled" &&
        Array.isArray(digitalResult.value)
          ? digitalResult.value
          : [];

      const sliding =
        slidingResult.status === "fulfilled" &&
        Array.isArray(slidingResult.value)
          ? slidingResult.value
          : [];

      const storyItems =
        story.length > 0
          ? story
          : homeNews.filter((n) => n?.type !== "DIGITAL");

      const digitalItems =
        digital.length > 0
          ? digital
          : homeNews.filter((n) => n?.type === "DIGITAL");

      setStoryNews(storyItems);
      setDigitalNews(digitalItems);
      setSlidingVideos(sliding);

      if (storyResult.status === "rejected")
        console.warn("Story API failed:", storyResult.reason);
      if (digitalResult.status === "rejected")
        console.warn("Digital API failed:", digitalResult.reason);
      if (homeResult.status === "rejected")
        console.warn("Homepage API failed:", homeResult.reason);
    } catch (error) {
      console.error("Critical fetch error:", error);
      setStoryNews([]);
      setDigitalNews([]);
      setSlidingVideos([]);
    } finally {
      setLoading(false);
    }
  };

  // ─── City filter ────────────────────────────────────────────────
  const fetchNewsByCities = async (citiesString) => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      citiesString.split(",").forEach((city) => params.append("cities", city));

      const res = await fetch(
        `${API_BASE}/api/homepage/by-cities?${params.toString()}`
      );
      if (!res.ok) throw new Error("Failed to fetch city news");

      const data = await res.json();
      const items = Array.isArray(data) ? data : [];

      setStoryNews(items.filter((n) => n?.type !== "DIGITAL"));
      setDigitalNews(items.filter((n) => n?.type === "DIGITAL"));
    } catch (error) {
      console.error("City filter error:", error);
      setStoryNews([]);
      setDigitalNews([]);
    } finally {
      setLoading(false);
    }
  };

  // ─── Search / Category filter ───────────────────────────────────
  const fetchFilteredNews = async (query, category) => {
    try {
      setLoading(true);
      let url = "";

      if (category && !query) {
        url = `${API_BASE}/api/homepage/by-category?category=${encodeURIComponent(category)}`;
      } else {
        const params = new URLSearchParams();
        params.set("page", "0");
        params.set("size", "20");
        if (query) params.set("keyword", query);
        if (category) params.set("category", category);
        url = `${API_BASE}/api/searchEngine/filter?${params.toString()}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error(`API Error: ${res.status}`);

      const data = await res.json();
      const items = Array.isArray(data)
        ? data
        : Array.isArray(data?.content)
          ? data.content
          : [];

      setStoryNews(items.filter((n) => n?.type !== "DIGITAL"));
      setDigitalNews(items.filter((n) => n?.type === "DIGITAL"));
    } catch (error) {
      console.error("Error fetching filtered news:", error);
      setStoryNews([]);
      setDigitalNews([]);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => router.push("/");

  // ─── Render ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-100 overflow-x-hidden">
      <div className="w-full px-3 sm:px-4 lg:px-6 py-4 sm:py-6">

        {/* Search Banner */}
        {isSearching && (
          <div className="mb-4 flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
            <div className="flex-1 min-w-0">
              {searchQuery && (
                <p className="text-sm text-blue-800 truncate">
                  શોધ પરિણામ: <span className="font-bold">"{searchQuery}"</span>
                </p>
              )}
              {categoryQuery && (
                <p className="text-sm text-blue-800 truncate">
                  કેટેગરી: <span className="font-bold">{categoryQuery}</span>
                </p>
              )}
              <p className="text-xs text-blue-500 mt-0.5">
                {loading
                  ? "શોધી રહ્યા છીએ..."
                  : `${allNews.length} સમાચાર મળ્યા`}
              </p>
            </div>
            <button
              onClick={clearSearch}
              className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition font-medium shrink-0"
            >
              <XMarkIcon className="w-4 h-4" />
              <span className="hidden sm:inline">બધા સમાચાર</span>
            </button>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">

          {/* LEFT: YouTube Live */}
          <div className="hidden lg:block lg:col-span-2 bg-white rounded-2xl shadow-md p-4 h-fit self-start sticky top-4">
            <h2 className="text-lg font-bold text-red-600 mb-4">
              🔴 Live News
            </h2>
            <div className="rounded-xl overflow-hidden shadow">
              <iframe
                src="https://www.youtube.com/embed/c5gB1nv4QTc"
                title="Live News"
                className="w-full h-64 rounded-xl"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          {/* CENTER */}
          <div className="lg:col-span-8 space-y-4 sm:space-y-6">

            {/* Top Ad */}
            {topBannerAd && (
              <a
                href={topBannerAd.redirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:block"
              >
                <img
                  src={getFullUrl(topBannerAd.imageUrl)}
                  alt={topBannerAd.title}
                  className="rounded-xl shadow sm:h-52 lg:h-60 w-full object-cover"
                />
              </a>
            )}

            {/* Sliding Videos */}
            {!isSearching && slidingVideos.length > 0 && (
              <div className="bg-white rounded-xl shadow p-3 sm:p-4">
                <div className="flex gap-3 sm:gap-4 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {slidingVideos.map((video) => {
                    const videoUrl = getFullUrl(video?.mediaUrls?.[0]);
                    return (
                      <div
                        key={video.id}
                        className="min-w-45 sm:min-w-55 lg:min-w-62.5 shrink-0"
                      >
                        <video
                          src={videoUrl}
                          className="w-full h-28 sm:h-32 object-cover rounded-lg"
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

            {/* Loading */}
            {loading && (
              <div className="flex items-center justify-center py-16 text-gray-400">
                Loading...
              </div>
            )}

            {/* News Grid */}
            {!loading && allNews.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">

                {/* STORY NEWS */}
                <div className="space-y-3">
                  {storyNews.map((story) => (
                    <Link key={story.id} href={`/news/${story.id}`}>
                      <div className="flex gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg border-b">
                        <div className="flex-1 min-w-0">
                          <h2 className="font-semibold text-sm sm:text-base line-clamp-2">
                            {story.title}
                          </h2>
                          <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">
                            {story.shortDescription}
                          </p>
                        </div>
                        {story?.mediaUrls?.[0] && (
                          <img
                            src={getFullUrl(story.mediaUrls[0])}
                            className="w-20 h-16 sm:w-24 sm:h-20 object-cover rounded-lg shrink-0"
                            alt={story.title}
                          />
                        )}
                      </div>
                    </Link>
                  ))}
                </div>

                {/* DIGITAL NEWS */}
                <div className="space-y-3">
                  {digitalNews.map((digital) => {
                    const videoSrc = digital.finalVideoUrl
                      ? getFullUrl(digital.finalVideoUrl)
                      : digital?.mediaUrls?.[0]
                        ? getFullUrl(digital.mediaUrls[0])
                        : null;

                    return (
                      <Link key={digital.id} href={`/news/${digital.id}`}>
                        <div className="flex gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg border-b">
                          <div className="flex-1 min-w-0">
                            <h2 className="font-semibold text-sm sm:text-base line-clamp-2">
                              {digital.title}
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">
                              {digital.shortDescription}
                            </p>
                          </div>
                          {videoSrc && (
                            <div className="relative shrink-0">
                              <video
                                src={videoSrc}
                                className="w-20 h-16 sm:w-24 sm:h-20 object-cover rounded-lg"
                                muted
                              />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-lg">
                                <PlayCircleIcon className="w-6 h-6 text-white" />
                              </div>
                            </div>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Empty state */}
            {!loading && allNews.length === 0 && (
              <div className="flex items-center justify-center py-16 text-gray-400 text-sm">
                કોઈ સમાચાર મળ્યા નહીં
              </div>
            )}
          </div>

          {/* RIGHT ADS */}
          <div className="hidden lg:flex lg:col-span-2 flex-col gap-6">
            {rightTopAd && (
              <a
                href={rightTopAd.redirectUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={getFullUrl(rightTopAd.imageUrl)}
                  alt={rightTopAd.title}
                  className="rounded-xl shadow h-60 w-full object-cover"
                />
              </a>
            )}
            {rightBottomAd && (
              <a
                href={rightBottomAd.redirectUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={getFullUrl(rightBottomAd.imageUrl)}
                  alt={rightBottomAd.title}
                  className="rounded-xl shadow h-60 w-full object-cover"
                />
              </a>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
          Loading...
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}