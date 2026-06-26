/**
 * Values for the Host Login Form.
 */
export interface HostLoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

/**
 * Values for the multi-step Host Registration Onboarding Form.
 */
export interface HostRegistrationFormValues {
  // Step 1: Account Details
  email: string;
  password: string;
  confirmPassword: string;

  // Step 2: Host Profile
  hostType: "individual" | "business";
  profilePhoto: string | null; // Data URL or filename placeholder
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  country: string;
  bio: string;

  // Step 3: Business Information
  businessName: string;
  contactFullName: string;
  businessRole: string;
  businessEmail: string;
  businessPhone: string;
  vatNumber: string;

  // Step 4: Logo & Branding
  businessLogo: string | null; // Data URL or filename placeholder
  businessBio: string;

  // Step 8: Ready to Go Live
  acceptedTerms: boolean;
}

/**
 * Status of Host Registration onboarding steps.
 */
export type HostRegistrationStep = 1 | 2 | 3 | 4 | 8;

/**
 * Interface representing overall Host Authentication form state.
 */
export interface HostAuthFormState<T> {
  values: T;
  isSubmitting: boolean;
  submitStatus: "idle" | "success" | "error";
  errorMessage?: string;
}
