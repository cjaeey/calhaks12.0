import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

export interface JobRequest {
  prompt: string;
  photoUrls?: string[];
  city: string;
  state: string;
  zipCode?: string;
}

export interface JobResponse {
  jobId: string;
  message: string;
  status: string;
}

export interface Professional {
  id: string;
  name: string;
  trade: string;
  city: string;
  state: string;
  services: string[];
  rating: number;
  price_band: string;
  license?: string;
  website?: string;
}

export interface Match extends Professional {
  score: number;
  reason: string;
  concerns?: string;
}

export interface JobResults {
  jobId: string;
  status: string;
  matches: Match[];
  count: number;
}

/**
 * Create a new job
 */
export async function createJob(jobData: JobRequest): Promise<JobResponse> {
  const response = await apiClient.post('/api/jobs', jobData);
  return response.data;
}

/**
 * Get job status
 */
export async function getJob(jobId: string) {
  const response = await apiClient.get(`/api/jobs/${jobId}`);
  return response.data;
}

/**
 * Get job results
 */
export async function getJobResults(jobId: string): Promise<JobResults> {
  const response = await apiClient.get(`/api/jobs/${jobId}/results`);
  return response.data;
}

/**
 * Get SSE event source URL
 */
export function getJobEventsUrl(jobId: string): string {
  // Add ngrok-skip-browser-warning as query param since EventSource doesn't support custom headers
  const url = new URL(`${API_URL}/api/jobs/${jobId}/events`);
  url.searchParams.set('ngrok-skip-browser-warning', 'true');
  return url.toString();
}

/**
 * Parse location string into city, state
 */
export function parseLocation(location: string): { city: string; state: string; zipCode?: string } {
  // Expected format: "City, ST" or "City, ST 12345"
  const parts = location.split(',').map(s => s.trim());

  if (parts.length >= 2) {
    const city = parts[0];
    const stateAndZip = parts[1].split(' ').map(s => s.trim());
    const state = stateAndZip[0];
    const zipCode = stateAndZip.length > 1 ? stateAndZip[1] : undefined;

    return { city, state, zipCode };
  }

  // Fallback
  return { city: location, state: 'CA' };
}

export default apiClient;
