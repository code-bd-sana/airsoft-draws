/**
 * Centralized environment configuration module.
 * Provides typed access to environment variables used across the application.
 * Prevents hardcoding `process.env.NEXT_PUBLIC_*` throughout the codebase.
 */

interface EnvConfig {
  apiUrl: string;
  appUrl: string;
}

export const envConfig: EnvConfig = {
  // Use localhost:5000 as default per backend port configuration
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
};
