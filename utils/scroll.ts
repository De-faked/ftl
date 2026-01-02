type ScrollBehaviorOption = ScrollBehavior | undefined;

const getHeaderHeight = () => {
  const header = document.querySelector<HTMLElement>('[data-site-header="true"]');
  return header ? header.getBoundingClientRect().height : 0;
};

export const scrollToAnchor = (target: string, behavior: ScrollBehaviorOption = 'smooth') => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false;
  const selector = target.startsWith('#') ? target : `#${target}`;
  const element = document.querySelector<HTMLElement>(selector);
  if (!element) return false;

  const headerHeight = getHeaderHeight();
  const elementTop = element.getBoundingClientRect().top + window.scrollY;
  const top = Math.max(0, elementTop - headerHeight - 8);
  window.scrollTo({ top, behavior });
  return true;
};

export const getReducedMotionBehavior = () => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return 'smooth';
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
};
