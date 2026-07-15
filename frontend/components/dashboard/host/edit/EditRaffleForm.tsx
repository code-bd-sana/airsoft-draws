"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetRaffleById, useUpdateRaffle } from "../../../../hooks/useRaffleHooks";
import { cn } from "../../../../lib/utils";
import { toast } from "sonner";

interface Props {
  raffleId: string;
}

export default function EditRaffleForm({ raffleId }: Props) {
  const router = useRouter();
  const { data: raffle, isLoading } = useGetRaffleById(raffleId);
  const updateMutation = useUpdateRaffle();

  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (raffle) {
      setFormData({
        title: raffle.title,
        category: (raffle as any).category,
        description: raffle.description,
        prizeName: raffle.prizeName,
        totalTickets: raffle.totalTickets,
        pricePerTicket: raffle.pricePerTicket,
        startDate: raffle.startDate ? new Date(raffle.startDate).toISOString().slice(0, 16) : "",
        endDate: raffle.endDate ? new Date(raffle.endDate).toISOString().slice(0, 16) : "",
        isAutoDraw: raffle.isAutoDraw,
        autoDrawDate: raffle.autoDrawDate,
        autoDrawSoldOut: raffle.autoDrawSoldOut,
        guaranteedDraw: (raffle as any).guaranteedDraw,
      });
    }
  }, [raffle]);

  const hasSoldTickets = (raffle?.ticketsSold ?? 0) > 0;

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      
      // Convert dates back to ISO string
      if (payload.startDate) payload.startDate = new Date(payload.startDate).toISOString();
      if (payload.endDate) payload.endDate = new Date(payload.endDate).toISOString();
      
      // Convert numbers
      if (payload.totalTickets) payload.totalTickets = Number(payload.totalTickets);
      if (payload.pricePerTicket) payload.pricePerTicket = Number(payload.pricePerTicket);

      await updateMutation.mutateAsync({ id: raffleId, data: payload });
      toast.success("Competition updated successfully!");
      router.push("/dashboard/host/competitions");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update competition.");
    }
  };

  if (isLoading) {
    return <div className="text-[#a0d056]">Loading competition data...</div>;
  }

  if (!raffle) {
    return <div className="text-red-500">Competition not found.</div>;
  }

  return (
    <div className="w-full bg-[#161810] border border-[#2d3c13] rounded-[16px] overflow-hidden flex flex-col p-[24px]">
      <h2 className="font-heading font-medium text-[24px] text-[#e8edd4] mb-[8px]">
        Edit Competition
      </h2>
      <p className="font-sans text-[14px] text-[#b3b8aa] mb-[24px]">
        Make changes to your competition. Note that some fields cannot be edited once tickets have been sold.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-[24px]">
        {/* Basic Info */}
        <div className="flex flex-col gap-[8px]">
          <label className="font-sans font-medium text-[13px] text-[#e8edd4]">Title</label>
          <input
            type="text"
            value={formData.title || ""}
            onChange={(e) => handleChange("title", e.target.value)}
            required
            className="h-[48px] px-[16px] bg-[#0d0d0b] border border-[#2d3c13] rounded-[8px] text-[#e8edd4] outline-none focus:border-[#8cb34a]"
          />
        </div>

        <div className="flex flex-col gap-[8px]">
          <label className="font-sans font-medium text-[13px] text-[#e8edd4]">Prize Name</label>
          <input
            type="text"
            value={formData.prizeName || ""}
            onChange={(e) => handleChange("prizeName", e.target.value)}
            className="h-[48px] px-[16px] bg-[#0d0d0b] border border-[#2d3c13] rounded-[8px] text-[#e8edd4] outline-none focus:border-[#8cb34a]"
          />
        </div>

        <div className="flex flex-col gap-[8px]">
          <label className="font-sans font-medium text-[13px] text-[#e8edd4]">Description</label>
          <textarea
            value={formData.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={4}
            className="p-[16px] bg-[#0d0d0b] border border-[#2d3c13] rounded-[8px] text-[#e8edd4] outline-none focus:border-[#8cb34a]"
          />
        </div>

        {/* Tickets & Pricing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
          <div className="flex flex-col gap-[8px]">
            <label className="font-sans font-medium text-[13px] text-[#e8edd4]">
              Total Tickets {hasSoldTickets && <span className="text-red-400 text-[11px]">(Locked)</span>}
            </label>
            <input
              type="number"
              value={formData.totalTickets || ""}
              onChange={(e) => handleChange("totalTickets", e.target.value)}
              disabled={hasSoldTickets}
              className="h-[48px] px-[16px] bg-[#0d0d0b] border border-[#2d3c13] rounded-[8px] text-[#e8edd4] outline-none focus:border-[#8cb34a] disabled:opacity-50"
            />
          </div>

          <div className="flex flex-col gap-[8px]">
            <label className="font-sans font-medium text-[13px] text-[#e8edd4]">
              Price per Ticket (£) {hasSoldTickets && <span className="text-red-400 text-[11px]">(Locked)</span>}
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.pricePerTicket || ""}
              onChange={(e) => handleChange("pricePerTicket", e.target.value)}
              disabled={hasSoldTickets}
              className="h-[48px] px-[16px] bg-[#0d0d0b] border border-[#2d3c13] rounded-[8px] text-[#e8edd4] outline-none focus:border-[#8cb34a] disabled:opacity-50"
            />
          </div>
        </div>

        {/* Schedule */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
          <div className="flex flex-col gap-[8px]">
            <label className="font-sans font-medium text-[13px] text-[#e8edd4]">Start Date</label>
            <input
              type="datetime-local"
              value={formData.startDate || ""}
              onChange={(e) => handleChange("startDate", e.target.value)}
              className="h-[48px] px-[16px] bg-[#0d0d0b] border border-[#2d3c13] rounded-[8px] text-[#e8edd4] outline-none focus:border-[#8cb34a] [color-scheme:dark]"
            />
          </div>

          <div className="flex flex-col gap-[8px]">
            <label className="font-sans font-medium text-[13px] text-[#e8edd4]">End/Draw Date</label>
            <input
              type="datetime-local"
              value={formData.endDate || ""}
              onChange={(e) => handleChange("endDate", e.target.value)}
              className="h-[48px] px-[16px] bg-[#0d0d0b] border border-[#2d3c13] rounded-[8px] text-[#e8edd4] outline-none focus:border-[#8cb34a] [color-scheme:dark]"
            />
          </div>
        </div>

        {/* Draw Strategy */}
        <div className="flex flex-col gap-[16px] mt-[16px]">
          <div className="flex flex-col gap-[16px] p-[16px] bg-[#0d0d0b] border border-[#2d3c13] rounded-[8px]">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-[4px]">
                <span className="font-sans font-medium text-[14px] text-[#e8edd4]">Automated Draw</span>
                <span className="font-sans font-normal text-[12px] text-[#5a752a]">If disabled, you must manually run the draw.</span>
              </div>
              <div 
                onClick={() => handleChange("isAutoDraw", !formData.isAutoDraw)}
                className={cn(
                  "w-[40px] h-[24px] rounded-full p-[2px] transition-colors duration-200 cursor-pointer shrink-0",
                  formData.isAutoDraw ? "bg-[#8cb34a]" : "bg-[#2d3c13]"
                )}
              >
                <div className={cn(
                  "w-[20px] h-[20px] bg-[#0d0d0b] rounded-full transition-transform duration-200",
                  formData.isAutoDraw ? "translate-x-[16px]" : "translate-x-0"
                )} />
              </div>
            </div>

            {formData.isAutoDraw && (
              <div className="flex flex-col gap-[12px] mt-[8px] pt-[16px] border-t border-[#2d3c13]">
                <label className="flex items-center gap-[12px] cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={formData.autoDrawDate || false}
                    onChange={(e) => handleChange("autoDrawDate", e.target.checked)}
                    className="w-[16px] h-[16px] rounded-[4px] border-[#2d3c13] bg-[#161810] text-[#8cb34a]"
                  />
                  <span className="font-sans text-[13px] text-[#b3b8aa]">Run draw automatically when the Draw Date & Time ends.</span>
                </label>
                <label className="flex items-center gap-[12px] cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={formData.autoDrawSoldOut || false}
                    onChange={(e) => handleChange("autoDrawSoldOut", e.target.checked)}
                    className="w-[16px] h-[16px] rounded-[4px] border-[#2d3c13] bg-[#161810] text-[#8cb34a]"
                  />
                  <span className="font-sans text-[13px] text-[#b3b8aa]">Run draw automatically as soon as all tickets are sold.</span>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-[16px] mt-[24px] pt-[24px] border-t border-[#2d3c13]">
          <button
            type="button"
            onClick={() => router.push("/dashboard/host/competitions")}
            className="px-[24px] h-[48px] rounded-[8px] border border-[#2d3c13] text-[#e8edd4] hover:bg-[#1a230a] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="px-[32px] h-[48px] rounded-[8px] bg-[#8cb34a] text-[#0d0d0b] font-medium hover:bg-[#72943a] transition-colors disabled:opacity-50"
          >
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
