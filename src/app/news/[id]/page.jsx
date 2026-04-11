// "use client";

// import { useRouter, useParams } from "next/navigation";
// import { useEffect, useState } from "react";

// // 🔥 Base URL
// const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "");
// const getFullUrl = (path) => {
//   if (!path) return "";
//   if (path.startsWith("http")) return path;
//   const cleanPath = path.startsWith("/") ? path : `/${path}`;
//   return encodeURI(`${BASE_URL}${cleanPath}`);
// };


// export default function NewsDetails() {
//   const router = useRouter();
//   const params = useParams();

//   const [news, setNews] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchNews = async () => {
//       try {
//         const res = await fetch(`${BASE_URL}/api/homepage/news/${params?.id}`);

//         if (!res.ok) {
//           throw new Error("News not found");
//         }

//         const result = await res.json();
//         setNews(result);
//       } catch (error) {
//         console.error(error);
//         setNews(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (params?.id) {
//       fetchNews();
//     }
//   }, [params?.id]);

//   if (loading) {
//     return (
//       <div className="text-center mt-20 text-blue-500">Loading news...</div>
//     );
//   }

//   if (!news) {
//     return <div className="text-center mt-20 text-red-500">News not found</div>;
//   }

//   const imageUrl = getFullUrl(news?.mediaUrls?.[0]);
//   const videoUrl = getFullUrl(news?.finalVideoUrl || news?.mediaUrls?.[0]);
//   const audioUrl = getFullUrl(news?.audioUrl);
//   const isProcessing = news?.type === "DIGITAL" && !news?.finalVideoUrl;

//   return (
//     <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-12 px-4">
//       <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8">
//         <button
//           onClick={() => router.back()}
//           className="mb-6 text-blue-600 hover:underline cursor-pointer"
//         >
//           ← Back
//         </button>

//         {/* STORY */}
//         {news?.type === "STORY" && imageUrl && (
//           <img
//             src={imageUrl}
//             alt={news?.title}
//             className="w-full h-96 object-cover rounded-2xl mb-6"
//           />
//         )}

//         {/* DIGITAL */}
//         {news?.type === "DIGITAL" && (
//           <>
//             {isProcessing ? (
//               <div className="w-full h-48 rounded-2xl mb-6 bg-orange-50 border-2 border-dashed border-orange-300 flex flex-col items-center justify-center gap-2">
//                 <div className="text-3xl">⏳</div>
//                 <p className="text-orange-600 font-semibold text-sm">
//                   Video is being processed...
//                 </p>
//               </div>
//             ) : (
//               <video
//                 src={videoUrl}
//                 controls
//                 className="w-full h-96 object-cover rounded-2xl mb-6"
//               />
//             )}
//           </>
//         )}

//         <h1 className="text-3xl font-bold mb-4">{news?.title}</h1>

//         {news?.category && (
//           <span className="px-4 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
//             {news.category}
//           </span>
//         )}

//         {news?.type === "DIGITAL" && audioUrl && (
//           <div className="mt-4">
//             <p className="font-semibold mb-2">Listen Audio:</p>
//             <audio controls className="w-full">
//               <source src={audioUrl} type="audio/mpeg" />
//             </audio>
//           </div>
//         )}

//         <div className="mt-6 text-gray-700 leading-8 text-lg whitespace-pre-line">
//           {news?.type === "STORY" && (
//             <>
//               {news?.shortDescription && (
//                 <p className="mb-4">{news.shortDescription}</p>
//               )}
//               {news?.fullContext && <p>{news.fullContext}</p>}
//             </>
//           )}

//           {news?.type === "DIGITAL" && <p>{news?.shortDescription}</p>}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchNewsById, getFullUrl } from "@/app/utils/api";


