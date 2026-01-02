export const scrollToAnchorId = (id: string): boolean => {
  if (typeof window === 'undefined') return false;

  const target = document.getElementById(id);
  if (!target) return false;

  const header = document.querySelector('[data-anchor-header]') ?? document.querySelector('nav');
  const headerHeight = header instanceof HTMLElement ? header.getBoundingClientRect().height : 0;
  const contentAnchor = target.querySelector('[data-anchor-content]');
  const anchorTarget = (contentAnchor as HTMLElement) ?? target;
  const rect = anchorTarget.getBoundingClientRect();
  const elementTopAbsolute = rect.top + window.scrollY;
  const elementHeight = rect.height;
  const availableHeight = window.innerHeight - headerHeight - 24;

  let top = elementTopAbsolute - headerHeight - 12;
  if (elementHeight <= availableHeight) {
    top = elementTopAbsolute - headerHeight - (availableHeight - elementHeight) / 2;
  }

  window.scrollTo({ top, behavior: 'smooth' });
  return true;
};
