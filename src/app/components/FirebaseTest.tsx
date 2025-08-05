'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function FirebaseTest() {
  const [testResult, setTestResult] = useState<string>('Testing...');
  const [docCount, setDocCount] = useState<number>(0);

  useEffect(() => {
    const testFirebaseConnection = async () => {
      try {
        console.log('🧪 FirebaseTest: Starting connection test');
        
        // Test basic connection
        const articlesRef = collection(db, 'articles');
        console.log('🧪 FirebaseTest: Collection reference created');
        
        // Try to get a few documents
        const q = query(articlesRef, limit(5));
        const snapshot = await getDocs(q);
        
        console.log('🧪 FirebaseTest: Query executed successfully');
        console.log('🧪 FirebaseTest: Snapshot info:', {
          empty: snapshot.empty,
          size: snapshot.size,
          docs: snapshot.docs.length
        });
        
        setDocCount(snapshot.size);
        
        if (snapshot.empty) {
          setTestResult('✅ Connected to Firebase, but no documents found in "articles" collection');
        } else {
          const firstDoc = snapshot.docs[0];
          const data = firstDoc.data();
          console.log('🧪 FirebaseTest: First document data:', data);
          setTestResult(`✅ Connected to Firebase! Found ${snapshot.size} documents. First doc has title: "${data.title || 'No title'}"`);
        }
      } catch (error) {
        console.error('❌ FirebaseTest: Connection failed:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        setTestResult(`❌ Firebase connection failed: ${errorMessage}`);
      }
    };

    testFirebaseConnection();
  }, []);

  return (
    <div className="p-4 bg-gray-100 rounded-lg mb-4">
      <h3 className="font-bold mb-2">Firebase Connection Test</h3>
      <p className="text-sm">{testResult}</p>
      {docCount > 0 && (
        <p className="text-sm text-green-600 mt-1">
          Found {docCount} document(s) in articles collection
        </p>
      )}
    </div>
  );
} 