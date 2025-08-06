//polling MongoDB data via the server

import useSWR from 'swr';

//! MAKE IT SO THAT ALL HOOKS FETCH AT 1 HOUR 10 MINUTES JUST LIKE THE userHourlyStatus HOOK

const fetcher = (url) =>
  fetch(`${import.meta.env.VITE_API_BASE_URL}${url}`).then((r) => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  });

export function useHourlyStatus(hours = 23) {
  return useSWR(
    ['/api/metrics/hourly-status', hours],
    ([path, hrs]) => fetcher(`${path}?hours=${hrs}`),
    { refreshInterval: 55_000 } // poll every 55s
  );
}

// const fetcher = (url) =>
//   fetch(url).then((res) => {
//     if (!res.ok) throw new Error(res.statusText);
//     return res.json();
//   });

// export function useHourlyStatus(hours = 23) {
//   const key = `/api/metrics/hourly-status?hours=${hours}`;
//   // Turn off automatic polling
//   const swr = useSWR(key, fetcher, { refreshInterval: 0 });
//   const { mutate } = swr;

//   useEffect(() => {
//     let intervalId, timeoutId;

//     const scheduleNext = () => {
//       const now = new Date();
//       // Compute next run at HH:10
//       const next = new Date(now);
//       if (now.getMinutes() >= 10) {
//         next.setHours(now.getHours() + 1);
//       }
//       next.setMinutes(10, 0, 0);
//       const delay = next.getTime() - now.getTime();

//       // Re‐fetch at the next HH:10
//       timeoutId = setTimeout(() => {
//         mutate();

//         // Then poll every 60 minutes thereafter, always at :10
//         intervalId = setInterval(() => {
//           mutate();
//         }, 60 * 60 * 1000);
//       }, delay);
//     };

//     scheduleNext();

//     return () => {
//       clearTimeout(timeoutId);
//       clearInterval(intervalId);
//     };
//   }, [mutate]);

//   return swr;
// }
