import { Content } from './types';

export default function routeMap(content: Content[], prefix = ''): string[] {
  const routes: string[] = [];

  // intro, bla, category: [bla, bla], package: [bla, bla, category]

  content.forEach((item) => {
    if (item.metadata.routePath) {
      routes.push(prefix + item.metadata.routePath);
    }
  });

  return routes;
}
