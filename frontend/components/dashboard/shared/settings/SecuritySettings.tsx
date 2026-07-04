"use client";

import React, { useState } from "react";
import { useChangePasswordMutation } from "../../../../hooks/useUserHooks";
import { extractApiError } from "../../../../lib/utils";

export default function SecuritySettings() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<{ form?: string; newPassword?: string; currentPassword?: string }>({});
  const [successMsg, setSuccessMsg] = useState("");
  
  const mutation = useChangePasswordMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors] || errors.form) {
      setErrors((prev) => ({ ...prev, [name]: undefined, form: undefined }));
    }
    setSuccessMsg("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMsg("");

    if (!formData.currentPassword) {
      setErrors({ currentPassword: "Current password is required" });
      return;
    }

    if (formData.newPassword.length < 8) {
      setErrors({ newPassword: "New password must be at least 8 characters long" });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setErrors({ newPassword: "Passwords do not match" });
      return;
    }

    try {
      await mutation.mutateAsync({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      setSuccessMsg("Password updated successfully.");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err: any) {
      setErrors({ form: extractApiError(err, "Failed to change password.") });
    }
  };

  return (
    <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-8 flex flex-col gap-8 animate-fadeIn">
      <div>
        <h2 className="font-heading font-medium text-[20px] text-[#E8EDD4]">Security</h2>
        <p className="font-sans text-[13px] text-[#72943A] mt-1">Keep your account secure with a strong password.</p>
      </div>

      <div className="h-px w-full bg-[#2D3C13]/50" />

      {/* Password Change Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <h3 className="font-heading font-medium text-[16px] text-[#E8EDD4]">Change Password</h3>
        
        {errors.form && (
          <div className="bg-[#f76b6b]/10 border border-[#f76b6b]/20 text-[#f76b6b] text-[13px] p-3 rounded-[8px]">
            {errors.form}
          </div>
        )}

        {successMsg && (
          <div className="bg-[#8CB34A]/10 border border-[#8CB34A]/20 text-[#8CB34A] text-[13px] p-3 rounded-[8px]">
            {successMsg}
          </div>
        )}
        
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="font-sans font-medium text-[12px] text-[#A0D056] uppercase tracking-[0.5px]">Current Password</label>
            <input 
              type="password" 
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              placeholder="••••••••" 
              disabled={mutation.isPending}
              className="w-full h-[44px] bg-[#111210] border border-[#2D3C13] rounded-[8px] px-4 text-[14px] text-[#E8EDD4] outline-none focus:border-[#43581E] transition-colors"
            />
            {errors.currentPassword && <span className="text-[#f76b6b] text-[11px]">{errors.currentPassword}</span>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="font-sans font-medium text-[12px] text-[#A0D056] uppercase tracking-[0.5px]">New Password</label>
              <input 
                type="password" 
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                placeholder="••••••••" 
                disabled={mutation.isPending}
                className="w-full h-[44px] bg-[#111210] border border-[#2D3C13] rounded-[8px] px-4 text-[14px] text-[#E8EDD4] outline-none focus:border-[#43581E] transition-colors"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-sans font-medium text-[12px] text-[#A0D056] uppercase tracking-[0.5px]">Confirm Password</label>
              <input 
                type="password" 
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="••••••••" 
                disabled={mutation.isPending}
                className="w-full h-[44px] bg-[#111210] border border-[#2D3C13] rounded-[8px] px-4 text-[14px] text-[#E8EDD4] outline-none focus:border-[#43581E] transition-colors"
              />
            </div>
          </div>
          {errors.newPassword && <span className="text-[#f76b6b] text-[11px]">{errors.newPassword}</span>}
        </div>
        
        <div className="flex justify-start mt-1">
          <button 
            type="submit" 
            disabled={mutation.isPending}
            className="h-[36px] px-5 rounded-[8px] bg-transparent border border-[#8CB34A] hover:bg-[#8CB34A]/10 text-[#8CB34A] font-sans font-medium text-[13px] transition-colors disabled:opacity-50"
          >
            {mutation.isPending ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
}
