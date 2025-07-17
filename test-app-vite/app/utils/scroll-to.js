export function scrollToElement(element) {
  if (!element) return;

  const offset = 80; // Account for fixed header
  const elementPosition = element.offsetTop;
  const offsetPosition = elementPosition - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
}
