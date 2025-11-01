/**
 * Environment variables utilities
 * Safely access environment variables on both client and server
 */

/**
 * Safely get environment variable
 */
const safeGetEnv = (key: string, defaultValue: string = ''): string => {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key] as string;
  }
  return defaultValue;
};

/**
 * Environment variables
 * Using getter pattern to avoid immediate evaluation
 */
export const ENV = {
  get API_URL(): string {
    return safeGetEnv('NEXT_PUBLIC_API_URL', 'http://localhost:8000');
  },
  get DOCS_BASE_URL(): string {
    return safeGetEnv('NEXT_PUBLIC_DOCS_BASE_URL', '/docs');
  },
  get NODE_ENV(): string {
    return safeGetEnv('NODE_ENV', 'development');
  },
};

/**
 * Get environment variable value with fallback
 * Works on both client and server side
 */
export const getEnvVar = (key: string, defaultValue: string = ''): string => {
  return safeGetEnv(key, defaultValue);
};

/**
 * Check if we're in production environment
 */
export const isProduction = (): boolean => {
  return ENV.NODE_ENV === 'production';
};

/**
 * Check if we're in development environment
 */
export const isDevelopment = (): boolean => {
  return ENV.NODE_ENV === 'development';
};
