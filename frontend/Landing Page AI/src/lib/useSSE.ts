import { useEffect, useState } from 'react';

export interface ProgressEvent {
  jobId: string;
  stage: string;
  message: string;
  timestamp: string;
  [key: string]: any;
}

/**
 * Hook for subscribing to Server-Sent Events
 */
export function useSSE(url: string | null, onEvent?: (event: ProgressEvent) => void) {
  const [events, setEvents] = useState<ProgressEvent[]>([]);
  const [currentEvent, setCurrentEvent] = useState<ProgressEvent | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) return;

    let eventSource: EventSource | null = null;

    try {
      eventSource = new EventSource(url);

      eventSource.onopen = () => {
        setIsConnected(true);
        setError(null);
      };

      eventSource.onmessage = (event) => {
        try {
          const data: ProgressEvent = JSON.parse(event.data);

          setCurrentEvent(data);
          setEvents(prev => [...prev, data]);

          if (onEvent) {
            onEvent(data);
          }

          // Check if done
          if (data.stage === 'done' || data.stage === 'error') {
            setIsDone(true);
            eventSource?.close();
          }
        } catch (err) {
          console.error('Failed to parse SSE event:', err);
        }
      };

      eventSource.onerror = (err) => {
        console.error('SSE error:', err);
        setError('Connection error');
        setIsConnected(false);
        eventSource?.close();
      };
    } catch (err) {
      console.error('Failed to create EventSource:', err);
      setError('Failed to connect');
    }

    return () => {
      eventSource?.close();
      setIsConnected(false);
    };
  }, [url, onEvent]);

  return {
    events,
    currentEvent,
    isConnected,
    isDone,
    error,
  };
}
