import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function UserDashboardPage() {
  const cookieStore = await cookies();
  const role = cookieStore.get("demo_role")?.value;

  if (role !== "user") {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col gap-5 p-8 max-w-[1660px] mx-auto w-full animate-fadeIn">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 w-full">
        {/* Total Tickets */}
        <div className="bg-[#161810] border border-[#2D3C13] rounded-[14px] p-5 flex flex-col gap-3">
          <p className="font-sans text-[11px] font-normal uppercase tracking-[1.1px] text-[#5A752A]">
            Total Tickets
          </p>
          <p className="font-heading font-bold text-[28px] leading-tight text-[#E8EDD4]">
            142
          </p>
          <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#083b18] w-fit">
            <span className="font-sans text-[10px] font-medium text-[#4ADE80]">
              ▲ 12 this month
            </span>
          </div>
        </div>

        {/* Active Entries */}
        <div className="bg-[#161810] border border-[#2D3C13] rounded-[14px] p-5 flex flex-col gap-3">
          <p className="font-sans text-[11px] font-normal uppercase tracking-[1.1px] text-[#5A752A]">
            Active Entries
          </p>
          <p className="font-heading font-bold text-[28px] leading-tight text-[#E8EDD4]">
            8
          </p>
          <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#1A230A] w-fit">
            <span className="font-sans text-[10px] font-medium text-[#72943A]">
              Awaiting draw
            </span>
          </div>
        </div>

        {/* Won Raffles */}
        <div className="bg-[#161810] border border-[#2D3C13] rounded-[14px] p-5 flex flex-col gap-3">
          <p className="font-sans text-[11px] font-normal uppercase tracking-[1.1px] text-[#5A752A]">
            Won Raffles
          </p>
          <p className="font-heading font-bold text-[28px] leading-tight text-[#E8EDD4]">
            3
          </p>
          <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#083b18] w-fit">
            <span className="font-sans text-[10px] font-medium text-[#4ADE80]">
              ▲ 1 new
            </span>
          </div>
        </div>

        {/* Total Spent */}
        <div className="bg-[#161810] border border-[#2D3C13] rounded-[14px] p-5 flex flex-col gap-3">
          <p className="font-sans text-[11px] font-normal uppercase tracking-[1.1px] text-[#5A752A]">
            Total Spent
          </p>
          <p className="font-heading font-bold text-[28px] leading-tight text-[#E8EDD4]">
            £286.50
          </p>
          <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-transparent w-fit">
            <span className="font-sans text-[10px] font-medium text-[#5A752A]">
              Lifetime
            </span>
          </div>
        </div>
      </div>

      {/* Row 2: Chart & Affordability */}
      <div className="flex flex-col xl:flex-row gap-5 w-full">
        {/* Ticket Spend Overview */}
        <div className="flex-[3] bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col min-h-[346px]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-4 sm:gap-0">
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <span className="font-heading font-bold text-[32px] text-[#E8EDD4] leading-none">
                  £286.50
                </span>
                <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#083b18]">
                  <span className="font-sans text-[11px] text-[#4ADE80]">
                    ▲ 8%
                  </span>
                </div>
              </div>
              <span className="font-sans text-[13px] text-[#72943A] mt-1">
                Ticket Spend Overview
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button className="px-3 py-1 rounded-[10px] border border-[#2D3C13] font-sans font-medium text-[11px] text-[#72943A] hover:bg-[#1A230A]">
                7D
              </button>
              <button className="px-3 py-1 rounded-[10px] border border-[#8CB34A] bg-[#1A230A] font-sans font-medium text-[11px] text-[#8CB34A]">
                1M
              </button>
              <button className="px-3 py-1 rounded-[10px] border border-[#2D3C13] font-sans font-medium text-[11px] text-[#72943A] hover:bg-[#1A230A]">
                3M
              </button>
              <button className="px-3 py-1 rounded-[10px] border border-[#2D3C13] font-sans font-medium text-[11px] text-[#72943A] hover:bg-[#1A230A]">
                1Y
              </button>
            </div>
          </div>

          <div className="mt-8 flex-1 w-full relative min-h-[200px]">
            {/* Chart Graphic Placeholder matching Figma aesthetic */}
            <svg
              className="absolute inset-0 w-full h-full text-[#8CB34A] opacity-20"
              preserveAspectRatio="none"
              viewBox="0 0 100 100"
              fill="currentColor"
            >
              <path d="M0 100 V 50 Q 15 70 25 40 T 50 60 T 75 30 T 100 45 V 100 Z" />
            </svg>
            <svg
              className="absolute inset-0 w-full h-full"
              preserveAspectRatio="none"
              viewBox="0 0 100 100"
              fill="none"
              stroke="#8CB34A"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            >
              <path d="M0 50 Q 15 70 25 40 T 50 60 T 75 30 T 100 45" />
            </svg>
            
            {/* X-axis labels */}
            <div className="absolute bottom-0 w-full flex justify-between px-4">
              {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"].map(
                (month, i) => (
                  <span
                    key={i}
                    className="font-sans text-[10px] text-[#5A752A]"
                  >
                    {month}
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        {/* How Many Tickets Can I Afford? */}
        <div className="flex-[2] bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col justify-between min-h-[346px]">
          <div>
            <h3 className="font-heading font-medium text-[15px] text-[#E8EDD4] mb-5">
              How Many Tickets Can I Afford?
            </h3>
            
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-sans font-medium text-[11px] tracking-[0.88px] uppercase text-[#5A752A]">
                  Budget (£)
                </label>
                <div className="bg-[#0D0D0B] border border-[#2D3C13] h-[40px] rounded-[10px] flex items-center px-3">
                  <input
                    type="text"
                    defaultValue="50"
                    className="bg-transparent border-none outline-none text-[#E8EDD4] text-[13px] font-sans w-full"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-sans font-medium text-[11px] tracking-[0.88px] uppercase text-[#5A752A]">
                  Ticket Price (£)
                </label>
                <div className="bg-[#0D0D0B] border border-[#2D3C13] h-[40px] rounded-[10px] flex items-center px-3">
                  <input
                    type="text"
                    defaultValue="2.50"
                    className="bg-transparent border-none outline-none text-[#E8EDD4] text-[13px] font-sans w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-4">
            <button className="bg-[#8CB34A] h-[44px] rounded-[10px] w-full font-heading font-medium text-[14px] text-[#0D0D0B] hover:bg-[#A0D056] transition-colors">
              Calculate
            </button>
            <div className="border-t border-[#1A230A] pt-4 flex justify-between items-center">
              <span className="font-sans font-normal text-[11px] tracking-[0.88px] uppercase text-[#5A752A]">
                Tickets You Can Buy
              </span>
              <span className="font-heading font-medium text-[24px] text-[#A0D056]">
                20 tickets
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Active Entries & Recent Wins */}
      <div className="flex flex-col xl:flex-row gap-5 w-full">
        {/* My Active Entries */}
        <div className="flex-[3] bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col opacity-90">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-heading font-medium text-[16px] text-[#E8EDD4]">
              My Active Entries
            </h3>
            <button className="flex items-center gap-1 font-sans font-medium text-[13px] text-[#8CB34A] hover:text-[#A0D056] transition-colors">
              View All
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
          
          <div className="flex flex-col">
            {/* List Header */}
            <div className="grid grid-cols-12 gap-4 pb-3 border-b border-[#1A230A] font-sans text-[11px] font-medium text-[#72943A] uppercase tracking-wider">
              <div className="col-span-6">Competition</div>
              <div className="col-span-3">Draw Date</div>
              <div className="col-span-3 text-right">Tickets</div>
            </div>
            
            {/* List Item 1 */}
            <div className="grid grid-cols-12 gap-4 py-4 border-b border-[#1A230A] items-center">
              <div className="col-span-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#1A230A] border border-[#2D3C13] flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-[#8CB34A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="font-sans text-[14px] font-medium text-[#E8EDD4]">Tokyo Marui MK18</span>
                  <span className="font-sans text-[12px] text-[#72943A]">Hosted by Tactical Gear UK</span>
                </div>
              </div>
              <div className="col-span-3 flex items-center">
                <span className="font-sans text-[13px] text-[#E8EDD4]">12 Oct 2024</span>
              </div>
              <div className="col-span-3 flex items-center justify-end">
                <div className="px-2 py-1 bg-[#1A230A] border border-[#2D3C13] rounded-md">
                  <span className="font-sans text-[13px] font-medium text-[#E8EDD4]">15</span>
                </div>
              </div>
            </div>

            {/* List Item 2 */}
            <div className="grid grid-cols-12 gap-4 py-4 border-b border-[#1A230A] items-center">
              <div className="col-span-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#1A230A] border border-[#2D3C13] flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-[#8CB34A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="font-sans text-[14px] font-medium text-[#E8EDD4]">VFC BCM MCMR</span>
                  <span className="font-sans text-[12px] text-[#72943A]">Hosted by Airsoft Hub</span>
                </div>
              </div>
              <div className="col-span-3 flex items-center">
                <span className="font-sans text-[13px] text-[#E8EDD4]">15 Oct 2024</span>
              </div>
              <div className="col-span-3 flex items-center justify-end">
                <div className="px-2 py-1 bg-[#1A230A] border border-[#2D3C13] rounded-md">
                  <span className="font-sans text-[13px] font-medium text-[#E8EDD4]">3</span>
                </div>
              </div>
            </div>
            
            {/* List Item 3 */}
            <div className="grid grid-cols-12 gap-4 py-4 items-center">
              <div className="col-span-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#1A230A] border border-[#2D3C13] flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-[#8CB34A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="font-sans text-[14px] font-medium text-[#E8EDD4]">Novritsch SSP5</span>
                  <span className="font-sans text-[12px] text-[#72943A]">Hosted by Precision Airsoft</span>
                </div>
              </div>
              <div className="col-span-3 flex items-center">
                <span className="font-sans text-[13px] text-[#E8EDD4]">22 Oct 2024</span>
              </div>
              <div className="col-span-3 flex items-center justify-end">
                <div className="px-2 py-1 bg-[#1A230A] border border-[#2D3C13] rounded-md">
                  <span className="font-sans text-[13px] font-medium text-[#E8EDD4]">10</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Wins */}
        <div className="flex-[2] bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 flex flex-col opacity-90">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-heading font-medium text-[16px] text-[#E8EDD4]">
              Recent Wins
            </h3>
            <button className="flex items-center gap-1 font-sans font-medium text-[13px] text-[#8CB34A] hover:text-[#A0D056] transition-colors">
              View All
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
          
          <div className="flex flex-col h-full justify-center min-h-[220px]">
             {/* Empty State for Wins */}
             <div className="flex flex-col items-center justify-center text-center py-8">
                <div className="w-16 h-16 bg-[#1A230A] rounded-full border border-[#2D3C13] flex items-center justify-center mb-4">
                   <svg className="w-8 h-8 text-[#72943A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
                   </svg>
                </div>
                <h4 className="font-sans font-medium text-[14px] text-[#E8EDD4] mb-1">No wins just yet</h4>
                <p className="font-sans text-[13px] text-[#72943A] max-w-[200px]">
                   Enter competitions for a chance to win premium airsoft gear.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
