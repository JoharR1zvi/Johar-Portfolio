import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

/**
 * True once the component has hydrated on the client. Useful for reading
 * browser-only state (e.g. next-themes' resolved theme) without a
 * server/client markup mismatch.
 */
export function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
