import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MetricCard from './components/MetricCard';
import AuthButton from './components/AuthButton';
import { mockWellnessData } from './data/mockData';
import { fetchWellnessData } from './services/existApi';
import { WellnessData } from './types';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [wellnessData, setWellnessData] = useState<WellnessData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleThemeToggle = (isDark: boolean) => {
    setIsDarkMode(isDark);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to fetch real data from Exist.io
        const data = await fetchWellnessData();
        setWellnessData(data);
      } catch (err) {
        console.log('Using mock data instead:', err);
        // If API fails, use mock data
        setWellnessData(mockWellnessData);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your wellness data...</p>
        </div>
      </div>
    );
  }

  if (!wellnessData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">Failed to load data</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header onThemeToggle={handleThemeToggle} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AuthButton />
        
        {error && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg dark:bg-yellow-900/20 dark:border-yellow-800">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  API Connection Issue
                </h3>
                <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                  <p className="mb-2">
                    ⚠️ <strong>Using mock data:</strong> {error}
                  </p>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400">
                    Your real data will appear here once the connection is restored.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Daily Steps"
            data={wellnessData.steps}
            color="#10b981"
            icon="👟"
          />
          <MetricCard
            title="Sleep Time"
            data={wellnessData.sleep}
            color="#8b5cf6"
            icon="😴"
          />
          <MetricCard
            title="Meditation"
            data={wellnessData.meditation}
            color="#f59e0b"
            icon="🧘"
          />
          <MetricCard
            title="Productive Time"
            data={wellnessData.productivity}
            color="#3b82f6"
            icon="⚡"
          />
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Data shown for the past 7 days • Last updated: {new Date().toLocaleDateString()}
            {!error ? " • Connected to Exist.io API v2" : " • Using mock data"}
          </p>
        </div>
      </main>
    </div>
  );
}

export default App; 