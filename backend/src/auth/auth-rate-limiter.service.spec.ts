import { AuthRateLimiterService } from './auth-rate-limiter.service';

describe('AuthRateLimiterService', () => {
  let service: AuthRateLimiterService;

  beforeEach(() => {
    service = new AuthRateLimiterService();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('checkLoginAttempt', () => {
    it('should allow up to 5 login attempts within 1 minute', () => {
      const key = 'user_1';

      for (let i = 1; i <= 5; i++) {
        const res = service.checkLoginAttempt(key);
        expect(res.allowed).toBe(true);
      }
    });

    it('should block the 6th attempt within 1 minute for 25 minutes', () => {
      const key = 'user_blocked';

      for (let i = 1; i <= 5; i++) {
        service.checkLoginAttempt(key);
      }

      // 6th attempt
      const sixth = service.checkLoginAttempt(key);
      expect(sixth.allowed).toBe(false);
      expect(sixth.retryAfterMinutes).toBe(25);
      expect(sixth.message).toContain('blocked for 25 minutes');

      // Still blocked after 10 minutes
      jest.advanceTimersByTime(10 * 60 * 1000);
      const after10Mins = service.checkLoginAttempt(key);
      expect(after10Mins.allowed).toBe(false);
      expect(after10Mins.retryAfterMinutes).toBe(15);

      // Unblocked after 25 minutes
      jest.advanceTimersByTime(15 * 60 * 1000 + 1000);
      const after25Mins = service.checkLoginAttempt(key);
      expect(after25Mins.allowed).toBe(true);
    });

    it('should reset login counter when resetLoginAttempt is called', () => {
      const key = 'user_reset';
      service.checkLoginAttempt(key);
      service.checkLoginAttempt(key);
      service.resetLoginAttempt(key);

      // Can make 5 fresh attempts
      for (let i = 1; i <= 5; i++) {
        const res = service.checkLoginAttempt(key);
        expect(res.allowed).toBe(true);
      }
    });
  });

  describe('checkForgotPasswordAttempt', () => {
    it('should allow up to 3 forgot-password attempts in 1 minute', () => {
      const key = 'forgot_1';

      for (let i = 1; i <= 3; i++) {
        const res = service.checkForgotPasswordAttempt(key);
        expect(res.allowed).toBe(true);
      }
    });

    it('should block the 4th forgot-password attempt within 1 minute', () => {
      const key = 'forgot_limit';

      for (let i = 1; i <= 3; i++) {
        service.checkForgotPasswordAttempt(key);
      }

      const fourth = service.checkForgotPasswordAttempt(key);
      expect(fourth.allowed).toBe(false);
      expect(fourth.message).toContain('up to 3 times per minute');

      // Allowed again after 1 minute
      jest.advanceTimersByTime(61 * 1000);
      const after1Min = service.checkForgotPasswordAttempt(key);
      expect(after1Min.allowed).toBe(true);
    });
  });
});
