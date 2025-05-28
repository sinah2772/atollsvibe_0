
/**
 * Gets the base URL path from Vite's environment configuration
 * @returns The base URL path configured for the application
 */
export const getBasePath = (): string => {
  return import.meta.env.BASE_URL || '/atollsvibe/';
};

/**
 * Creates a URL with the correct base path
 * @param path The path to append to the base path
 * @returns The full URL with base path included
 */
export const createUrl = (path: string): string => {
  const basePath = getBasePath();
  // Ensure we don't double slash
  const normalizedPath = path.startsWith('/') ? path.substring(1) : path;
  return `${basePath}${normalizedPath}`;
};
