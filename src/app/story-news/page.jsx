"use client";
import React, { useEffect, useState } from "react";
import { fetchStoryNews } from "../utils/api";

// ✅ Auto switch local / production
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "");

// ✅ Safe media URL builder
const getFullUrl = (path) => {
  if (!path) return "";

  // If backend already returns full URL
  if (path.startsWith("http")) return path;

  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return encodeURI(`${BASE_URL}${cleanPath}`);
};

export default function StoryNewsPage() {
  const [news, setNews] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const loadNews = async () => {
      try {
        const data = await fetchStoryNews();
        setNews(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Story News Error:", error);
        setNews([]);
      }
    };

    loadNews();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <h1 className="text-3xl font-bold mb-8 text-center">
        📰 Latest Story News
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {news.map((item) => {
          const isExpanded = expandedId === item.id;

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-500"
            >
              {/* Image */}
              {item?.mediaUrls?.[0] && (
                <img
                  src={getFullUrl(item.mediaUrls[0])}
                  alt={item?.title}
                  className="w-full h-56 object-cover"
                />
              )}

              {/* Content */}
              <div className="p-5">
                {item?.category && (
                  <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                    {item.category}
                  </span>
                )}

                <h2 className="text-xl font-bold mb-2">{item?.title}</h2>

                {/* Short Description */}
                <p className="text-gray-600 text-sm mb-3">
                  {item?.shortDescription}
                </p>

                {/* Expanded Full Content */}
                {isExpanded && (
                  <p className="text-gray-700 mt-4 whitespace-pre-line transition-all duration-500">
                    {item?.fullContext}
                  </p>
                )}

                <button
                  onClick={() => toggleExpand(item.id)}
                  className="mt-4 text-blue-600 font-semibold hover:underline"
                >
                  {isExpanded ? "Show Less ↑" : "Read More →"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
