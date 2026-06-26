import { HostLoginFormValues, HostRegistrationFormValues } from "../../types/host-auth.types";

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
 * Validates Host Login Form inputs.
 */
export function validateLoginForm(values: HostLoginFormValues): {
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
 * Validates Host Registration Step 1 (Account Details).
 */
export function validateRegisterStep1(values: Pick<HostRegistrationFormValues, "email" | "password" | "confirmPassword">): {
  email?: string;
  password?: string;
  confirmPassword?: string;
} {
  const errors: { email?: string; password?: string; confirmPassword?: string } = {};

  if (!values.email.trim()) {
    errors.email = "Email address is required";
  } else if (!isValidEmail(values.email)) {
    errors.email = "Please enter a valid email address";
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

  return errors;
}

/**
 * Validates Host Registration Step 2 (Host Profile).
 */
export function validateRegisterStep2(values: Pick<HostRegistrationFormValues, "firstName" | "lastName" | "phone" | "city" | "country">): {
  firstName?: string;
  lastName?: string;
  phone?: string;
  city?: string;
  country?: string;
} {
  const errors: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    city?: string;
    country?: string;
  } = {};

  if (!values.firstName.trim()) {
    errors.firstName = "First name is required";
  }

  if (!values.lastName.trim()) {
    errors.lastName = "Last name is required";
  }

  if (!values.phone.trim()) {
    errors.phone = "Phone number is required";
  } else if (!isValidPhone(values.phone)) {
    errors.phone = "Please enter a valid phone number (e.g. +44 7700 900000)";
  }

  if (!values.city.trim()) {
    errors.city = "City is required";
  }

  if (!values.country.trim()) {
    errors.country = "Country is required";
  }

  return errors;
}

/**
 * Validates Host Registration Step 3 (Business Info).
 */
export function validateRegisterStep3(values: Pick<HostRegistrationFormValues, "businessName" | "contactFullName" | "businessRole" | "businessEmail" | "businessPhone">): {
  businessName?: string;
  contactFullName?: string;
  businessRole?: string;
  businessEmail?: string;
  businessPhone?: string;
} {
  const errors: {
    businessName?: string;
    contactFullName?: string;
    businessRole?: string;
    businessEmail?: string;
    businessPhone?: string;
  } = {};

  if (!values.businessName.trim()) {
    errors.businessName = "Business name is required";
  }

  if (!values.contactFullName.trim()) {
    errors.contactFullName = "Contact full name is required";
  }

  if (!values.businessRole.trim()) {
    errors.businessRole = "Job title or role is required";
  }

  if (!values.businessEmail.trim()) {
    errors.businessEmail = "Business email is required";
  } else if (!isValidEmail(values.businessEmail)) {
    errors.businessEmail = "Please enter a valid business email";
  }

  if (!values.businessPhone.trim()) {
    errors.businessPhone = "Business phone number is required";
  } else if (!isValidPhone(values.businessPhone)) {
    errors.businessPhone = "Please enter a valid phone number";
  }

  return errors;
}

/**
 * Validates Host Registration Step 4 (Logo & Branding).
 */
export function validateRegisterStep4(values: Pick<HostRegistrationFormValues, "businessBio">): {
  businessBio?: string;
} {
  const errors: { businessBio?: string } = {};

  if (!values.businessBio.trim()) {
    errors.businessBio = "Business bio is required";
  } else if (values.businessBio.trim().length < 10) {
    errors.businessBio = "Please enter a slightly longer business bio (min 10 characters)";
  }

  return errors;
}
