import { UserLoginFormValues, UserRegistrationFormValues, ForgotPasswordFormValues, ResetPasswordFormValues } from "../../types/user-auth.types";

/**
 * Validates email format.
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates phone number format (simple check for numeric/plus/spaces/dashes).
 */
export function isValidPhone(phone: string): boolean {
  if (!phone) return false;
  const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;
  return phoneRegex.test(phone);
}

/**
 * Measures password strength and returns a score from 0 to 4.
 * Criteria:
 * - Length >= 8 chars
 * - Contains uppercase letter
 * - Contains lowercase letter
 * - Contains number or special character
 */
export function getPasswordStrength(password: string): number {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

/**
 * Validates User Login Form inputs.
 */
export function validateLoginForm(values: UserLoginFormValues): {
  email?: string;
  password?: string;
} {
  const errors: { email?: string; password?: string } = {};

  if (!values.email.trim()) {
    errors.email = "Email address is required";
  } else if (!isValidEmail(values.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!values.password) {
    errors.password = "Password is required";
  }

  return errors;
}

/**
 * Validates User Registration Form.
 */
export function validateRegisterForm(values: UserRegistrationFormValues): {
  fullName?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  acceptedTerms?: string;
} {
  const errors: {
    fullName?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
    acceptedTerms?: string;
  } = {};

  if (!values.fullName.trim()) {
    errors.fullName = "Full name is required";
  }

  if (!values.email.trim()) {
    errors.email = "Email address is required";
  } else if (!isValidEmail(values.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (values.phone && !isValidPhone(values.phone)) {
    errors.phone = "Please enter a valid phone number";
  }

  if (!values.password) {
    errors.password = "Password is required";
  } else if (values.password.length < 8) {
    errors.password = "Password must be at least 8 characters long";
  } else {
    const strength = getPasswordStrength(values.password);
    if (strength < 3) {
      errors.password = "Please use a stronger password (include uppercase, lowercase, numbers/symbols)";
    }
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Please confirm your password";
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  if (!values.acceptedTerms) {
    errors.acceptedTerms = "You must accept the Terms and Conditions to register";
  }

  return errors;
}

/**
 * Validates Forgot Password Form.
 */
export function validateForgotPasswordForm(values: ForgotPasswordFormValues): {
  email?: string;
} {
  const errors: { email?: string } = {};

  if (!values.email.trim()) {
    errors.email = "Email address is required";
  } else if (!isValidEmail(values.email)) {
    errors.email = "Please enter a valid email address";
  }

  return errors;
}

/**
 * Validates Reset Password Form.
 */
export function validateResetPasswordForm(values: ResetPasswordFormValues): {
  password?: string;
  confirmPassword?: string;
} {
  const errors: { password?: string; confirmPassword?: string } = {};

  if (!values.password) {
    errors.password = "Password is required";
  } else if (values.password.length < 8) {
    errors.password = "Password must be at least 8 characters long";
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Please confirm your password";
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
}
