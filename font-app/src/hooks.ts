import { useCallback, useEffect, useState } from 'react';

/* ─── Local Font Access API ─────────────────────────────────────────────── */

/**
 * Module-level cache of locally-installed font family names. Populated by the
 * first successful `loadLocalFonts()` call; subsequent calls return the
 * cached list synchronously so every `FontFamilyPicker` shares the result.
 *
 * The Local Font Access API (`window.queryLocalFonts`) is supported in
 * Chromium-based browsers (Chrome 103+, Edge, Opera) but NOT in Firefox /
 * Safari. Hooks fall back gracefully — see `supported` on the return shape.
 */
let LOCAL_FONTS_CACHE: string[] | null = null;
let LOCAL_FONTS_LOADING = false;
let LOCAL_FONTS_ERROR: string | null = null;
const localFontListeners = new Set<() => void>();

function notifyLocalFontListeners(): void {
  for (const fn of localFontListeners) fn();
}

/** True when the browser exposes `window.queryLocalFonts`. */
export function localFontsSupported(): boolean {
  return typeof window !== 'undefined' && 'queryLocalFonts' in window;
}

/**
 * Trigger a one-time permission prompt and load every locally-installed
 * font's family name (deduplicated, sorted). Resolves to the cached list on
 * subsequent calls so the prompt only ever appears once per session.
 *
 * Must be called from a user gesture (button click) — browsers refuse the
 * permission prompt otherwise.
 */
export async function loadLocalFonts(): Promise<string[]> {
  if (LOCAL_FONTS_CACHE) return LOCAL_FONTS_CACHE;
  if (!localFontsSupported()) {
    LOCAL_FONTS_ERROR = 'Browser does not support the Local Font Access API.';
    notifyLocalFontListeners();
    throw new Error(LOCAL_FONTS_ERROR);
  }
  LOCAL_FONTS_LOADING = true;
  LOCAL_FONTS_ERROR = null;
  notifyLocalFontListeners();
  try {
    // The DOM lib doesn't ship a type for queryLocalFonts yet (proposed
    // standard) — we cast through unknown to keep TypeScript happy.
    const queryLocalFonts = (window as unknown as {
      queryLocalFonts: () => Promise<Array<{ family: string }>>;
    }).queryLocalFonts;
    const fonts = await queryLocalFonts();
    const families = Array.from(new Set(fonts.map((f) => f.family))).sort((a, b) =>
      a.localeCompare(b),
    );
    LOCAL_FONTS_CACHE = families;
    LOCAL_FONTS_LOADING = false;
    notifyLocalFontListeners();
    return families;
  } catch (e) {
    LOCAL_FONTS_ERROR = (e as Error).message || 'Failed to load local fonts.';
    LOCAL_FONTS_LOADING = false;
    notifyLocalFontListeners();
    throw e;
  }
}

export type LocalFontsState = {
  fonts: string[] | null;
  loading: boolean;
  error: string | null;
  supported: boolean;
  load: () => Promise<string[]>;
};

/**
 * One-time check: if the user previously granted `local-fonts` permission,
 * silently populate the cache so returning sessions don't need a click.
 * Browsers reject `queryLocalFonts()` without a user gesture unless the
 * permission is already `granted` — so this only ever resolves quietly.
 */
let AUTO_LOAD_ATTEMPTED = false;
function tryAutoLoadLocalFonts(): void {
  if (AUTO_LOAD_ATTEMPTED || LOCAL_FONTS_CACHE) return;
  if (!localFontsSupported()) return;
  if (typeof navigator === 'undefined' || !('permissions' in navigator)) return;
  AUTO_LOAD_ATTEMPTED = true;
  navigator.permissions
    // `local-fonts` isn't in lib.dom yet; cast through unknown for TS.
    .query({ name: 'local-fonts' as unknown as PermissionName })
    .then((status) => {
      if (status.state === 'granted') {
        loadLocalFonts().catch(() => {
          /* error already stored in LOCAL_FONTS_ERROR */
        });
      }
    })
    .catch(() => {
      /* unsupported permission name on this browser — ignore */
    });
}

/**
 * Subscribe to the module-level local-fonts state. Components re-render
 * automatically when the cache or loading flag changes.
 *
 * On first mount we silently attempt to read the cache if permission was
 * previously granted — so a returning user immediately sees their installed
 * fonts without clicking "Load all".
 */
export function useLocalFonts(): LocalFontsState {
  const [, force] = useState(0);
  useEffect(() => {
    const listener = () => force((n) => n + 1);
    localFontListeners.add(listener);
    tryAutoLoadLocalFonts();
    return () => {
      localFontListeners.delete(listener);
    };
  }, []);
  return {
    fonts: LOCAL_FONTS_CACHE,
    loading: LOCAL_FONTS_LOADING,
    error: LOCAL_FONTS_ERROR,
    supported: localFontsSupported(),
    load: loadLocalFonts,
  };
}



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
