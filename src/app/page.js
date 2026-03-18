// "use client";

// import React, { useState, useEffect, Suspense } from "react";
// import Link from "next/link";
// import { useSearchParams, useRouter } from "next/navigation";
// import { PlayCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
// import { getHomePageNews } from "./utils/api";

// const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "");

// const getFullUrl = (path) => {
//   if (!path) return "";
//   if (path.startsWith("http")) return path;
//   const cleanPath = path.startsWith("/") ? path : `/${path}`;
//   return encodeURI(`${BASE_URL}${cleanPath}`);
// };

// function HomeContent() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const [newsData, setNewsData] = useState([]);
//   const [slidingVideos, setSlidingVideos] = useState([]);
//   const [loading, setLoading] = useState(true);
//   // -------------------------------Ads-------------------------------
//   const [topBannerAd, setTopBannerAd] = useState(null);
//   const [rightTopAd, setRightTopAd] = useState(null);
//   const [rightBottomAd, setRightBottomAd] = useState(null);

//   const searchQuery = searchParams.get("search") || "";
//   const categoryQuery = searchParams.get("category") || "";
//   const citiesQuery = searchParams.get("cities") || "";

//   useEffect(() => {
//     const fetchAds = async () => {
//       try {
//         const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

//         const [topRes, rightTopRes, rightBottomRes] = await Promise.all([
//           fetch(`${baseUrl}/ads/TOP_BANNER`),
//           fetch(`${baseUrl}/ads/RIGHT_TOP`),
//           fetch(`${baseUrl}/ads/RIGHT_BOTTOM`),
//         ]);

//         const [topData, rightTopData, rightBottomData] = await Promise.all([
//           topRes.json(),
//           rightTopRes.json(),
//           rightBottomRes.json(),
//         ]);

//         // Show only first ad if multiple
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

//   useEffect(() => {
//     if (citiesQuery) {
//       fetchNewsByCities(citiesQuery);
//     } else if (searchQuery || categoryQuery) {
//       fetchFilteredNews(searchQuery, categoryQuery);
//     } else {
//       fetchAllData();
//     }
//   }, [searchQuery, categoryQuery, citiesQuery]);

//   const fetchAllData = async () => {
//     try {
//       setLoading(true);
//       const news = await getHomePageNews();
//       setNewsData(Array.isArray(news) ? news : []);

//       const slidingRes = await fetch(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/homepage/videos/sliding`,
//       );
//       const sliding = await slidingRes.json();
//       setSlidingVideos(Array.isArray(sliding) ? sliding : []);
//     } catch (error) {
//       console.error("Error fetching homepage data:", error);
//       setNewsData([]);
//       setSlidingVideos([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchNewsByCities = async (citiesString) => {
//     try {
//       setLoading(true);

//       const cityArray = citiesString.split(",");

//       const params = new URLSearchParams();
//       cityArray.forEach((city) => {
//         params.append("cities", city);
//       });

//       const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/homepage/by-cities?${params.toString()}`;

//       const res = await fetch(url);
//       if (!res.ok) throw new Error("Failed to fetch city news");

//       const data = await res.json();
//       setNewsData(Array.isArray(data) ? data : []);
//     } catch (error) {
//       console.error("City filter error:", error);
//       setNewsData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchFilteredNews = async (query, category) => {
//     try {
//       setLoading(true);
//       let url = "";

//       if (category && !query) {
//         url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/homepage/by-category?category=${encodeURIComponent(
//           category,
//         )}`;
//       } else {
//         const params = new URLSearchParams();
//         params.set("page", "0");
//         params.set("size", "20");
//         if (query) params.set("keyword", query);
//         if (category) params.set("category", category);

//         url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/searchEngine/filter?${params.toString()}`;
//       }

//       if (!url) {
//         setNewsData([]);
//         return;
//       }

//       const res = await fetch(url);
//       if (!res.ok) throw new Error(`API Error: ${res.status}`);

//       const data = await res.json();
//       const items = Array.isArray(data)
//         ? data
//         : Array.isArray(data?.content)
//           ? data.content
//           : [];

//       setNewsData(items);
//     } catch (error) {
//       console.error("Error fetching filtered news:", error);
//       setNewsData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const clearSearch = () => router.push("/");

//   const storyNews = newsData.filter((news) => news?.type !== "DIGITAL");
//   const digitalNews = newsData.filter((news) => news?.type === "DIGITAL");
//   const isSearching = !!(searchQuery || categoryQuery || citiesQuery);

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
//                   : `${newsData.length} સમાચાર મળ્યા`}
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
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 ">
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
//             {!loading && newsData.length > 0 && (
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
//                 {/* STORY NEWS */}
//                 <div className="space-x-3 ">
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
//                 <div className="space-x-3">
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

import Link from "next/link";

export default function Home() {
  const latestNews = [
    {
      id: 1,
      title: "ગુજરાતમાં આગામી 3 દિવસ ભારે વરસાદની આગાહી",
      description:
        "હવામાન વિભાગે દક્ષિણ ગુજરાતમાં ભારે વરસાદની શક્યતા વ્યક્ત કરી છે. લોકોને સાવચેત રહેવાની સૂચના આપવામાં આવી છે.",
      image: "https://images.unsplash.com/photo-1500673922987-e212871fec22",
    },
    {
      id: 2,
      title: "સુરતમાં નવી મેટ્રો પ્રોજેક્ટને મંજૂરી",
      description:
        "રાજ્ય સરકારે સુરત શહેર માટે નવા મેટ્રો પ્રોજેક્ટને મંજૂરી આપી છે, જેનાથી ટ્રાફિક સમસ્યા ઘટશે.",
      image: "https://images.unsplash.com/photo-1508057198894-247b23fe5ade",
    },
    {
      id: 3,
      title: "અમદાવાદમાં સ્ટાર્ટઅપ સમિટનું આયોજન",
      description:
        "અમદાવાદમાં યુવાનો માટે સ્ટાર્ટઅપ સમિટ યોજાઈ જેમાં દેશભરના ઉદ્યોગપતિઓએ ભાગ લીધો.",
      image: "https://images.unsplash.com/photo-1492724441997-5dc865305da7",
    },
    {
      id: 4,
      title: "ભારત-ઓસ્ટ્રેલિયા મેચમાં ભારતની જીત",
      description:
        "ભારતીય ક્રિકેટ ટીમે શાનદાર પ્રદર્શન કરીને ઓસ્ટ્રેલિયાને હરાવ્યું.",
      image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e",
    },
    {
      id: 5,
      title: "ગુજરાતમાં નવા ઉદ્યોગોને પ્રોત્સાહન યોજના શરૂ",
      description:
        "રાજ્ય સરકારે નવા ઉદ્યોગકારોને સહાય માટે નવી યોજના જાહેર કરી.",
      image: "https://images.unsplash.com/photo-1521791136064-7986c2920216",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-red-600 text-white py-4 shadow">
        <h1 className="text-center text-2xl font-bold">
          📰 તાજા સમાચાર (Latest News)
        </h1>
      </div>

      {/* News Section */}
      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {latestNews.map((news) => (
          <Link key={news.id} href="#">
            <div className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden cursor-pointer">
              <img
                src={news.image}
                alt={news.title}
                className="w-full h-48 object-cover"
              />

              <div className="p-4">
                <h2 className="font-bold text-lg line-clamp-2">{news.title}</h2>

                <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                  {news.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
