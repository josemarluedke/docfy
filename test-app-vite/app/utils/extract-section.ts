/**
 * Configuration for extracting section from URL
 */
export interface SectionExtractionConfig {
  /**
   * The base path to match (e.g., '/docs')
   * If the URL doesn't start with this path, returns undefined
   */
  basePath: string;

  /**
   * The segment index after the base path where the section is located.
   * For example, if basePath is '/docs' and URL is '/docs/core/page':
   * - segmentIndex 0 would extract 'core'
   * - segmentIndex 1 would extract 'page'
   * @default 0
   */
  segmentIndex?: number;
}

/**
 * Extracts a section identifier from a URL path based on configuration.
 *
 * @param url - The full URL path (e.g., '/docs/core/getting-started')
 * @param config - Configuration for extraction
 * @returns The extracted section name, or undefined if not found
 *
 * @example
 * // Extract first segment after /docs
 * extractSectionFromUrl('/docs/core/getting-started', {
 *   basePath: '/docs',
 *   segmentIndex: 0
 * });
 * // Returns: 'core'
 *
 * @example
 * // Extract second segment after /docs
 * extractSectionFromUrl('/docs/v2/core/page', {
 *   basePath: '/docs',
 *   segmentIndex: 1
 * });
 * // Returns: 'core'
 */
export function extractSectionFromUrl(
  url: string,
  config: SectionExtractionConfig
): string | undefined {
  const { basePath, segmentIndex = 0 } = config;

  // Normalize paths by removing trailing slashes
  const normalizedUrl = url.replace(/\/$/, '');
  const normalizedBasePath = basePath.replace(/\/$/, '');

  // Check if URL starts with base path
  if (!normalizedUrl.startsWith(normalizedBasePath)) {
    return undefined;
  }

  // Remove base path and split into segments
  const remainingPath = normalizedUrl.slice(normalizedBasePath.length);
  const segments = remainingPath.split('/').filter((segment) => segment !== '');

  // Get the segment at the specified index
  const section = segments[segmentIndex];

  return section;
}
