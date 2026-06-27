import React from "react";
import { hostRecentActivities } from "../../../data/dashboard/host-dashboard.data";
import type { HostRecentActivity as IHostRecentActivity } from "../../../types/host-dashboard.types";

const ActivityIcon = ({ type }: { type: IHostRecentActivity["type"] }) => {
  switch (type) {
    case "purchase":
      return (
        <svg className="w-[12px] h-[12px] text-[#8cb34a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
        </svg>
      );
    case "approved":
      return (
        <svg className="w-[12px] h-[12px] text-[#8cb34a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case "payout":
      return (
        <svg className="w-[12px] h-[12px] text-[#f59e0b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case "joined":
      return (
        <svg className="w-[12px] h-[12px] text-[#f76b6b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
        </svg>
      );
    case "review":
      return (
        <svg className="w-[12px] h-[12px] text-[#eab308]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      );
    default:
      return null;
  }
};

export default function HostRecentActivity() {
  return (
    <div className="w-full flex flex-col gap-[20px] mt-4">
      <h2 className="font-heading font-normal text-[16px] leading-[normal] text-[#e8edd4]">
        Recent Activity
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-[16px]">
        {hostRecentActivities.map((activity) => (
          <div key={activity.id} className="bg-[#161810] border border-[#2d3c13] rounded-[12px] p-[16px] flex gap-[12px] items-start">
            <div className="w-[24px] h-[24px] rounded-[6px] bg-[#1a230a] border border-[#2d3c13] flex items-center justify-center shrink-0 mt-[2px]">
              <ActivityIcon type={activity.type} />
            </div>
            <div className="flex flex-col gap-[4px] min-w-0">
              <p className="font-sans font-normal text-[12px] leading-[18px] text-[#5a752a] truncate">
                {activity.title} —
                <br />
                <span className="text-[#a0d056]">{activity.description}</span>
              </p>
              <p className="font-sans font-normal text-[10px] text-[#5a752a]">
                {activity.timeAgo}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
