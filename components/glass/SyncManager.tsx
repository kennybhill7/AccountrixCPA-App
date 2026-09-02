"use client";

/**
 * SyncManager — mounted once globally. When sync is enabled (a sync id exists),
 * it pulls newer cloud state on load and when the app regains focus, and pushes
 * local changes on a short interval and when the app is backgrounded (leaving
 * the device). If a newer snapshot is pulled, it reloads so all stores rehydrate.
 */

import { useEffect, useRef } from "react";
import { getSyncId, pull, push } from "@/lib/sync";

export function SyncManager() {
  const busy = useRef(false);

  useEffect(() => {
    if (!getSyncId()) return;
    let cancelled = false;

    const doPull = async () => {
      if (busy.current) return;
      busy.current = true;
      try {
        const r = await pull();
        if (!cancelled && r === "applied") window.location.reload();
      } finally {
        busy.current = false;
      }
    };
    const doPush = async () => {
      if (busy.current) return;
      busy.current = true;
      try {
        await push(Date.now());
      } finally {
        busy.current = false;
      }
    };

    doPull(); // pull latest on open
    const interval = setInterval(doPush, 15_000);
    const onVis = () => {
      if (document.visibilityState === "hidden") void doPush(); // leaving the device
      else void doPull(); // came back — get newest
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelled = true;
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return null;
}
