"use client";

import React, { useState } from "react";
import InputField from "../shared/InputField";
import TextareaField from "../shared/TextareaField";
import PrimaryButton from "../shared/PrimaryButton";
import { ContactFormValues } from "../../../types/contact.types";
import { cn } from "../../../lib/utils";

const SUBJECT_OPTIONS = [
  { value: "", label: "Select a topic..." },
  { value: "draw-query", label: "Questions about a Draw" },
  { value: "hosting", label: "Hosting Competitions" },
  { value: "billing", label: "Payment & Subscription" },
  { value: "bug-report", label: "Technical Support" },
  { value: "other", label: "Other Inquiries" },
];

/**
 * Stateful Contact Form component with strict frontend validation,
 * simulated API submission delays, and accessible success/error alerts.
 */
export default function ContactForm() {
  const [formValues, setFormValues] = useState<ContactFormValues>({
    fullName: "",
    email: "",
    subject: "",
    message: "",
    agreeToPolicy: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormValues, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const val =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormValues((prev) => ({
      ...prev,
      [name]: val,
    }));

    // Clear error message when user starts typing again
    if (errors[name as keyof ContactFormValues]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ContactFormValues, string>> = {};

    if (!formValues.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formValues.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!emailRegex.test(formValues.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formValues.subject) {
      newErrors.subject = "Please select an inquiry topic.";
    }

    if (!formValues.message.trim()) {
      newErrors.message = "Message content is required.";
    } else if (formValues.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters long.";
    }

    if (!formValues.agreeToPolicy) {
      newErrors.agreeToPolicy = "You must agree to the privacy policy.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate API call latency
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormValues({
        fullName: "",
        email: "",
        subject: "",
        message: "",
        agreeToPolicy: false,
      });
    }, 1500);
  };

  return (
    <div className="w-full bg-elevated border border-border rounded-[16px] p-6 md:p-8 relative">
      <h2 className="font-heading font-bold text-lg md:text-xl text-text-primary mb-6">
        Send Us a Message
      </h2>

      {/* Success Notification Alert */}
      {isSuccess ? (
        <div className="bg-success-bg border border-success text-success-text rounded-button p-6 flex flex-col items-center text-center animate-fadeIn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-12 h-12 mb-3 text-[#4ade80]"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <h3 className="font-heading font-bold text-base md:text-lg mb-2">Message Sent Successfully!</h3>
          <p className="font-sans text-xs md:text-sm text-text-muted leading-relaxed max-w-sm mb-4">
            Thank you for reaching out. A member of our support team will reply within 24 hours.
          </p>
          <PrimaryButton onClick={() => setIsSuccess(false)} className="px-5 py-2 text-xs">
            Send Another Message
          </PrimaryButton>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Full Name */}
          <InputField
            label="Full Name"
            id="fullName"
            name="fullName"
            placeholder="John Smith"
            value={formValues.fullName}
            onChange={handleInputChange}
            error={errors.fullName}
            disabled={isSubmitting}
            required
          />

          {/* Email Address */}
          <InputField
            label="Email Address"
            id="email"
            name="email"
            type="email"
            placeholder="john@example.com"
            value={formValues.email}
            onChange={handleInputChange}
            error={errors.email}
            disabled={isSubmitting}
            required
          />

          {/* Subject Dropdown */}
          <div className="flex flex-col w-full">
            <label
              htmlFor="subject"
              className="font-sans font-medium text-xs md:text-sm text-text-secondary mb-1.5 self-start select-none"
            >
              Subject <span className="text-red-500">*</span>
            </label>
            <select
              id="subject"
              name="subject"
              value={formValues.subject}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className={cn(
                "w-full bg-bg border border-border rounded-button px-4 py-2.5 font-sans text-xs md:text-sm text-text-primary focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all duration-200 cursor-pointer appearance-none",
                errors.subject && "border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500/30",
                isSubmitting && "opacity-50 cursor-not-allowed"
              )}
            >
              {SUBJECT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-surface py-2">
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.subject && (
              <span className="font-sans text-[11px] text-red-500 mt-1 self-start select-none">
                {errors.subject}
              </span>
            )}
          </div>

          {/* Message Textarea */}
          <TextareaField
            label="Message"
            id="message"
            name="message"
            placeholder="Tell us how we can help..."
            value={formValues.message}
            onChange={handleInputChange}
            error={errors.message}
            disabled={isSubmitting}
            rows={5}
            required
          />

          {/* Privacy Policy Checkbox */}
          <div className="flex flex-col">
            <label className="flex items-start gap-3 cursor-pointer group select-none">
              <input
                type="checkbox"
                name="agreeToPolicy"
                checked={formValues.agreeToPolicy}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="w-4 h-4 rounded border-border text-primary bg-bg focus:ring-primary/20 cursor-pointer mt-1"
              />
              <span className="font-sans font-medium text-xs md:text-sm text-text-secondary group-hover:text-text-primary transition-colors duration-200">
                I agree to the Privacy Policy
              </span>
            </label>
            {errors.agreeToPolicy && (
              <span className="font-sans text-[11px] text-red-500 mt-1.5 self-start select-none">
                {errors.agreeToPolicy}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <PrimaryButton
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 mt-2 text-sm tracking-wide font-semibold"
            icon={
              isSubmitting ? (
                <svg className="animate-spin h-4 w-4 text-primary-text" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <span className="leading-none">&#8594;</span>
              )
            }
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </PrimaryButton>
        </form>
      )}
    </div>
  );
}
