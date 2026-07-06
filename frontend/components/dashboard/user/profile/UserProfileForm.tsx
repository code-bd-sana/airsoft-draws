"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuthUser } from "../../../../hooks/useAuthHooks";
import { userService } from "../../../../services/user.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function UserProfileForm() {
  const { data: user, isLoading } = useAuthUser();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || user.hostProfile?.phone || "",
        address: user.address || user.location || user.hostProfile?.address || "",
      });
    }
  }, [user]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      return userService.updateProfile(data);
    },
    onSuccess: (data) => {
      setProfileMessage("Profile saved successfully!");
      queryClient.setQueryData(["user"], data.user);
      setTimeout(() => setProfileMessage(""), 3000);
    },
    onError: () => {
      setProfileMessage("Failed to save profile.");
    },
    onSettled: () => {
      setIsSubmittingProfile(false);
    }
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: any) => {
      return userService.changePassword(data);
    },
    onSuccess: () => {
      setPasswordMessage("Password changed successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setPasswordMessage(""), 3000);
    },
    onError: (error: any) => {
      setPasswordMessage(error.response?.data?.message || "Failed to change password.");
    },
    onSettled: () => {
      setIsSubmittingPassword(false);
    }
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: async (file: File) => {
      return userService.uploadAvatar(file);
    },
    onSuccess: (data) => {
      setProfileMessage("Avatar updated successfully!");
      queryClient.setQueryData(["user"], data.user);
      setTimeout(() => setProfileMessage(""), 3000);
    },
    onError: () => {
      setProfileMessage("Failed to update avatar.");
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadAvatarMutation.mutate(e.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingProfile(true);
    
    updateProfileMutation.mutate({
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      address: formData.address,
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage("New passwords do not match.");
      return;
    }
    if (passwordData.newPassword.length < 8) {
      setPasswordMessage("Password must be at least 8 characters long.");
      return;
    }
    setIsSubmittingPassword(true);
    changePasswordMutation.mutate({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    });
  };

  if (isLoading) {
    return <div className="text-[#8cb34a] animate-pulse">Loading profile...</div>;
  }

  const initials = user?.firstName?.substring(0, 2).toUpperCase() || user?.email?.substring(0, 2).toUpperCase() || "US";

  return (
    <div className="flex flex-col xl:flex-row gap-5 p-8 max-w-[1660px] mx-auto w-full animate-fadeIn items-start">
      {/* Left Column: Profile Summary */}
      <div className="w-full xl:w-[380px] shrink-0 flex flex-col gap-5">
        <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-8 flex flex-col items-center">
          {/* Avatar Area */}
          <div className="relative mb-6">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
            <div className="w-[140px] h-[140px] rounded-full border border-[#2D3C13] bg-[#1A230A] flex items-center justify-center overflow-hidden">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="font-heading font-bold text-[48px] text-[#A0D056]">{initials}</span>
              )}
            </div>
            <button 
              type="button"
              onClick={handleUploadClick}
              disabled={uploadAvatarMutation.isPending}
              className="absolute bottom-2 right-2 w-8 h-8 bg-[#8CB34A] rounded-full flex items-center justify-center border-2 border-[#161810] hover:bg-[#A0D056] transition-colors cursor-pointer shadow-sm disabled:opacity-50"
            >
              <svg className="w-4 h-4 text-[#0D0D0B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0M18.75 10.5h.008v.008h-.008V10.5Z" />
              </svg>
            </button>
          </div>
          <p 
            onClick={handleUploadClick}
            className="font-sans text-[12px] text-[#72943A] mb-8 cursor-pointer hover:text-[#8CB34A] transition-colors"
          >
            {uploadAvatarMutation.isPending ? "Uploading..." : "Upload Photo"}
          </p>

          {/* Verification Banner */}
          {user?.isEmailVerified && (
            <div className="w-full bg-[#083b18]/30 border border-[#083b18] rounded-[10px] py-2.5 px-4 mb-6 flex items-center gap-2">
              <svg className="w-4 h-4 text-[#4ADE80]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              <span className="font-sans font-medium text-[12px] text-[#4ADE80]">Email Verified</span>
            </div>
          )}

          {/* Stats List */}
          <div className="w-full flex flex-col gap-4">
            <div className="flex justify-between items-center w-full">
              <span className="font-sans text-[12px] text-[#5A752A]">Member since</span>
              <span className="font-sans text-[13px] font-medium text-[#E8EDD4]">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center w-full">
              <span className="font-sans text-[12px] text-[#5A752A]">Role</span>
              <div className="px-2 py-0.5 rounded-full bg-[#1A230A] border border-[#2D3C13]">
                <span className="font-sans font-medium text-[10px] text-[#8CB34A] tracking-wider uppercase">
                  {user?.role === 'ADMIN' ? 'Admin' : user?.role === 'HOST' ? 'Host' : 'User'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Settings Forms */}
      <div className="flex-1 flex flex-col gap-5">
        <form onSubmit={handleProfileSubmit} className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-8 flex flex-col gap-8">
          
          {/* Account Information */}
          <section>
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-heading font-medium text-[16px] text-[#E8EDD4]">Account Information</h3>
              {profileMessage && (
                <span className={`text-[13px] font-medium ${profileMessage.includes('Failed') ? 'text-[#F76B6B]' : 'text-[#8CB34A]'}`}>
                  {profileMessage}
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-[11px] font-medium uppercase tracking-[0.88px] text-[#5A752A]">First Name</label>
                <div className="bg-[#0D0D0B] border border-[#2D3C13] h-[40px] rounded-[8px] px-3 flex items-center">
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" className="bg-transparent outline-none w-full text-[13px] text-[#E8EDD4] font-sans" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-[11px] font-medium uppercase tracking-[0.88px] text-[#5A752A]">Last Name</label>
                <div className="bg-[#0D0D0B] border border-[#2D3C13] h-[40px] rounded-[8px] px-3 flex items-center">
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" className="bg-transparent outline-none w-full text-[13px] text-[#E8EDD4] font-sans" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="font-sans text-[11px] font-medium uppercase tracking-[0.88px] text-[#5A752A]">Email Address</label>
                <div className="bg-[#0D0D0B] border border-[#2D3C13] h-[40px] rounded-[8px] px-3 flex items-center opacity-70">
                  <input type="email" name="email" value={formData.email} disabled className="bg-transparent outline-none w-full text-[13px] text-[#E8EDD4] font-sans" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="font-sans text-[11px] font-medium uppercase tracking-[0.88px] text-[#5A752A]">Phone Number</label>
                <div className="bg-[#0D0D0B] border border-[#2D3C13] h-[40px] rounded-[8px] px-3 flex items-center">
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+44 7700 900123" className="bg-transparent outline-none w-full text-[13px] text-[#E8EDD4] font-sans" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="font-sans text-[11px] font-medium uppercase tracking-[0.88px] text-[#5A752A]">Shipping Address</label>
                <div className="bg-[#0D0D0B] border border-[#2D3C13] rounded-[8px] p-3 flex">
                  <textarea name="address" value={formData.address} onChange={handleChange} className="bg-transparent outline-none w-full text-[13px] text-[#E8EDD4] font-sans resize-none h-[60px]" placeholder="123 Street, City, Postcode" />
                </div>
              </div>
            </div>
          </section>

          {/* Action Footer */}
          <div className="mt-2 flex justify-end w-full">
            <button 
              type="submit" 
              disabled={isSubmittingProfile}
              className="bg-[#8CB34A] hover:bg-[#A0D056] text-[#0D0D0B] font-heading font-semibold text-[13px] px-6 py-2.5 rounded-[8px] transition-colors disabled:opacity-50"
            >
              {isSubmittingProfile ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>

        <form onSubmit={handlePasswordSubmit} className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-8 flex flex-col gap-8">
          {/* Change Password */}
          <section>
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-heading font-medium text-[16px] text-[#E8EDD4]">Change Password</h3>
              {passwordMessage && (
                <span className={`text-[13px] font-medium ${passwordMessage.includes('Failed') || passwordMessage.includes('not match') || passwordMessage.includes('least') ? 'text-[#F76B6B]' : 'text-[#8CB34A]'}`}>
                  {passwordMessage}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-[11px] font-medium uppercase tracking-[0.88px] text-[#5A752A]">Current Password</label>
                <div className="bg-[#0D0D0B] border border-[#2D3C13] h-[40px] rounded-[8px] px-3 flex items-center justify-between">
                  <input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} placeholder="••••••••" className="bg-transparent outline-none w-full text-[13px] text-[#E8EDD4] font-sans tracking-widest" required />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-[11px] font-medium uppercase tracking-[0.88px] text-[#5A752A]">New Password</label>
                <div className="bg-[#0D0D0B] border border-[#2D3C13] h-[40px] rounded-[8px] px-3 flex items-center justify-between">
                  <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} placeholder="••••••••" className="bg-transparent outline-none w-full text-[13px] text-[#E8EDD4] font-sans placeholder:tracking-widest" required />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-[11px] font-medium uppercase tracking-[0.88px] text-[#5A752A]">Confirm Password</label>
                <div className="bg-[#0D0D0B] border border-[#2D3C13] h-[40px] rounded-[8px] px-3 flex items-center justify-between">
                  <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} placeholder="••••••••" className="bg-transparent outline-none w-full text-[13px] text-[#E8EDD4] font-sans placeholder:tracking-widest" required />
                </div>
              </div>
            </div>
          </section>
          
          <div className="mt-2 flex justify-end w-full">
            <button 
              type="submit" 
              disabled={isSubmittingPassword}
              className="border border-[#8CB34A] text-[#8CB34A] hover:bg-[#8CB34A] hover:text-[#0D0D0B] font-heading font-semibold text-[13px] px-6 py-2.5 rounded-[8px] transition-colors disabled:opacity-50"
            >
              {isSubmittingPassword ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
