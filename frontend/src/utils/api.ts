import { getUserId } from "./userId";

const BASE_URL = 'http://localhost:8080';

export async function apiRequest(endpoint: string, options?: RequestInit) {
  const url = `${BASE_URL}${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    'X-User-Id': getUserId(),
    ...options?.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}