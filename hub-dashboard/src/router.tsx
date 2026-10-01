import { useEffect, useState, type ComponentProps, type MouseEvent } from 'react';

/**
 * Minimal path router. Pages are top-level and parameterless, so the History
 * API covers it; `navigate` re-uses the `popstate` event as its change
 * notification, which is what `usePath` already listens to.
 */
export function usePath() {
  const [path, setPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const sync = () => setPath(window.location.pathname);
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, []);

  return path;
}

export function navigate(to: string, { replace = false } = {}) {
  if (to === window.location.pathname) return;
  window.history[replace ? 'replaceState' : 'pushState']({}, '', to);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export function Link({ to, onClick, ...rest }: { to: string } & ComponentProps<'a'>) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    // Leave modified clicks alone so "open in new tab" still works.
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey) return;
    event.preventDefault();
    navigate(to);
  }

  return <a href={to} onClick={handleClick} {...rest} />;
}
