import { useLocation, useNavigate } from "@remix-run/react";
import { useCallback, useEffect } from "react";

function useRefresh() {
  // We get the navigate function from React Rotuer
  const navigate = useNavigate();
  const location = useLocation();

  // And return a function which will navigate to `.` (same URL) and replace it
  return useCallback(
    function revalidate() {
      navigate(location, { replace: true });
    },
    [navigate, location]
  );
}
interface Options {
  enabled?: boolean;
  interval?: number;
}
export function useRefreshOnInterval({
  enabled = false,
  interval = 1000,
}: Options) {
  let revalidate = useRefresh();
  useEffect(
    function revalidateOnInterval() {
      if (!enabled) return;
      let intervalId = setInterval(revalidate, interval);
      return () => clearInterval(intervalId);
    },
    [revalidate, enabled, interval]
  );
}
