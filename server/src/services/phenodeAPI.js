// src/services/phenodeAPI.js
import axios from 'axios';
import env from '../config/env.js';
import { getBearerToken } from './keycloak.js';

const api = axios.create({
  baseURL: env.phenodeApiBaseUrl,
  timeout: 30_000 // 30 s instead of 10 s
});

// simple retry helper
async function withRetry(fn, attempts = 3) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (i < attempts - 1) {
        const wait = 1000 * 2 ** i; // 1 s, 2 s, 4 s
        await new Promise((r) => setTimeout(r, wait));
      }
    }
  }
  throw lastErr;
}

export async function getSensorList() {
  const token = await getBearerToken();
  return withRetry(async () => {
    const res = await api.get('/wireless-sensors/my-sensors-detailed', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data.sensors;
  });
}
