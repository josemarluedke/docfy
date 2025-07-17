/**
 * Convert a string to PascalCase
 */
export function toPascalCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9]/g, ' ')
    .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
    .replace(/\s+/g, '');
}

/**
 * Convert a string to dash-case
 */
export function toDashCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9]/g, '-')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
}

/**
 * Convert a string to camelCase
 */
export function toCamelCase(str: string): string {
  const pascalCase = toPascalCase(str);
  return pascalCase.charAt(0).toLowerCase() + pascalCase.slice(1);
}

/**
 * Ensure a directory path exists
 */
export function ensureDirectoryPath(filePath: string): string {
  const parts = filePath.split('/');
  parts.pop(); // Remove filename
  return parts.join('/');
}

/**
 * Sanitize a filename for use in file system
 */
export function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9.-]/g, '_');
}

/**
 * Extract file extension from a path
 */
export function getFileExtension(filePath: string): string {
  const match = filePath.match(/\.([^.]+)$/);
  return match ? match[1] : '';
}

/**
 * Generate a unique component name from a file path
 */
export function generateComponentName(filePath: string): string {
  const basename = filePath.split('/').pop() || '';
  const nameWithoutExt = basename.replace(/\.[^.]+$/, '');
  return toPascalCase(nameWithoutExt);
}