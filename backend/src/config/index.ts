import * as dotenv from 'dotenv';

// Pre-load the environment variables before initializing the config object
dotenv.config();

export interface AppConfig {
  database: {
    url: string;
  };
  security: {
    jwtSecret: string;
    rateLimit: {
      ttl: number; // Time-to-live in seconds
      limit: number; // Max number of requests per TTL
    };
  };
  server: {
    port: number;
    environment: string;
  };
  mail: {
    host: string;
    port: number;
    user: string;
    pass: string;
    from: string;
  };
  frontend: {
    url: string;
  };
}

/**
 * Global Configuration Object.
 *
 * Provides strict TypeScript typings and autocomplete anywhere in the backend codebase.
 * Simply type `config.` to see the available options.
 */
export const config: AppConfig = {
  database: {
    url:
      process.env.DATABASE_URL ||
      'postgresql://postgres:password@localhost:5432/airsoft_draws?schema=public',
  },
  security: {
    jwtSecret: process.env.JWT_SECRET || 'super-secret-default',
    rateLimit: {
      ttl: Number(process.env.RATE_LIMIT_TTL) || 60,
      limit: Number(process.env.RATE_LIMIT_LIMIT) || 100,
    },
  },
  server: {
    port: Number(process.env.PORT) || 3001,
    environment: process.env.NODE_ENV || 'development',
  },
  mail: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASSWORD || '',
    from: process.env.FROM_EMAIL || 'Airsoft Draws <noreply@airsoftdraws.com>',
  },
  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:3000',
  },
};