export default function NewsDetails() {
  const router = useRouter();
  const params = useParams();

  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [slowLoad, setSlowLoad] = useState(false);

  useEffect(() => {
    if (!params?.id) return;

    const fetchNews = async () => {
      setLoading(true);

      // Show slow load warning after 5 seconds (Render cold start)
      const slowTimer = setTimeout(() => setSlowLoad(true), 5000);

      const result = await fetchNewsById(params.id);
      setNews(result);

      clearTimeout(slowTimer);
      setSlowLoad(false);
      setLoading(false);
    };

    fetchNews();
  }, [params?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-blue-500 text-sm">સમાચાર લોડ થઈ રહ્યા છે...</p>
        {slowLoad && (
          <p className="text-orange-400 text-xs">
            સર્વર શરૂ થઈ રહ્યો છે, થોડી રાહ જુઓ...
          </p>
        )}
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <p className="text-red-500 text-lg font-semibold">સમાચાર મળ્યા નહીં</p>
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
        >
          હોમ પર જાઓ
        </button>
      </div>
    );
  }

  const imageUrl = getFullUrl(news?.mediaUrls?.[0]);
  const videoUrl = getFullUrl(news?.finalVideoUrl || news?.mediaUrls?.[0]);
  const audioUrl = getFullUrl(news?.audioUrl);
  const isProcessing = news?.type === "DIGITAL" && !news?.finalVideoUrl;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-6 sm:p-8">

        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-1 text-blue-600 hover:underline text-sm cursor-pointer"
        >
          ← પાછળ જાઓ
        </button>

        {/* Category Badge */}
        {news?.category && (
          <span className="inline-block mb-4 px-4 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold">
            {news.category}
          </span>
        )}

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 leading-tight">
          {news?.title}
        </h1>

        {/* STORY - Image */}
        {news?.type === "STORY" && imageUrl && (
          <img
            src={imageUrl}
            alt={news?.title}
            className="w-full h-64 sm:h-96 object-cover rounded-2xl mb-6"
          />
        )}

        {/* DIGITAL - Video */}
        {news?.type === "DIGITAL" && (
          <div className="mb-6">
            {isProcessing ? (
              <div className="w-full h-48 rounded-2xl bg-orange-50 border-2 border-dashed border-orange-300 flex flex-col items-center justify-center gap-2">
                <div className="text-3xl">⏳</div>
                <p className="text-orange-600 font-semibold text-sm">
                  વિડિઓ તૈયાર થઈ રહ્યો છે...
                </p>
              </div>
            ) : (
              <video
                src={videoUrl}
                controls
                className="w-full h-64 sm:h-96 object-cover rounded-2xl"
              />
            )}
          </div>
        )}

        {/* Audio Player */}
        {news?.type === "DIGITAL" && audioUrl && (
          <div className="mb-6 p-4 bg-gray-50 rounded-2xl">
            <p className="font-semibold text-sm text-gray-700 mb-2">
              🎙️ ઓડિયો સાંભળો:
            </p>
            <audio controls className="w-full">
              <source src={audioUrl} type="audio/mpeg" />
            </audio>
          </div>
        )}

        {/* Content */}
        <div className="text-gray-700 leading-8 text-base sm:text-lg whitespace-pre-line">
          {news?.type === "STORY" && (
            <>
              {news?.shortDescription && (
                <p className="mb-4 text-gray-500 text-base">
                  {news.shortDescription}
                </p>
              )}
              {news?.fullContext && <p>{news.fullContext}</p>}
            </>
          )}

          {news?.type === "DIGITAL" && (
            <p>{news?.shortDescription}</p>
          )}
        </div>

        {/* Meta Info */}
        <div className="mt-8 pt-4 border-t border-gray-100 flex flex-wrap gap-4 text-xs text-gray-400">
          {news?.anchorName && <span>🎙️ {news.anchorName}</span>}
          {news?.city && <span>📍 {news.city}</span>}
          {news?.state && <span>🗺️ {news.state}</span>}
          {news?.createdAt && (
            <span>
              🕐{" "}
              {new Date(news.createdAt).toLocaleDateString("gu-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}