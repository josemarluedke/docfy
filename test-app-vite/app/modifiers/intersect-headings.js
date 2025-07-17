import { modifier } from 'ember-modifier';

export default modifier((element, [callback, options = {}]) => {
  const { headings = [] } = options;

  if (!headings.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const heading = headings.find(h => h.id === entry.target.id);
          if (heading) {
            callback(heading.id);
          }
        }
      });
    },
    {
      rootMargin: '-80px 0px -80% 0px',
      threshold: 0
    }
  );

  // Observe all headings
  headings.forEach((heading) => {
    const element = document.getElementById(heading.id);
    if (element) {
      observer.observe(element);
    }
  });

  return () => {
    observer.disconnect();
  };
});
