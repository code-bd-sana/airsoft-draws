import { Injectable } from '@nestjs/common';

interface RateLimitRecord {
  count: number;
  firstAttemptAt: number;
  blockedUntil?: number;
}

@Injectable()
export class AuthRateLimiterService {
  private loginAttempts = new Map<string, RateLimitRecord>();
  private forgotPasswordAttempts = new Map<string, RateLimitRecord>();

  /**
   * Check and record login attempt.
   * Rule:
   * - Maximum 5 attempts within 1 minute (60,000 ms).
   * - If exceeded (more than 5 attempts), blocked for 25 minutes (1,500,000 ms).
   *
   * @param identifier IP or user email/composite key
   * @returns { allowed: boolean; retryAfterMinutes?: number; message?: string }
   */
  checkLoginAttempt(identifier: string): {
    allowed: boolean;
    retryAfterMinutes?: number;
    message?: string;
  } {
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const blockDurationMs = 25 * 60 * 1000; // 25 minutes
    const maxAttempts = 5;

    const record = this.loginAttempts.get(identifier);

    if (record) {
      // 1. Check if currently blocked
      if (record.blockedUntil && record.blockedUntil > now) {
        const remainingMinutes = Math.ceil((record.blockedUntil - now) / (60 * 1000));
        return {
          allowed: false,
          retryAfterMinutes: remainingMinutes,
          message: `Too many login attempts. Your access is temporarily blocked for ${remainingMinutes} minute(s). Please try again later.`,
        };
      }

      // If previous block expired, reset record
      if (record.blockedUntil && record.blockedUntil <= now) {
        this.loginAttempts.set(identifier, {
          count: 1,
          firstAttemptAt: now,
        });
        return { allowed: true };
      }

      // 2. Check if within 1 minute window
      if (now - record.firstAttemptAt < windowMs) {
        record.count += 1;
        if (record.count > maxAttempts) {
          record.blockedUntil = now + blockDurationMs;
          const remainingMinutes = 25;
          return {
            allowed: false,
            retryAfterMinutes: remainingMinutes,
            message: `Too many login attempts (maximum ${maxAttempts} attempts per minute). Your access is blocked for 25 minutes. Please try again later.`,
          };
        }
        return { allowed: true };
      }

      // 3. Window expired, reset window counter
      this.loginAttempts.set(identifier, {
        count: 1,
        firstAttemptAt: now,
      });
      return { allowed: true };
    }

    // First attempt
    this.loginAttempts.set(identifier, {
      count: 1,
      firstAttemptAt: now,
    });
    return { allowed: true };
  }

  /**
   * Reset login attempts upon a successful login.
   */
  resetLoginAttempt(identifier: string): void {
    this.loginAttempts.delete(identifier);
  }

  /**
   * Check and record forgot-password attempt.
   * Rule:
   * - Maximum 3 requests within 1 minute (60,000 ms).
   *
   * @param identifier IP or target email
   * @returns { allowed: boolean; retryAfterSeconds?: number; message?: string }
   */
  checkForgotPasswordAttempt(identifier: string): {
    allowed: boolean;
    retryAfterSeconds?: number;
    message?: string;
  } {
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const maxAttempts = 3;

    const record = this.forgotPasswordAttempts.get(identifier);

    if (record) {
      // Check if within 1 minute window
      if (now - record.firstAttemptAt < windowMs) {
        record.count += 1;
        if (record.count > maxAttempts) {
          const remainingSeconds = Math.ceil((record.firstAttemptAt + windowMs - now) / 1000);
          return {
            allowed: false,
            retryAfterSeconds: remainingSeconds > 0 ? remainingSeconds : 1,
            message: `Too many password reset requests. You can only request up to ${maxAttempts} times per minute. Please try again in ${remainingSeconds} second(s).`,
          };
        }
        return { allowed: true };
      }

      // Window expired, reset window counter
      this.forgotPasswordAttempts.set(identifier, {
        count: 1,
        firstAttemptAt: now,
      });
      return { allowed: true };
    }

    // First attempt
    this.forgotPasswordAttempts.set(identifier, {
      count: 1,
      firstAttemptAt: now,
    });
    return { allowed: true };
  }
}
