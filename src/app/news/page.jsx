'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';
import NewsCardList from '@/app/components/NewsCardList';
import FirebaseTest from '@/app/components/FirebaseTest';
import { useLanguage } from '@/app/contexts/LanguageContext';

export default function NewsPage() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useLanguage();

  useEffect(() => {
    console.log('🚀 NewsPage: Starting Firestore subscription');
    console.log('🔧 Firebase config check:', {
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'pulse-adc8d',
      hasApiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      windowExists: typeof window !== 'undefined'
    });

    try {
      const q = query(
        collection(db, 'articles'),
        orderBy('published_at', 'desc')
      );

      console.log('📋 NewsPage: Query created, setting up onSnapshot');

      const unsubscribe = onSnapshot(
        q,
        snapshot => {
          console.log('📬 NewsPage: onSnapshot callback triggered');
          console.log('📊 NewsPage: Snapshot metadata:', {
            empty: snapshot.empty,
            size: snapshot.size,
            docs: snapshot.docs.length
          });

          if (snapshot.empty) {
            console.log('⚠️ NewsPage: No documents found in collection');
            setCards([]);
            setLoading(false);
            return;
          }

          const arr = snapshot.docs.map((doc, index) => {
            const data = doc.data();
            console.log(`📄 NewsPage: Document ${index + 1} (ID: ${doc.id}):`, {
              hasTitle: !!data.title,
              hasDescription: !!data.description,
              hasImageUrl: !!data.image_url,
              hasCredibilityScore: typeof data.credibility_score === 'number',
              hasPublishedAt: !!data.published_at,
              hasCreatedAt: !!data.created_at,
              allFields: Object.keys(data)
            });
            
            let createdDateStr = '';
            let publishedDateStr = '';
            
            // Handle Firestore Timestamp conversion for created_at
            if (data.created_at instanceof Timestamp) {
              createdDateStr = data.created_at.toDate().toISOString();
            } else if (data.created_at?.seconds != null) {
              const ms = data.created_at.seconds * 1000 + data.created_at.nanoseconds / 1e6;
              createdDateStr = new Date(ms).toISOString();
            } else if (data.created_at) {
              const testDate = new Date(data.created_at);
              createdDateStr = isNaN(testDate.getTime()) ? '' : data.created_at;
            } else {
              createdDateStr = new Date().toISOString();
            }
            
            // Handle Firestore Timestamp conversion for published_at
            if (data.published_at instanceof Timestamp) {
              publishedDateStr = data.published_at.toDate().toISOString();
            } else if (data.published_at?.seconds != null) {
              const ms = data.published_at.seconds * 1000 + data.published_at.nanoseconds / 1e6;
              publishedDateStr = new Date(ms).toISOString();
            } else if (data.published_at) {
              const testDate = new Date(data.published_at);
              publishedDateStr = isNaN(testDate.getTime()) ? '' : data.published_at;
            } else {
              publishedDateStr = '';
            }
            
            const mappedImageUrl = data.image_url || '/news-placeholder.png';
            
            const mappedDoc = {
              id: doc.id,
              title: data.title || '',
              description: data.description || '',
              image_url: mappedImageUrl,
              credibility_score: data.credibility_score || 0,
              created_at: createdDateStr,
              trend: data.trend || '',
              source: data.source || '',
              published_at: publishedDateStr // Added this field
            };
            
            console.log(`✅ NewsPage: Mapped document ${index + 1}:`, mappedDoc);
            return mappedDoc;
          });

          console.log('📝 NewsPage: Final mapped array:', arr);
          setCards(arr);
          setLoading(false);
        },
        error => {
          console.error('❌ NewsPage: onSnapshot error:', error);
          console.error('❌ Error details:', {
            code: error.code,
            message: error.message,
            stack: error.stack
          });
          setError(error.message);
          setLoading(false);
        }
      );

      return () => {
        console.log('🔌 NewsPage: Cleaning up subscription');
        unsubscribe();
      };
    } catch (err) {
      console.error('❌ NewsPage: useEffect error:', err);
      setError(err.message);
      setLoading(false);
    }
  }, []);

  console.log('🎯 NewsPage: Render state:', {
    loading,
    error,
    cardsLength: cards.length,
    hasCards: cards.length > 0
  });

  if (error) {
    return (
      <main className="px-4 py-8 bg-slate-50 min-h-screen">
        <p className="text-red-500">{t('error')}: {error}</p>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Temporary Firebase Test Component */}
      <div className="px-4 py-4">
        <FirebaseTest />
      </div>
      
      {loading ? (
        <div className="px-4 py-8">
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      ) : cards.length === 0 ? (
        <div className="px-4 py-8">
          <p className="text-gray-600">{t('noArticlesFound')}</p>
        </div>
      ) : (
        <div className="px-4 pb-8">
          <NewsCardList cards={cards} />
        </div>
      )}
    </div>
  );
}
