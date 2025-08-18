//GLOBAL ERROR TOAST (window + SWR)

// This component catches global errors and API errors, displaying them using Notistack toast.
// It also sets sensible defaults for SWR (stale-while-revalidate) configuration.
import { useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { SWRConfig } from 'swr';

export default function GlobalErrorCatcher({ children }) {
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const onError = (e) => {
      const msg = e?.reason?.message || e?.message || 'Unknown error';
      enqueueSnackbar(`Unhandled error: ${msg}`, { variant: 'error' });
    };
    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onError);
    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onError);
    };
  }, [enqueueSnackbar]);

  return (
    <SWRConfig
      value={{
        onError: (err, key) => {
          enqueueSnackbar(`API error on ${Array.isArray(key) ? key[0] : key}: ${err.message}`, {
            variant: 'error'
          });
        },
        // sensible defaults shared app-wide
        revalidateOnFocus: true, //instant refresh when the user returns.
        focusThrottleInterval: 10_000, // throttle focus revalidations
        dedupingInterval: 5 * 60_000, // prevents duplicate fetches across components/focus/intervals.
        errorRetryInterval: 30_000,
        errorRetryCount: 5
      }}
    >
      {children}
    </SWRConfig>
  );
}
