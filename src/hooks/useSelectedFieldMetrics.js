// POLLING MONGODB DATA FOR HOURLY STATUS VIA THE SERVER

//What's happening is:
// The frontend is polling /api/metrics/~route~.
// Express receives that request and runs your getHourlyStatus controller.
// Inside that controller you do a Sensor. find() and SensorReading. find(), which hits MongoDB.
// Once the data is fetched from Mongo, Express sends it back to be rendered in the frontend.
// The frontend then uses SWR to cache that data and revalidate it every hour and ~15 minutes

import useSWR from 'swr';

const fetcher = (url) =>
  fetch(`${import.meta.env.VITE_API_BASE_URL}${url}`).then((r) => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  });

// Function to re-align to the ingestion cadence. If you focus at 10:07, the next timer will be ~8 min (to 10:10 + 5 buffer);
// if you focus at 10:12, it’ll be ~63 min (next hour’s 10:10 + buffer).
function msUntilNextIngest(bufferMin = 3) {
  const now = new Date();
  const next = new Date(now);
  next.setSeconds(0, 0);

  // next HH:10
  if (now.getMinutes() >= 10) next.setHours(now.getHours() + 1, 10, 0, 0);
  else next.setMinutes(10, 0, 0);

  const ms = next.getTime() - now.getTime() + bufferMin * 60_000;
  // minimum 1 minute so SWR still revalidates occasionally if clock skew happens
  return Math.max(ms, 60_000);
}
//If you ever decide you don’t want passive background updates, set refreshInterval: 0 and keep revalidateOnFocus: true.
// That’s the lowest-impact mode (refresh only when users look at the tab) and still feels “live” enough for the dashboard.

//--------------------------------------------------------------------------
// HOOK to get the hourly status of all sensor heads over the past N hours (default 23 to cover today)
export function useHourlyStatus(hours = 23) {
  return useSWR(['/api/metrics/hourly-status', hours], ([path, hrs]) => fetcher(`${path}?hours=${hrs}`), {
    refreshInterval: () => msUntilNextIngest(5) // align to HH:10 + 5m buffer
  });
}
//--------------------------------------------------------------------------
//
//
//
//--------------------------------------------------------------------------
// HOOK to get the weekly summary status of all sensor heads for the current week (Sun-Sat)
export function useWeeklyStatus(tz = 'America/Chicago') {
  const url = `/api/metrics/weekly-status?tz=${encodeURIComponent(tz)}`;

  const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
    refreshInterval: () => msUntilNextIngest(5),
    revalidateOnFocus: true,
    dedupingInterval: 10_000
  });

  return {
    rows: data?.rows ?? [],
    meta: data?.meta,
    error,
    isLoading,
    mutate
  };
}

//--------------------------------------------------------------------------
