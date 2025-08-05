"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";
import { Article } from "../lib/articleTypes";
import { getCredibilityColor, getShimmerIntensity, getShimmerDuration } from "../lib/credibilityColors";

interface NewsCardProps {
  article: Article;
}

const formatDate = (dateInput: string | undefined): string => {
  try {
    if (!dateInput || dateInput === "brak danych" || dateInput === "") {
      return "No date";
    }
    const date = new Date(String(dateInput));
    if (isNaN(date.getTime())) {
      return "No date";
    }
    return formatDistanceToNow(date, { 
      addSuffix: true, 
      locale: enUS 
    });
  } catch {
    return "No date";
  }
};

const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  const [expanded, setExpanded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const descRef = useRef<HTMLDivElement | null>(null);

  const title = 'title_en' in article && (article as any).title_en 
    ? (article as any).title_en 
    : article.title || 'No title';

  const description = 'description_en' in article && (article as any).description_en 
    ? (article as any).description_en 
    : article.description || 'No description';

  const credibilityColor = getCredibilityColor(article.credibility_score);
  const formattedDate = formatDate(article.created_at);
  const shimmerIntensity = getShimmerIntensity(article.credibility_score);
  const shimmerDuration = getShimmerDuration(shimmerIntensity);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const imageSrc = imageError || !article.image_url 
    ? "/news-placeholder.png" 
    : article.image_url;

  return (
    <article className="bg-white rounded-2xl shadow-md overflow-hidden mx-3">
      <div className="w-full h-56 bg-gray-100 relative overflow-hidden">
        <Image
          src={imageSrc}
          alt="Article image"
          className={`object-cover w-full h-full transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          fill
          unoptimized
          loading="lazy"
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        )}
        <div className="absolute top-3 right-3 z-10">
          <time className="bg-white/90 backdrop-blur-sm px-3 py-1 text-xs text-gray-600 rounded-full shadow">
            {formattedDate}
          </time>
        </div>
      </div>
      
      <div className="px-6 pt-4 pb-4">
        <h2 className="text-xl font-bold text-gray-900 leading-tight mb-3">{title}</h2>
        
        <span className="text-sm font-medium text-gray-700 mb-2 block">Credibility</span>
        <div className="w-full h-5 rounded-full overflow-hidden bg-gray-200 mb-3 relative">
          <div
            className="h-5 flex items-center justify-end pr-3 text-sm font-semibold text-white relative overflow-hidden"
            style={{
              width: `${article.credibility_score}%`,
              background: credibilityColor,
              transition: "width 0.5s cubic-bezier(0.4,0,0.2,1), background 0.3s ease",
            }}
          >
            {shimmerIntensity !== 'none' && (
              <div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                style={{
                  animation: `shimmer ${shimmerDuration} ease-in-out infinite`,
                  transform: 'translateX(-100%)',
                }}
              />
            )}
            {article.credibility_score}%
          </div>
        </div>
        
        <div className="w-full">
          <div
            className="relative group overflow-hidden transition-all duration-500 ease-in-out cursor-pointer pb-2 min-h-[5.5em]"
            style={{
              maxHeight: expanded ? "1000px" : "calc(5.5em + 1.25rem)",
              opacity: 1,
            }}
            onClick={() => setExpanded((v) => !v)}
            tabIndex={0}
            role="button"
            aria-expanded={expanded}
            ref={descRef}
          >
            {!expanded ? (
              <span
                className="block text-sm text-gray-700 leading-snug w-full select-none line-clamp-4 break-words"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  wordBreak: "break-word",
                  whiteSpace: "pre-line",
                }}
              >
                {description}
              </span>
            ) : (
              <span className="block text-sm text-gray-700 leading-snug w-full select-none">
                {description}
              </span>
            )}
            <button
              className="text-sm font-semibold text-black cursor-pointer mt-1"
              style={{
                background: "none",
                border: "none",
                boxShadow: "none",
                textDecoration: "none",
                padding: 0,
                margin: 0,
              }}
              tabIndex={-1}
              type="button"
            >
              {expanded ? 'Read less' : 'Read more'}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default NewsCard;
