"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

// 🔥 Base URL
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "");
const getFullUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return encodeURI(`${BASE_URL}${cleanPath}`);
};


export default function NewsDetails() {
  const router = useRouter();
  const params = useParams();

  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/homepage/news/${params?.id}`);

        if (!res.ok) {
          throw new Error("News not found");
        }

        const result = await res.json();
        setNews(result);
      } catch (error) {
        console.error(error);
        setNews(null);
      } finally {
        setLoading(false);
      }
    };

    if (params?.id) {
      fetchNews();
    }
  }, [params?.id]);

  if (loading) {
    return (
      <div className="text-center mt-20 text-blue-500">Loading news...</div>
    );
  }

  if (!news) {
    return <div className="text-center mt-20 text-red-500">News not found</div>;
  }

  const imageUrl = getFullUrl(news?.mediaUrls?.[0]);
  const videoUrl = getFullUrl(news?.finalVideoUrl || news?.mediaUrls?.[0]);
  const audioUrl = getFullUrl(news?.audioUrl);
  const isProcessing = news?.type === "DIGITAL" && !news?.finalVideoUrl;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8">
        <button
          onClick={() => router.back()}
          className="mb-6 text-blue-600 hover:underline cursor-pointer"
        >
          ← Back
        </button>

        {/* STORY */}
        {news?.type === "STORY" && imageUrl && (
          <img
            src={imageUrl}
            alt={news?.title}
            className="w-full h-96 object-cover rounded-2xl mb-6"
          />
        )}

        {/* DIGITAL */}
        {news?.type === "DIGITAL" && (
          <>
            {isProcessing ? (
              <div className="w-full h-48 rounded-2xl mb-6 bg-orange-50 border-2 border-dashed border-orange-300 flex flex-col items-center justify-center gap-2">
                <div className="text-3xl">⏳</div>
                <p className="text-orange-600 font-semibold text-sm">
                  Video is being processed...
                </p>
              </div>
            ) : (
              <video
                src={videoUrl}
                controls
                className="w-full h-96 object-cover rounded-2xl mb-6"
              />
            )}
          </>
        )}

        <h1 className="text-3xl font-bold mb-4">{news?.title}</h1>

        {news?.category && (
          <span className="px-4 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
            {news.category}
          </span>
        )}

        {news?.type === "DIGITAL" && audioUrl && (
          <div className="mt-4">
            <p className="font-semibold mb-2">Listen Audio:</p>
            <audio controls className="w-full">
              <source src={audioUrl} type="audio/mpeg" />
            </audio>
          </div>
        )}

        <div className="mt-6 text-gray-700 leading-8 text-lg whitespace-pre-line">
          {news?.type === "STORY" && (
            <>
              {news?.shortDescription && (
                <p className="mb-4">{news.shortDescription}</p>
              )}
              {news?.fullContext && <p>{news.fullContext}</p>}
            </>
          )}

          {news?.type === "DIGITAL" && <p>{news?.shortDescription}</p>}
        </div>
      </div>
    </div>
  );
}
