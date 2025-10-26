'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ProgressTracker } from '../../../components/ProgressTracker';
import { MatchResults } from '../../../components/MatchResults';
import { Footer } from '../../../components/Footer';
import { getJobResults, type Match } from '../../../lib/api';

export default function JobPage() {
  const params = useParams();
  const jobId = params.jobId as string;

  const [matches, setMatches] = useState<Match[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState('');

  const loadResults = async () => {
    try {
      const results = await getJobResults(jobId);

      if (results.status === 'completed') {
        setMatches(results.matches);
        setShowResults(true);
      }
    } catch (err: any) {
      if (err.response?.status === 202) {
        // Job not complete yet
        return;
      }
      setError(err.response?.data?.error || 'Failed to load results');
    }
  };

  const handleComplete = () => {
    setTimeout(() => {
      loadResults();
    }, 2000);
  };

  useEffect(() => {
    if (!showResults) {
      // Poll for results every 3 seconds
      const interval = setInterval(loadResults, 3000);
      return () => clearInterval(interval);
    }
  }, [showResults, jobId]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#2563EB] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-5xl mb-4"
          >
            {showResults ? 'Your Matches Are Ready!' : 'Finding Your Perfect Match'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-300"
          >
            {showResults
              ? `We found ${matches.length} qualified professionals for your project`
              : 'Our AI is analyzing your project and searching for the best contractors'}
          </motion.p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-800 mb-8 text-center max-w-2xl mx-auto">
            {error}
          </div>
        )}

        {!showResults && <ProgressTracker jobId={jobId} onComplete={handleComplete} />}

        {showResults && <MatchResults matches={matches} />}
      </div>

      <Footer />
    </main>
  );
}
