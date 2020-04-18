import { Page } from './types';

export default function routeMap(content: Page[], prefix = ''): string[] {
  const routes: string[] = [];

  // intro, bla, category: [bla, bla], package: [bla, bla, category]

  content.forEach((item) => {
    if (item.metadata.url) {
      routes.push(prefix + item.metadata.url);
    }
  });

  return routes;
}
