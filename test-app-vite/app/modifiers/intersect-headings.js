import { modifier } from 'ember-modifier';

function getHeadingIds(headings, output = []) {
  if (typeof headings === 'undefined') {
    return [];
  }
  headings.forEach((heading) => {
    output.push(heading.id);
    getHeadingIds(heading.headings, output);
  });
  return output;
}

export default modifier((element, [callback], { headings = [] }) => {
  const headingIds = getHeadingIds(headings);

  if (!headingIds.length) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const headingId = entry.target.id;
          if (headingIds.includes(headingId)) {
            callback(headingId);
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
  headingIds.forEach((headingId) => {
    const element = document.getElementById(headingId);
    if (element) {
      observer.observe(element);
    }
  });

  return () => {
    observer.disconnect();
  };
});
