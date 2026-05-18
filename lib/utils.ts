export function scrollToAccordionTarget(
  targetEl: HTMLElement,
  navbarEl: HTMLElement
) {
  if (!targetEl || !navbarEl) return;
  const navH = navbarEl ? navbarEl.offsetHeight : 0;
  const viewportOffset = window.innerWidth <= 768 ? 88 : 64;
  const desiredOffset = Math.max(
    navH + viewportOffset,
    Math.round(window.innerHeight * 0.18)
  );
  const targetTop = targetEl.getBoundingClientRect().top + window.scrollY;
  const nextTop = Math.max(0, targetTop - desiredOffset);

  window.scrollTo({ top: nextTop, behavior: "smooth" });
  // Avoid persistent browser focus ring when deep-link opens an accordion.
  setTimeout(() => {
    targetEl.blur?.();
  }, 50);
}

export function parseAccordionHash(hash: string): number | null {
  const m = hash.match(/^#acc-(?:trigger|panel)-(\d+)$/);
  if (!m) return null;
  const n = Number(m[1]);
  return Number.isFinite(n) && n >= 1 ? n : null;
}
