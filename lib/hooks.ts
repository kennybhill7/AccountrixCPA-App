import { useEffect, useState } from 'react';
import { useAppStore } from './store';

let isHydrated = false;

export function useHydratedStore() {
  const [hydrated, setHydrated] = useState(isHydrated);

  useEffect(() => {
    if (!isHydrated) {
      // Trigger hydration only once globally
      useAppStore.persist.rehydrate();
      isHydrated = true;
    }
    setHydrated(true);
  }, []);

  return hydrated;
}