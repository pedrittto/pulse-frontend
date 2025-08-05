"use client";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { db } from "../lib/firebase";
import NewsCardList from "./NewsCardList";
import { Article } from "../lib/articleTypes";

export default function NewsFeed() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('📡 NewsFeed: Starting Firestore subscription');
    
    try {
      const articlesQuery = query(
        collection(db, "articles"),
        orderBy("published_at", "desc"),
        limit(20)
      );
      
      const unsubscribe = onSnapshot(
        articlesQuery,
        (snapshot) => {
          console.log('📊 NewsFeed: Received', snapshot.docs.length, 'articles from Firestore');
          
          const news = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
            } as Article;
          });
          
          setArticles(news);
          setIsLoading(false);
          setError(null);
        },
        (error) => {
          console.error('❌ NewsFeed: Firestore subscription error:', error);
          setError(error.message);
          setIsLoading(false);
        }
      );
      
      return () => {
        console.log('🔌 NewsFeed: Unsubscribing from Firestore');
        unsubscribe();
      };
    } catch (err) {
      console.error('❌ NewsFeed: Error setting up subscription:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        Error loading articles: {error}
      </div>
    );
  }

  return <NewsCardList cards={articles} />;
}
