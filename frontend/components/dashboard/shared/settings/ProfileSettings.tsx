"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useAuthUser } from "../../../../hooks/useAuthHooks";
import { useUpdateProfileMutation, useUploadAvatarMutation } from "../../../../hooks/useUserHooks";
import { extractApiError } from "../../../../lib/utils";

export default function ProfileSettings() {
  const { data: user, isLoading } = useAuthUser();
  const updateMutation = useUpdateProfileMutation();
  const avatarMutation = useUploadAvatarMutation();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    location: "",
  });

  const [errors, setErrors] = useState<{ form?: string }>({});
  const [successMsg, setSuccessMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        location: user.location || "",
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors({});
    setSuccessMsg("");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMsg("");

    try {
      await updateMutation.mutateAsync({
        firstName: formData.firstName,
        lastName: formData.lastName,
        location: formData.location,
      });
      setSuccessMsg("Profile details updated successfully.");
    } catch (err: any) {
      setErrors({ form: extractApiError(err, "Failed to update profile.") });
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrors({});
    setSuccessMsg("");

    try {
      await avatarMutation.mutateAsync(file);
      setSuccessMsg("Profile picture updated successfully.");
    } catch (err: any) {
      setErrors({ form: extractApiError(err, "Failed to upload image.") });
    }
    
    // reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (isLoading) {
    return <div className="p-8 text-[#72943A]">Loading profile...</div>;
  }

  return (
    <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-8 flex flex-col gap-8 animate-fadeIn">
      <div>
        <h2 className="font-heading font-medium text-[20px] text-[#E8EDD4]">Profile Details</h2>
        <p className="font-sans text-[13px] text-[#72943A] mt-1">Manage your public profile and contact information.</p>
      </div>

      <div className="h-px w-full bg-[#2D3C13]/50" />

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

      {/* Avatar Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="relative w-[80px] h-[80px] rounded-full bg-[#1A230A] border border-[#43581E] flex items-center justify-center shrink-0 overflow-hidden">
          {user?.avatarUrl ? (
            <Image 
              src={user.avatarUrl} 
              alt="Avatar" 
              fill 
              className="object-cover"
              unoptimized={true} 
            />
          ) : (
            <span className="font-heading font-medium text-[24px] text-[#8CB34A]">
              {(user?.firstName?.[0] || user?.email?.[0] || 'U').toUpperCase()}
            </span>
          )}
          {avatarMutation.isPending && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-[#8CB34A] text-[10px]">Uploading</span>
            </div>
          )}
        </div>
        
        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/png, image/jpeg, image/jpg, image/webp"
              onChange={handleFileSelect}
            />
            <button 
              type="button"
              disabled={avatarMutation.isPending}
              onClick={() => fileInputRef.current?.click()}
              className="h-[36px] px-4 rounded-[8px] bg-[#8CB34A] hover:bg-[#A0D056] text-[#0D0D0B] font-sans font-medium text-[12px] transition-colors disabled:opacity-50"
            >
              Upload New
            </button>
          </div>
          <p className="font-sans text-[11px] text-[#72943A]">Recommended: Square JPG, PNG. Max 5MB.</p>
        </div>
      </div>

      <div className="h-px w-full bg-[#2D3C13]/50" />
      
      {/* Form Fields */}
      <form onSubmit={handleSave} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <label className="font-sans font-medium text-[12px] text-[#A0D056] uppercase tracking-[0.5px]">First Name</label>
            <input 
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              disabled={updateMutation.isPending}
              className="w-full h-[44px] bg-[#111210] border border-[#2D3C13] rounded-[8px] px-4 text-[14px] text-[#E8EDD4] outline-none focus:border-[#43581E] transition-colors"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-sans font-medium text-[12px] text-[#A0D056] uppercase tracking-[0.5px]">Last Name</label>
            <input 
              type="text" 
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              disabled={updateMutation.isPending}
              className="w-full h-[44px] bg-[#111210] border border-[#2D3C13] rounded-[8px] px-4 text-[14px] text-[#E8EDD4] outline-none focus:border-[#43581E] transition-colors"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-sans font-medium text-[12px] text-[#A0D056] uppercase tracking-[0.5px]">Email Address</label>
          <input 
            type="email" 
            value={user?.email || ""} 
            disabled 
            className="w-full h-[44px] bg-[#111210]/50 border border-[#2D3C13]/50 rounded-[8px] px-4 text-[14px] text-[#E8EDD4]/50 cursor-not-allowed outline-none transition-colors"
          />
          <span className="text-[11px] text-[#72943A]">Email address cannot be changed directly.</span>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-sans font-medium text-[12px] text-[#A0D056] uppercase tracking-[0.5px]">Location</label>
          <input 
            type="text" 
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="e.g. London, UK"
            disabled={updateMutation.isPending}
            className="w-full h-[44px] bg-[#111210] border border-[#2D3C13] rounded-[8px] px-4 text-[14px] text-[#E8EDD4] outline-none focus:border-[#43581E] transition-colors"
          />
        </div>
        
        <div className="flex justify-end pt-2 border-t border-[#2D3C13]/50 mt-2">
          <button 
            type="submit"
            disabled={updateMutation.isPending}
            className="h-[44px] px-6 rounded-[8px] bg-[#8CB34A] hover:bg-[#A0D056] text-[#0D0D0B] font-heading font-medium text-[14px] transition-colors shadow-[0_0_15px_rgba(140,179,74,0.15)] disabled:opacity-50 disabled:shadow-none"
          >
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
