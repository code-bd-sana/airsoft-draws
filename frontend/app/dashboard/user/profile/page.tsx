import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function UserProfilePage() {
  const cookieStore = await cookies();
  const role = cookieStore.get("demo_role")?.value;

  if (role !== "user") {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col xl:flex-row gap-5 p-8 max-w-[1660px] mx-auto w-full animate-fadeIn items-start">
      {/* Left Column: Profile Summary */}
      <div className="w-full xl:w-[380px] shrink-0 flex flex-col gap-5">
        <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-8 flex flex-col items-center">
          {/* Avatar Area */}
          <div className="relative mb-6">
            <div className="w-[140px] h-[140px] rounded-full border border-[#2D3C13] bg-[#1A230A] flex items-center justify-center">
              <span className="font-heading font-bold text-[48px] text-[#A0D056]">DA</span>
            </div>
            <button className="absolute bottom-2 right-2 w-8 h-8 bg-[#8CB34A] rounded-full flex items-center justify-center border-2 border-[#161810] hover:bg-[#A0D056] transition-colors cursor-pointer shadow-sm">
              <svg className="w-4 h-4 text-[#0D0D0B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0M18.75 10.5h.008v.008h-.008V10.5Z" />
              </svg>
            </button>
          </div>
          <p className="font-sans text-[12px] text-[#72943A] mb-8 cursor-pointer hover:text-[#8CB34A] transition-colors">
            Upload Photo
          </p>

          {/* Verification Banner */}
          <div className="w-full bg-[#083b18]/30 border border-[#083b18] rounded-[10px] py-2.5 px-4 mb-6 flex items-center gap-2">
            <svg className="w-4 h-4 text-[#4ADE80]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
            <span className="font-sans font-medium text-[12px] text-[#4ADE80]">Identity Verified</span>
          </div>

          {/* Stats List */}
          <div className="w-full flex flex-col gap-4">
            <div className="flex justify-between items-center w-full">
              <span className="font-sans text-[12px] text-[#5A752A]">Member since</span>
              <span className="font-sans text-[13px] font-medium text-[#E8EDD4]">Jan 2025</span>
            </div>
            <div className="flex justify-between items-center w-full">
              <span className="font-sans text-[12px] text-[#5A752A]">Entrant status</span>
              <div className="px-2 py-0.5 rounded-full bg-[#1A230A] border border-[#2D3C13]">
                <span className="font-sans font-medium text-[10px] text-[#8CB34A] tracking-wider uppercase">Verified Entrant</span>
              </div>
            </div>
            <div className="flex justify-between items-center w-full">
              <span className="font-sans text-[12px] text-[#5A752A]">Total wins</span>
              <span className="font-heading font-medium text-[14px] text-[#A0D056]">3</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Settings Forms */}
      <div className="flex-1 bg-[#161810] border border-[#2D3C13] rounded-[16px] p-8 flex flex-col gap-8">
        
        {/* Account Information */}
        <section>
          <h3 className="font-heading font-medium text-[16px] text-[#E8EDD4] mb-5">Account Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-[11px] font-medium uppercase tracking-[0.88px] text-[#5A752A]">Full Name</label>
              <div className="bg-[#0D0D0B] border border-[#2D3C13] h-[40px] rounded-[8px] px-3 flex items-center">
                <input type="text" defaultValue="Daniyal Ahmed" className="bg-transparent outline-none w-full text-[13px] text-[#E8EDD4] font-sans" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-[11px] font-medium uppercase tracking-[0.88px] text-[#5A752A]">Email Address</label>
              <div className="bg-[#0D0D0B] border border-[#2D3C13] h-[40px] rounded-[8px] px-3 flex items-center opacity-70">
                <input type="email" defaultValue="daniyal@example.com" disabled className="bg-transparent outline-none w-full text-[13px] text-[#E8EDD4] font-sans" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-[11px] font-medium uppercase tracking-[0.88px] text-[#5A752A]">Phone Number</label>
              <div className="bg-[#0D0D0B] border border-[#2D3C13] h-[40px] rounded-[8px] px-3 flex items-center">
                <input type="tel" defaultValue="+44 7700 900123" className="bg-transparent outline-none w-full text-[13px] text-[#E8EDD4] font-sans" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-[11px] font-medium uppercase tracking-[0.88px] text-[#5A752A]">Date of Birth</label>
              <div className="bg-[#0D0D0B] border border-[#2D3C13] h-[40px] rounded-[8px] px-3 flex items-center">
                <input type="date" className="bg-transparent outline-none w-full text-[13px] text-[#E8EDD4] font-sans [color-scheme:dark]" />
              </div>
              <span className="font-sans text-[10px] text-[#5A752A] mt-0.5">Must be 18+ to participate</span>
            </div>
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="font-sans text-[11px] font-medium uppercase tracking-[0.88px] text-[#5A752A]">Shipping Address</label>
              <div className="bg-[#0D0D0B] border border-[#2D3C13] rounded-[8px] p-3 flex">
                <textarea className="bg-transparent outline-none w-full text-[13px] text-[#E8EDD4] font-sans resize-none h-[60px]" placeholder="" />
              </div>
            </div>
          </div>
        </section>

        {/* Change Password */}
        <section>
          <h3 className="font-heading font-medium text-[16px] text-[#E8EDD4] mb-5">Change Password</h3>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-[11px] font-medium uppercase tracking-[0.88px] text-[#E8EDD4]">Current Password</label>
              <div className="bg-[#0D0D0B] border border-[#2D3C13] h-[40px] rounded-[8px] px-3 flex items-center justify-between">
                <input type="password" defaultValue="password123" className="bg-transparent outline-none w-full text-[13px] text-[#E8EDD4] font-sans tracking-widest" />
                <button className="text-[#5A752A] hover:text-[#8CB34A]">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-[11px] font-medium uppercase tracking-[0.88px] text-[#E8EDD4]">New Password</label>
              <div className="bg-[#0D0D0B] border border-[#2D3C13] h-[40px] rounded-[8px] px-3 flex items-center justify-between">
                <input type="password" placeholder="••••••••" className="bg-transparent outline-none w-full text-[13px] text-[#E8EDD4] font-sans placeholder:tracking-widest" />
                <button className="text-[#5A752A] hover:text-[#8CB34A]">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-[11px] font-medium uppercase tracking-[0.88px] text-[#E8EDD4]">Confirm Password</label>
              <div className="bg-[#0D0D0B] border border-[#2D3C13] h-[40px] rounded-[8px] px-3 flex items-center justify-between">
                <input type="password" placeholder="••••••••" className="bg-transparent outline-none w-full text-[13px] text-[#E8EDD4] font-sans placeholder:tracking-widest" />
                <button className="text-[#5A752A] hover:text-[#8CB34A]">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Payment Methods */}
        <section>
          <h3 className="font-heading font-medium text-[16px] text-[#E8EDD4] mb-5">Payment Methods</h3>
          <div className="flex flex-col gap-4">
            {/* Existing Payment Card */}
            <div className="bg-[#0D0D0B] border border-[#2D3C13] h-[48px] rounded-[8px] px-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-[#72943A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                </svg>
                <span className="font-sans font-medium text-[13px] text-[#E8EDD4] tracking-widest">•••• •••• •••• 4242</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="px-2 py-0.5 rounded-[4px] bg-[#1A230A] border border-[#2D3C13]">
                  <span className="font-sans text-[10px] text-[#72943A]">Default</span>
                </div>
                <button className="text-[#5A752A] hover:text-[#F76B6B] transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Add Payment Method Button */}
            <button className="w-fit flex items-center gap-2 px-4 py-2 border border-[#2D3C13] bg-transparent rounded-[8px] font-sans font-medium text-[12px] text-[#72943A] hover:text-[#E8EDD4] hover:bg-[#1A230A] transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add Payment Method
            </button>
          </div>
        </section>

        {/* Action Footer */}
        <div className="mt-2 flex justify-end w-full">
          <button className="bg-[#8CB34A] hover:bg-[#A0D056] text-[#0D0D0B] font-heading font-semibold text-[13px] px-6 py-2.5 rounded-[8px] transition-colors">
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
}
