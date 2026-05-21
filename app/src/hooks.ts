import { useCallback, useEffect, useState } from 'react';

/**
 * Persistent state hook backed by localStorage. Drop-in replacement for
 * `useState` that survives page reloads.
 */
export function useLocalStorage<T>(
  key: string,
  initial: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initial;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw == null) return initial;
      return JSON.parse(raw) as T;
    } catch {
      return initial;
    }
  });

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved =
          typeof next === 'function' ? (next as (prev: T) => T)(prev) : next;
        try {
          window.localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          // Ignore quota / private-mode failures.
        }
        return resolved;
      });
    },
    [key],
  );

  return [value, update];
}

export type AppTheme = 'light' | 'dark';

function osThemePreference(): AppTheme {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

/**
 * App-level light/dark theme. Persists the user's choice, falling back to the
 * OS preference on first visit. Writes the resolved value to
 * `<html data-theme="…">` so CSS variables can swap together.
 */
export function useAppTheme(): [AppTheme, (next: AppTheme) => void] {
  const [theme, setTheme] = useLocalStorage<AppTheme>(
    'reltio.app.theme',
    osThemePreference(),
  );

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return [theme, setTheme];
}
