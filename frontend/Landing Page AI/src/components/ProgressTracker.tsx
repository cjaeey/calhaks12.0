'use client';

import { motion } from 'motion/react';
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { Card } from './ui/card';
import { useSSE } from '../lib/useSSE';

interface ProgressTrackerProps {
  jobId: string;
  onComplete?: () => void;
}

const stageInfo = {
  connected: { label: 'Connected', icon: CheckCircle2 },
  started: { label: 'Started', icon: Loader2 },
  intake: { label: 'Analyzing Project', icon: Loader2 },
  scrape: { label: 'Finding Professionals', icon: Loader2 },
  index: { label: 'Indexing Data', icon: Loader2 },
  match: { label: 'Ranking Matches', icon: Loader2 },
  done: { label: 'Complete', icon: CheckCircle2 },
  error: { label: 'Error', icon: AlertCircle },
};

export function ProgressTracker({ jobId, onComplete }: ProgressTrackerProps) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const eventsUrl = `${apiUrl}/api/jobs/${jobId}/events`;

  const { events, isDone, error } = useSSE(eventsUrl, (event) => {
    if (event.stage === 'done' && onComplete) {
      setTimeout(onComplete, 1500);
    }
  });

  return (
    <Card className="p-8 bg-white max-w-3xl mx-auto">
      <h2 className="text-3xl mb-8 text-center">Processing Your Request</h2>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-800 mb-6">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {events.map((event, index) => {
          const info = stageInfo[event.stage as keyof typeof stageInfo] || {
            label: event.stage,
            icon: Loader2,
          };
          const Icon = info.icon;
          const isActive = index === events.length - 1 && !isDone;
          const isDoneItem = event.stage === 'done' || (isDone && index === events.length - 1);
          const isError = event.stage === 'error';

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                isActive
                  ? 'border-blue-500 bg-blue-50'
                  : isDoneItem
                  ? 'border-green-500 bg-green-50'
                  : isError
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div
                className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                  isActive
                    ? 'bg-blue-500 text-white'
                    : isDoneItem
                    ? 'bg-green-500 text-white'
                    : isError
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {isActive ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <Icon className="w-6 h-6" />
                )}
              </div>

              <div className="flex-1">
                <div className="font-semibold text-lg">{info.label}</div>
                <div className="text-sm text-gray-600">{event.message}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {isDone && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-2 text-green-600 text-xl font-semibold">
            <CheckCircle2 className="w-6 h-6" />
            Processing Complete!
          </div>
        </motion.div>
      )}
    </Card>
  );
}
