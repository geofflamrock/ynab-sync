import { useNavigate } from "@remix-run/react";
import { useCallback, useEffect } from "react";

function useRefresh() {
  // We get the navigate function from React Rotuer
  let navigate = useNavigate();
  // And return a function which will navigate to `.` (same URL) and replace it
  return useCallback(
    function revalidate() {
      navigate(".", { replace: true });
    },
    [navigate]
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
    [revalidate]
  );
}
