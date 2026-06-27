/**
 * Values for the Customer Login Form.
 */
export interface UserLoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

/**
 * Values for the Customer Registration Form.
 */
export interface UserRegistrationFormValues {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
  acceptedMarketing?: boolean;
}

/**
 * Values for the Customer Forgot Password Form.
 */
export interface ForgotPasswordFormValues {
  email: string;
}

/**
 * Values for the Customer Reset Password Form.
 */
export interface ResetPasswordFormValues {
  password: string;
  confirmPassword: string;
}

/**
 * Interface representing overall Customer Authentication form state.
 */
export interface UserAuthFormState<T> {
  values: T;
  isSubmitting: boolean;
  submitStatus: "idle" | "success" | "error";
  errorMessage?: string;
}
