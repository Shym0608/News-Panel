"use client";

import { useSearchParams, useRouter } from "next/navigation";

// ✅ Auto switch local / production
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "");

// ✅ Safe media URL builder
const getFullUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return encodeURI(`${BASE_URL}${cleanPath}`);
};

export default function NewsDetails() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const data = searchParams.get("data");

  if (!data) {
    return (
      <div className="text-center mt-20 text-red-500">No news data found</div>
    );
  }

  let news;
  try {
    news = JSON.parse(data);
  } catch (error) {
    console.error("Invalid news data:", error);
    return (
      <div className="text-center mt-20 text-red-500">Invalid news data</div>
    );
  }

  // ✅ For STORY → use first image from mediaUrls
  const imageUrl = getFullUrl(news?.mediaUrls?.[0]);

  // ✅ For DIGITAL → prefer finalVideoUrl (TTS merged), fallback to raw upload
  const videoUrl = getFullUrl(news?.finalVideoUrl || news?.mediaUrls?.[0]);

  const audioUrl = getFullUrl(news?.audioUrl);

  // ✅ Still processing if finalVideoUrl is missing
  const isProcessing = news?.type === "DIGITAL" && !news?.finalVideoUrl;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 text-blue-600 hover:underline"
        >
          ← Back
        </button>

        {/* ── STORY: show image ───────────────────────────────── */}
        {news?.type === "STORY" && imageUrl && (
          <img
            src={imageUrl}
            alt={news?.title}
            className="w-full h-96 object-cover rounded-2xl mb-6"
          />
        )}

        {/* ── DIGITAL: show final merged video (with AI voice) ── */}
        {news?.type === "DIGITAL" && (
          <>
            {isProcessing ? (
              // ✅ finalVideoUrl not ready yet — show friendly message
              <div className="w-full h-48 rounded-2xl mb-6 bg-orange-50 border-2 border-dashed border-orange-300 flex flex-col items-center justify-center gap-2">
                <div className="text-3xl">⏳</div>
                <p className="text-orange-600 font-semibold text-sm">
                  Video is being processed. Please check back shortly.
                </p>
              </div>
            ) : (
              // ✅ finalVideoUrl ready — play TTS merged video
              <video
                key={videoUrl}
                src={videoUrl}
                className="w-full h-96 object-cover rounded-2xl mb-6"
                controls
                autoPlay={false}
              />
            )}
          </>
        )}

        {/* Title */}
        <h1 className="text-3xl font-bold mb-4">{news?.title}</h1>

        {/* Category Badge */}
        {news?.category && (
          <span className="px-4 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
            {news.category}
          </span>
        )}

        {/* Anchor name */}
        {news?.type === "DIGITAL" && news?.anchorName && (
          <div className="mt-4 text-gray-700">
            🎙 Anchor: <span className="font-semibold">{news.anchorName}</span>
          </div>
        )}

        {/* Audio player (only if separate audioUrl exists) */}
        {news?.type === "DIGITAL" && audioUrl && (
          <div className="mt-4">
            <p className="font-semibold mb-2">Listen Audio:</p>
            <audio controls className="w-full">
              <source src={audioUrl} type="audio/mpeg" />
            </audio>
          </div>
        )}

        {/* Content */}
        <div className="mt-6 text-gray-700 leading-8 text-lg whitespace-pre-line">
          {news?.type === "STORY"
            ? news?.fullContext || news?.shortDescription
            : news?.shortDescription}
        </div>
      </div>
    </div>
  );
}
