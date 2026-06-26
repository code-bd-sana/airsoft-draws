"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { HostRegistrationFormValues, HostRegistrationStep, HostAuthFormState } from "../../types/host-auth.types";
import {
  validateRegisterStep1,
  validateRegisterStep2,
  validateRegisterStep3,
  validateRegisterStep4,
  getPasswordStrength
} from "../../lib/validations/host-auth.validation";
import PrimaryButton from "../website/shared/PrimaryButton";
import AuthSuccessState from "./AuthSuccessState";
import { cn } from "../../lib/utils";

interface HostRegistrationFormProps {
  step: HostRegistrationStep;
  onChangeStep: (step: HostRegistrationStep) => void;
}

export default function HostRegistrationForm({
  step,
  onChangeStep,
}: HostRegistrationFormProps) {
  const router = useRouter();
  const profilePhotoInputRef = useRef<HTMLInputElement>(null);
  const businessLogoInputRef = useRef<HTMLInputElement>(null);

  // Controlled Registration Data
  const [formData, setFormData] = useState<HostRegistrationFormValues>({
    email: "",
    password: "",
    confirmPassword: "",
    hostType: "individual",
    profilePhoto: null,
    firstName: "",
    lastName: "",
    phone: "",
    city: "",
    country: "United Kingdom",
    bio: "",
    businessName: "",
    contactFullName: "",
    businessRole: "",
    businessEmail: "",
    businessPhone: "",
    vatNumber: "",
    businessLogo: null,
    businessBio: "",
    acceptedTerms: false,
  });

  // Overall form submitting state
  const [formState, setFormState] = useState<HostAuthFormState<HostRegistrationFormValues>>({
    values: formData,
    isSubmitting: false,
    submitStatus: "idle",
  });

  // Step validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear validation error when field is updated
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  // Profile photo file selection with local uploader data URL preview
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, field: "profilePhoto" | "businessLogo") => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          [field]: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Navigating back
  const handleBack = () => {
    if (step === 2) onChangeStep(1);
    else if (step === 3) onChangeStep(2);
    else if (step === 4) onChangeStep(3);
    else if (step === 8) onChangeStep(4);
  };

  // Advancing steps with validation gates
  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      const stepErrors = validateRegisterStep1(formData);
      if (Object.keys(stepErrors).length > 0) {
        setErrors(stepErrors);
        return;
      }
      onChangeStep(2);
    } else if (step === 2) {
      const stepErrors = validateRegisterStep2(formData);
      if (Object.keys(stepErrors).length > 0) {
        setErrors(stepErrors);
        return;
      }
      onChangeStep(3);
    } else if (step === 3) {
      const stepErrors = validateRegisterStep3(formData);
      if (Object.keys(stepErrors).length > 0) {
        setErrors(stepErrors);
        return;
      }
      onChangeStep(4);
    } else if (step === 4) {
      const stepErrors = validateRegisterStep4(formData);
      if (Object.keys(stepErrors).length > 0) {
        setErrors(stepErrors);
        return;
      }
      // Skip directly to step 8 review as designed in Figma node list
      onChangeStep(8);
    } else if (step === 8) {
      if (!formData.acceptedTerms) {
        showToast("Please agree to the Host Guidelines and Platform Rules.");
        return;
      }

      setFormState((prev) => ({
        ...prev,
        isSubmitting: true,
      }));

      setTimeout(() => {
        setFormState((prev) => ({
          ...prev,
          isSubmitting: false,
          submitStatus: "success",
        }));
      }, 1500);
    }
  };

  if (formState.submitStatus === "success") {
    return (
      <AuthSuccessState
        title="Application Submitted!"
        description="Your details have been recorded. Our admin team will review your application and activate your host portal within 24 hours."
        buttonText="Return to Homepage"
        buttonHref="/"
      />
    );
  }

  // Calculate password strength rating
  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="relative w-full max-w-2xl mx-auto flex flex-col gap-6 animate-fadeIn">
      {/* Action Simulation Toast notifications */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-accent-bg border border-primary text-text-brand px-4 py-3 rounded-button shadow-card text-xs md:text-sm animate-fadeIn">
          {toastMessage}
        </div>
      )}

      {/* User vs Host Navigation Pills */}
      {step === 1 && (
        <div className="flex items-center justify-start self-start bg-surface border border-divider p-1 rounded-badge">
          <button
            type="button"
            onClick={() => showToast("User Login is coming soon!")}
            className="font-sans text-[11px] md:text-xs font-semibold text-text-muted hover:text-text-primary px-4 py-2 rounded-badge transition-colors duration-200"
          >
            User Login
          </button>
          <div className="bg-accent-bg border border-border-medium px-4 py-2 rounded-badge">
            <span className="font-sans text-[11px] md:text-xs font-semibold text-text-brand uppercase tracking-wider">
              Host Login
            </span>
          </div>
        </div>
      )}

      {/* Main Form container card */}
      <div className="bg-surface border border-divider p-6 md:p-10 rounded-card shadow-card w-full">
        <form onSubmit={handleContinue}>
          {/* STEP 1: Account Details */}
          {step === 1 && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              {/* Step Title Header */}
              <div className="flex flex-col gap-1.5 pb-2 border-b border-divider">
                <div className="flex items-center justify-between text-xs font-medium text-text-secondary">
                  <span>Step 1 of 8</span>
                  <span className="text-[11px] bg-accent-bg border border-border px-2 py-0.5 rounded-badge text-text-brand">Account Details</span>
                </div>
                <h2 className="font-heading font-semibold text-xl md:text-2xl text-text-primary mt-1">
                  Create Your Host Account
                </h2>
                <p className="font-sans text-xs md:text-sm text-text-secondary">
                  Start by setting up your login credentials. You can always update these later.
                </p>
              </div>

              {/* Email Address */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="font-sans font-medium text-xs md:text-sm text-text-primary">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={cn(
                    "w-full bg-bg border border-border rounded-button px-4 py-2.5 font-sans text-xs md:text-sm text-text-primary placeholder:text-text-muted/40 transition-all duration-200 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20",
                    errors.email && "border-red-500/80 focus:border-red-500 focus:ring-red-500/30"
                  )}
                />
                {errors.email && (
                  <span className="font-sans text-[11px] text-red-500 mt-0.5 self-start select-none animate-fadeIn">
                    {errors.email}
                  </span>
                )}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="font-sans font-medium text-xs md:text-sm text-text-primary">
                  Password
                </label>
                <div className="relative w-full">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    autoComplete="new-password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={cn(
                      "w-full bg-bg border border-border rounded-button pl-4 pr-12 py-2.5 font-sans text-xs md:text-sm text-text-primary placeholder:text-text-muted/40 transition-all duration-200 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20",
                      errors.password && "border-red-500/80 focus:border-red-500 focus:ring-red-500/30"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted/60 hover:text-text-brand p-1 cursor-pointer select-none"
                  >
                    {showPassword ? (
                      /* Eye Slash Icon */
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      /* Eye Icon */
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <span className="font-sans text-[11px] text-red-500 mt-0.5 self-start select-none animate-fadeIn">
                    {errors.password}
                  </span>
                )}

                {/* Password Strength Meter */}
                <div className="flex gap-1.5 mt-1.5 h-[4px] w-full">
                  {[1, 2, 3, 4].map((barIndex) => (
                    <div
                      key={barIndex}
                      className={cn(
                        "h-full flex-1 rounded-badge transition-all duration-300",
                        formData.password.length > 0 && barIndex <= passwordStrength
                          ? passwordStrength <= 1
                            ? "bg-red-500"
                            : passwordStrength === 2
                            ? "bg-orange-500"
                            : passwordStrength === 3
                            ? "bg-yellow-500"
                            : "bg-primary"
                          : "bg-divider"
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="confirmPassword" className="font-sans font-medium text-xs md:text-sm text-text-primary">
                  Confirm Password
                </label>
                <div className="relative w-full">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    autoComplete="new-password"
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={cn(
                      "w-full bg-bg border border-border rounded-button pl-4 pr-12 py-2.5 font-sans text-xs md:text-sm text-text-primary placeholder:text-text-muted/40 transition-all duration-200 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20",
                      errors.confirmPassword && "border-red-500/80 focus:border-red-500 focus:ring-red-500/30"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted/60 hover:text-text-brand p-1 cursor-pointer select-none"
                  >
                    {showConfirmPassword ? (
                      /* Eye Slash Icon */
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      /* Eye Icon */
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className="font-sans text-[11px] text-red-500 mt-0.5 self-start select-none animate-fadeIn">
                    {errors.confirmPassword}
                  </span>
                )}
              </div>

              {/* Encryption Banner */}
              <div className="bg-[#1a230a]/50 border border-divider p-3 rounded-button flex items-center gap-3 select-none">
                <svg className="w-5 h-5 text-text-brand flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
                <p className="font-sans text-xs text-text-secondary leading-normal">
                  Your account is protected with industry-standard encryption.
                </p>
              </div>

              {/* Bottom Nav Actions */}
              <div className="flex items-center justify-between mt-4">
                <span className="text-xs text-text-muted">
                  Already have a Host account?{" "}
                  <Link href="/host/login" className="font-semibold text-primary hover:underline">
                    Log In
                  </Link>
                </span>
                <PrimaryButton type="submit" className="font-heading font-semibold text-xs px-6 py-2.5">
                  Continue &rarr;
                </PrimaryButton>
              </div>
            </div>
          )}

          {/* STEP 2: Host Profile */}
          {step === 2 && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              {/* Step Title Header */}
              <div className="flex flex-col gap-1.5 pb-2 border-b border-divider">
                <div className="flex items-center justify-between text-xs font-medium text-text-secondary">
                  <span>Step 2 of 8</span>
                  <span className="text-[11px] bg-accent-bg border border-border px-2 py-0.5 rounded-badge text-text-brand">Host Profile</span>
                </div>
                <h2 className="font-heading font-semibold text-xl md:text-2xl text-text-primary mt-1">
                  Set Up Your Host Profile
                </h2>
                <p className="font-sans text-xs md:text-sm text-text-secondary">
                  This is how you appear to guests and in our Verified Hosts directory.
                </p>
              </div>

              {/* Host Type Selection */}
              <div className="flex flex-col gap-2">
                <label className="font-sans font-medium text-xs md:text-sm text-text-primary">
                  Host Type
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, hostType: "individual" }))}
                    className={cn(
                      "flex-1 font-sans text-xs md:text-sm font-medium py-2.5 rounded-badge border text-center transition-all duration-200 cursor-pointer",
                      formData.hostType === "individual"
                        ? "bg-accent-bg border-primary text-text-brand shadow-glow"
                        : "bg-surface border-border text-text-secondary hover:text-text-primary"
                    )}
                  >
                    Individual
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, hostType: "business" }))}
                    className={cn(
                      "flex-1 font-sans text-xs md:text-sm font-medium py-2.5 rounded-badge border text-center transition-all duration-200 cursor-pointer",
                      formData.hostType === "business"
                        ? "bg-accent-bg border-primary text-text-brand shadow-glow"
                        : "bg-surface border-border text-text-secondary hover:text-text-primary"
                    )}
                  >
                    Business / Organisation
                  </button>
                </div>
                <span className="font-sans text-[11px] text-text-secondary/70">
                  {formData.hostType === "individual"
                    ? "You are hosting as a private individual."
                    : "You are hosting as a registered business entity."}
                </span>
              </div>

              {/* Profile Photo Uploader */}
              <div className="flex flex-col gap-2">
                <label className="font-sans font-medium text-xs md:text-sm text-text-primary">
                  Profile Photo
                </label>
                <div className="flex items-center gap-5">
                  <div
                    onClick={() => profilePhotoInputRef.current?.click()}
                    className="w-20 h-20 md:w-22 md:h-22 rounded-full border-2 border-dashed border-border hover:border-primary bg-bg flex items-center justify-center cursor-pointer overflow-hidden transition-all duration-200"
                  >
                    {formData.profilePhoto ? (
                      <img
                        alt="Profile photo preview"
                        src={formData.profilePhoto}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      /* User Avatar SVG */
                      <svg className="w-8 h-8 text-text-muted/40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                      </svg>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={profilePhotoInputRef}
                    onChange={(e) => handlePhotoUpload(e, "profilePhoto")}
                    accept="image/png, image/jpeg, image/jpg"
                    className="hidden"
                  />
                  <div className="flex flex-col gap-1">
                    <p className="font-sans text-xs md:text-sm text-text-primary">
                      Upload a clear, professional photo.
                    </p>
                    <p className="font-sans text-[11px] text-text-secondary/70">
                      Square, PNG or JPG, minimum 200×200px.
                    </p>
                  </div>
                </div>
              </div>

              {/* First Name & Last Name (Grid) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="firstName" className="font-sans font-medium text-xs md:text-sm text-text-primary">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    autoComplete="given-name"
                    placeholder="Jane"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={cn(
                      "w-full bg-bg border border-border rounded-button px-4 py-2.5 font-sans text-xs md:text-sm text-text-primary placeholder:text-text-muted/40 transition-all duration-200 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20",
                      errors.firstName && "border-red-500/80 focus:border-red-500 focus:ring-red-500/30"
                    )}
                  />
                  {errors.firstName && (
                    <span className="font-sans text-[11px] text-red-500 mt-0.5 self-start select-none">
                      {errors.firstName}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="lastName" className="font-sans font-medium text-xs md:text-sm text-text-primary">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    autoComplete="family-name"
                    placeholder="Smith"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={cn(
                      "w-full bg-bg border border-border rounded-button px-4 py-2.5 font-sans text-xs md:text-sm text-text-primary placeholder:text-text-muted/40 transition-all duration-200 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20",
                      errors.lastName && "border-red-500/80 focus:border-red-500 focus:ring-red-500/30"
                    )}
                  />
                  {errors.lastName && (
                    <span className="font-sans text-[11px] text-red-500 mt-0.5 self-start select-none">
                      {errors.lastName}
                    </span>
                  )}
                </div>
              </div>

              {/* Phone Number */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="phone" className="font-sans font-medium text-xs md:text-sm text-text-primary">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  autoComplete="tel"
                  placeholder="+44 7700 900000"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={cn(
                    "w-full bg-bg border border-border rounded-button px-4 py-2.5 font-sans text-xs md:text-sm text-text-primary placeholder:text-text-muted/40 transition-all duration-200 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20",
                    errors.phone && "border-red-500/80 focus:border-red-500 focus:ring-red-500/30"
                  )}
                />
                {errors.phone && (
                  <span className="font-sans text-[11px] text-red-500 mt-0.5 self-start select-none">
                    {errors.phone}
                  </span>
                )}
                <span className="font-sans text-[11px] text-text-secondary/70">
                  Used for booking notifications and host support only.
                </span>
              </div>

              {/* City & Country (Grid) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="city" className="font-sans font-medium text-xs md:text-sm text-text-primary">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    autoComplete="address-level2"
                    placeholder="London"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={cn(
                      "w-full bg-bg border border-border rounded-button px-4 py-2.5 font-sans text-xs md:text-sm text-text-primary placeholder:text-text-muted/40 transition-all duration-200 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20",
                      errors.city && "border-red-500/80 focus:border-red-500 focus:ring-red-500/30"
                    )}
                  />
                  {errors.city && (
                    <span className="font-sans text-[11px] text-red-500 mt-0.5 self-start select-none">
                      {errors.city}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="country" className="font-sans font-medium text-xs md:text-sm text-text-primary">
                    Country
                  </label>
                  <div className="relative w-full">
                    <select
                      id="country"
                      name="country"
                      autoComplete="country-name"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full bg-bg border border-border rounded-button px-4 py-2.5 font-sans text-xs md:text-sm text-text-primary outline-none focus:border-primary transition-all duration-200 appearance-none cursor-pointer"
                    >
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Ireland">Ireland</option>
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="Germany">Germany</option>
                      <option value="France">France</option>
                    </select>
                    {/* Select Dropdown custom Arrow SVG */}
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary select-none">
                      <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Short Bio */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="bio" className="font-sans font-medium text-xs md:text-sm text-text-primary">
                    Short Bio
                  </label>
                  <span className="text-[10px] md:text-xs bg-accent-bg border border-divider px-2 py-0.5 rounded-badge text-text-secondary/70">
                    optional
                  </span>
                </div>
                <div className="relative w-full">
                  <textarea
                    id="bio"
                    name="bio"
                    maxLength={300}
                    placeholder="Tell guests a bit about yourself and your hosting experience..."
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="w-full bg-bg border border-border rounded-button px-4 py-3 h-28 font-sans text-xs md:text-sm text-text-primary placeholder:text-text-muted/40 transition-all duration-200 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 resize-none"
                  />
                  <span className="absolute bottom-2.5 right-3 font-sans text-[10px] text-text-secondary/70 select-none">
                    {formData.bio.length} / 300
                  </span>
                </div>
              </div>

              {/* Bottom Actions Row */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-divider/40">
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center gap-1.5 font-sans font-medium text-xs md:text-sm text-text-secondary hover:text-text-primary cursor-pointer select-none transition-colors duration-150"
                >
                  &larr; Back
                </button>
                <PrimaryButton type="submit" className="font-heading font-semibold text-xs px-6 py-2.5">
                  Save &amp; Continue &rarr;
                </PrimaryButton>
              </div>
            </div>
          )}

          {/* STEP 3: Business Information */}
          {step === 3 && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              {/* Step Title Header */}
              <div className="flex flex-col gap-1.5 pb-2 border-b border-divider">
                <div className="flex items-center justify-between text-xs font-medium text-text-secondary">
                  <span>Step 3 of 8</span>
                  <span className="text-[11px] bg-accent-bg border border-border px-2 py-0.5 rounded-badge text-text-brand">Business Info</span>
                </div>
                <h2 className="font-heading font-semibold text-xl md:text-2xl text-text-primary mt-1">
                  Tell Us About Your Business
                </h2>
                <p className="font-sans text-xs md:text-sm text-text-secondary">
                  This information helps us verify your business and process payouts securely.
                </p>
              </div>

              {/* Business Name */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="businessName" className="font-sans font-medium text-xs md:text-sm text-text-primary">
                  Business Name
                </label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  autoComplete="organization"
                  placeholder="e.g. Tactical Gear UK"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  className={cn(
                    "w-full bg-bg border border-border rounded-button px-4 py-2.5 font-sans text-xs md:text-sm text-text-primary placeholder:text-text-muted/40 transition-all duration-200 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20",
                    errors.businessName && "border-red-500/80 focus:border-red-500 focus:ring-red-500/30"
                  )}
                />
                {errors.businessName && (
                  <span className="font-sans text-[11px] text-red-500 mt-0.5 self-start select-none">
                    {errors.businessName}
                  </span>
                )}
              </div>

              {/* Contact Full Name & Job Role (Grid) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contactFullName" className="font-sans font-medium text-xs md:text-sm text-text-primary">
                    Contact Full Name
                  </label>
                  <input
                    type="text"
                    id="contactFullName"
                    name="contactFullName"
                    autoComplete="name"
                    placeholder="Jane Smith"
                    value={formData.contactFullName}
                    onChange={handleInputChange}
                    className={cn(
                      "w-full bg-bg border border-border rounded-button px-4 py-2.5 font-sans text-xs md:text-sm text-text-primary placeholder:text-text-muted/40 transition-all duration-200 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20",
                      errors.contactFullName && "border-red-500/80 focus:border-red-500 focus:ring-red-500/30"
                    )}
                  />
                  {errors.contactFullName && (
                    <span className="font-sans text-[11px] text-red-500 mt-0.5 self-start select-none">
                      {errors.contactFullName}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="businessRole" className="font-sans font-medium text-xs md:text-sm text-text-primary">
                    Job Title / Role
                  </label>
                  <input
                    type="text"
                    id="businessRole"
                    name="businessRole"
                    placeholder="Operations Manager"
                    value={formData.businessRole}
                    onChange={handleInputChange}
                    className={cn(
                      "w-full bg-bg border border-border rounded-button px-4 py-2.5 font-sans text-xs md:text-sm text-text-primary placeholder:text-text-muted/40 transition-all duration-200 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20",
                      errors.businessRole && "border-red-500/80 focus:border-red-500 focus:ring-red-500/30"
                    )}
                  />
                  {errors.businessRole && (
                    <span className="font-sans text-[11px] text-red-500 mt-0.5 self-start select-none">
                      {errors.businessRole}
                    </span>
                  )}
                </div>
              </div>

              {/* Business Email & Business Phone (Grid) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="businessEmail" className="font-sans font-medium text-xs md:text-sm text-text-primary">
                    Business Email
                  </label>
                  <input
                    type="email"
                    id="businessEmail"
                    name="businessEmail"
                    placeholder="hello@tacticalgear.co.uk"
                    value={formData.businessEmail}
                    onChange={handleInputChange}
                    className={cn(
                      "w-full bg-bg border border-border rounded-button px-4 py-2.5 font-sans text-xs md:text-sm text-text-primary placeholder:text-text-muted/40 transition-all duration-200 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20",
                      errors.businessEmail && "border-red-500/80 focus:border-red-500 focus:ring-red-500/30"
                    )}
                  />
                  {errors.businessEmail && (
                    <span className="font-sans text-[11px] text-red-500 mt-0.5 self-start select-none">
                      {errors.businessEmail}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="businessPhone" className="font-sans font-medium text-xs md:text-sm text-text-primary">
                    Business Phone Number
                  </label>
                  <input
                    type="tel"
                    id="businessPhone"
                    name="businessPhone"
                    placeholder="+44 20 7946 0123"
                    value={formData.businessPhone}
                    onChange={handleInputChange}
                    className={cn(
                      "w-full bg-bg border border-border rounded-button px-4 py-2.5 font-sans text-xs md:text-sm text-text-primary placeholder:text-text-muted/40 transition-all duration-200 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20",
                      errors.businessPhone && "border-red-500/80 focus:border-red-500 focus:ring-red-500/30"
                    )}
                  />
                  {errors.businessPhone && (
                    <span className="font-sans text-[11px] text-red-500 mt-0.5 self-start select-none">
                      {errors.businessPhone}
                    </span>
                  )}
                </div>
              </div>

              {/* VAT Number */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 select-none">
                  <label htmlFor="vatNumber" className="font-sans font-medium text-xs md:text-sm text-text-primary">
                    VAT Number
                  </label>
                  <span className="text-[10px] md:text-xs bg-accent-bg border border-divider px-2.5 py-0.5 rounded-badge text-text-brand uppercase font-medium">
                    if VAT registered
                  </span>
                </div>
                <input
                  type="text"
                  id="vatNumber"
                  name="vatNumber"
                  placeholder="GB123456789"
                  value={formData.vatNumber}
                  onChange={handleInputChange}
                  className="w-full bg-bg border border-border rounded-button px-4 py-2.5 font-sans text-xs md:text-sm text-text-primary placeholder:text-text-muted/40 transition-all duration-200 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                />
                <span className="font-sans text-[11px] text-text-secondary/70">
                  Leave blank if your business is not VAT registered.
                </span>
              </div>

              {/* Bottom Actions Row */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-divider/40">
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center gap-1.5 font-sans font-medium text-xs md:text-sm text-text-secondary hover:text-text-primary cursor-pointer select-none transition-colors duration-150"
                >
                  &larr; Back
                </button>
                <PrimaryButton type="submit" className="font-heading font-semibold text-xs px-6 py-2.5">
                  Save &amp; Continue &rarr;
                </PrimaryButton>
              </div>
            </div>
          )}

          {/* STEP 4: Logo & Branding */}
          {step === 4 && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              {/* Step Title Header */}
              <div className="flex flex-col gap-1.5 pb-2 border-b border-divider">
                <div className="flex items-center justify-between text-xs font-medium text-text-secondary">
                  <span>Step 4 of 8</span>
                  <span className="text-[11px] bg-accent-bg border border-border px-2 py-0.5 rounded-badge text-text-brand">Logo &amp; Branding</span>
                </div>
                <h2 className="font-heading font-semibold text-xl md:text-2xl text-text-primary mt-1">
                  Upload Logo &amp; Branding
                </h2>
                <p className="font-sans text-xs md:text-sm text-text-secondary">
                  Configure visual branding features for entrants to see on your page.
                </p>
              </div>

              {/* Logo Upload Box */}
              <div className="flex flex-col gap-2">
                <label className="font-sans font-medium text-xs md:text-sm text-text-primary">
                  Business Logo
                </label>
                <div className="flex gap-4 items-start">
                  <div
                    onClick={() => businessLogoInputRef.current?.click()}
                    className="w-32 h-32 bg-bg border border-dashed border-border hover:border-primary rounded-card flex flex-col items-center justify-center cursor-pointer overflow-hidden text-center transition-all duration-200"
                  >
                    {formData.businessLogo ? (
                      <img
                        alt="Business Logo preview"
                        src={formData.businessLogo}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="p-3 flex flex-col items-center gap-1 select-none text-text-secondary hover:text-text-primary">
                        {/* Image Logo Icon */}
                        <svg className="w-8 h-8 opacity-60" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                        <span className="text-[10px] md:text-xs">Click to upload</span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={businessLogoInputRef}
                    onChange={(e) => handlePhotoUpload(e, "businessLogo")}
                    accept="image/png, image/jpeg, image/jpg"
                    className="hidden"
                  />
                  <p className="font-sans text-xs md:text-sm text-text-secondary leading-normal max-w-sm pt-2">
                    PNG or JPG, at least 400×400px. This appears on your public Host Profile and in the Verified Hosts directory.
                  </p>
                </div>
              </div>

              {/* Short Business Bio */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="businessBio" className="font-sans font-medium text-xs md:text-sm text-text-primary">
                  Short Business Bio
                </label>
                <div className="relative w-full">
                  <textarea
                    id="businessBio"
                    name="businessBio"
                    maxLength={300}
                    placeholder="Tell entrants a bit about your business..."
                    value={formData.businessBio}
                    onChange={handleInputChange}
                    className={cn(
                      "w-full bg-bg border border-border rounded-button px-4 py-3 h-28 font-sans text-xs md:text-sm text-text-primary placeholder:text-text-muted/40 transition-all duration-200 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 resize-none",
                      errors.businessBio && "border-red-500/80 focus:border-red-500 focus:ring-red-500/30"
                    )}
                  />
                  <span className="absolute bottom-2.5 right-3 font-sans text-[10px] text-text-secondary/70 select-none">
                    {formData.businessBio.length} / 300
                  </span>
                </div>
                {errors.businessBio && (
                  <span className="font-sans text-[11px] text-red-500 mt-0.5 self-start select-none">
                    {errors.businessBio}
                  </span>
                )}
              </div>

              {/* Bottom Actions Row */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-divider/40">
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center gap-1.5 font-sans font-medium text-xs md:text-sm text-text-secondary hover:text-text-primary cursor-pointer select-none transition-colors duration-150"
                >
                  &larr; Back
                </button>
                <PrimaryButton type="submit" className="font-heading font-semibold text-xs px-6 py-2.5">
                  Save &amp; Continue &rarr;
                </PrimaryButton>
              </div>
            </div>
          )}

          {/* STEP 8: Ready to Go Live? */}
          {step === 8 && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              {/* Step Title Header */}
              <div className="flex flex-col gap-1.5 pb-2 border-b border-divider">
                <div className="flex items-center justify-between text-xs font-medium text-text-secondary">
                  <span>Step 8 of 8</span>
                  <span className="text-[11px] bg-success-bg border border-success px-2 py-0.5 rounded-badge text-success-text font-bold">Review Onboarding</span>
                </div>
                <h2 className="font-heading font-semibold text-xl md:text-2xl text-text-primary mt-1">
                  Ready to Go Live?
                </h2>
                <p className="font-sans text-xs md:text-sm text-text-secondary">
                  Review your setup and launch your host profile on the platform.
                </p>
              </div>

              {/* Onboarding Checklist Summary Box */}
              <div className="bg-accent-bg border border-border p-5 rounded-card flex flex-col gap-3 select-none">
                <p className="font-heading font-semibold text-xs md:text-sm text-text-primary">
                  Onboarding Summary
                </p>
                <div className="flex flex-col gap-2.5">
                  {/* Account created */}
                  <div className="flex items-center gap-2.5 text-xs md:text-sm">
                    <span className="w-5 h-5 rounded-full bg-success/20 text-success flex items-center justify-center">
                      ✓
                    </span>
                    <span className="text-text-primary font-medium">Account created</span>
                  </div>
                  {/* Host profile set up */}
                  <div className="flex items-center gap-2.5 text-xs md:text-sm">
                    <span className="w-5 h-5 rounded-full bg-success/20 text-success flex items-center justify-center">
                      ✓
                    </span>
                    <span className="text-text-primary font-medium">Host profile set up</span>
                  </div>
                  {/* Business details submitted */}
                  <div className="flex items-center gap-2.5 text-xs md:text-sm">
                    <span className="w-5 h-5 rounded-full bg-success/20 text-success flex items-center justify-center">
                      ✓
                    </span>
                    <span className="text-text-primary font-medium">Business details submitted</span>
                  </div>
                  {/* Admin review pending */}
                  <div className="flex items-center gap-2.5 text-xs md:text-sm">
                    <span className="w-5 h-5 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center font-bold">
                      !
                    </span>
                    <span className="text-text-primary font-medium">Admin review pending</span>
                  </div>
                </div>
              </div>

              {/* Public Profile Preview Card */}
              <div className="bg-bg border border-border p-5 rounded-card flex flex-col gap-3">
                <p className="font-heading font-semibold text-xs md:text-sm text-text-primary select-none">
                  Your Public Profile Preview
                </p>
                <div className="flex items-center gap-4 bg-surface p-4 rounded-button border border-divider/60">
                  {/* Logo Avatar */}
                  <div className="w-14 h-14 rounded-full bg-accent-bg border border-border overflow-hidden flex items-center justify-center select-none">
                    {formData.businessLogo ? (
                      <img src={formData.businessLogo} alt="Business logo preview" className="w-full h-full object-cover" />
                    ) : formData.profilePhoto ? (
                      <img src={formData.profilePhoto} alt="Profile photo preview" className="w-full h-full object-cover" />
                    ) : (
                      <svg className="w-6 h-6 text-text-muted/30" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                      </svg>
                    )}
                  </div>
                  {/* Name and Meta */}
                  <div className="flex flex-col gap-0.5">
                    <p className="font-heading font-semibold text-sm md:text-base text-text-primary">
                      {formData.businessName || `${formData.firstName} ${formData.lastName}` || "Your Business Name"}
                    </p>
                    <div className="flex items-center gap-3 text-[10px] md:text-xs text-text-secondary select-none">
                      {/* Star New Host */}
                      <span className="inline-flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 fill-current text-primary" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        New Host
                      </span>
                      {/* Map-pin country */}
                      <span className="inline-flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 text-text-secondary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25gA7.5 7.5 0 1119.5 10.5z" />
                        </svg>
                        {formData.country}
                      </span>
                    </div>
                  </div>
                  {/* Verified badge */}
                  <div className="ml-auto select-none bg-accent-bg border border-primary px-3 py-1 rounded-badge">
                    <span className="font-sans font-medium text-[9px] md:text-[10px] text-text-brand whitespace-nowrap">
                      Verified Host
                    </span>
                  </div>
                </div>
              </div>

              {/* Guidelines Agreement Alert */}
              <div className="bg-[#1a230a] border border-divider p-4 rounded-card flex gap-3">
                <div className="pt-0.5">
                  <input
                    type="checkbox"
                    id="acceptedTerms"
                    name="acceptedTerms"
                    checked={formData.acceptedTerms}
                    onChange={handleInputChange}
                    disabled={formState.isSubmitting}
                    className="w-4.5 h-4.5 rounded border border-border bg-bg text-primary focus:ring-0 focus:ring-offset-0 focus:outline-none accent-primary transition-all duration-200 cursor-pointer"
                  />
                </div>
                <label htmlFor="acceptedTerms" className="font-sans text-xs text-text-secondary leading-normal select-none cursor-pointer">
                  By going live, you confirm that all information is accurate and agree to our{" "}
                  <button type="button" onClick={() => showToast("Host Guidelines document is not available in mock.")} className="text-text-brand hover:underline font-medium">Host Guidelines</button>
                  {" "}and{" "}
                  <button type="button" onClick={() => showToast("Platform Rules document is not available in mock.")} className="text-text-brand hover:underline font-medium">Platform Rules</button>.
                </label>
              </div>

              {/* Bottom Actions Row */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-divider/40">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={formState.isSubmitting}
                  className={cn(
                    "inline-flex items-center gap-1.5 font-sans font-medium text-xs md:text-sm text-text-secondary hover:text-text-primary cursor-pointer select-none transition-colors duration-150",
                    formState.isSubmitting && "opacity-50 cursor-not-allowed"
                  )}
                >
                  &larr; Back
                </button>
                <PrimaryButton
                  type="submit"
                  disabled={formState.isSubmitting}
                  className="font-heading font-semibold text-xs px-6 py-2.5 cursor-pointer"
                >
                  {formState.isSubmitting ? "Launching..." : "🚀 Go Live"}
                </PrimaryButton>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
