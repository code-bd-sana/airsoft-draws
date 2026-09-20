"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useGetRaffleById, useUpdateRaffle, useUploadRaffleImage } from "../../../../hooks/useRaffleHooks";
import { usePublicCategories } from "../../../../hooks/useCategoryHooks";
import { cn, extractApiError, toUkDateTimeLocalString, ukDateTimeLocalToIso } from "../../../../lib/utils";
import { toast } from "sonner";

interface Props {
  raffleId: string;
}

export default function EditRaffleForm({ raffleId }: Props) {
  const router = useRouter();
  const { data: raffle, isLoading } = useGetRaffleById(raffleId);
  const { data: categories = [], isLoading: isCategoriesLoading } = usePublicCategories();
  const updateMutation = useUpdateRaffle();
  const uploadImageMutation = useUploadRaffleImage();

  const [formData, setFormData] = useState<any>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (raffle) {
      setFormData({
        title: raffle.title || "",
        prizeName: raffle.prizeName || "",
        category: (raffle as any).category || "",
        prizeClassification: (raffle as any).prizeClassification || "RIF",
        mainPrizeValue: (raffle as any).mainPrizeValue || "",
        description: raffle.description || "",
        totalTickets: raffle.totalTickets || "",
        pricePerTicket: raffle.pricePerTicket || "",
        startDate: raffle.startDate ? toUkDateTimeLocalString(raffle.startDate) : "",
        endDate: raffle.endDate ? toUkDateTimeLocalString(raffle.endDate) : "",
        isAutoDraw: raffle.isAutoDraw ?? true,
        autoDrawDate: raffle.autoDrawDate ?? true,
        autoDrawSoldOut: raffle.autoDrawSoldOut ?? false,
        minTickets: (raffle as any).minTickets || 1,
        maxTickets: (raffle as any).maxTickets || "",
      });

      if (raffle.mainImage) {
        setImagePreview(raffle.mainImage);
      }
    }
  }, [raffle]);

  const hasSoldTickets = (raffle?.ticketsSold ?? 0) > 0;

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image file size must be less than 5MB");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleClearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageFile(null);
    setImagePreview(null);
    setFormData((prev: any) => ({ ...prev, mainImage: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload: any = { ...formData };
      
      // Convert dates to UK ISO string
      if (payload.startDate) payload.startDate = ukDateTimeLocalToIso(payload.startDate);
      if (payload.endDate) payload.endDate = ukDateTimeLocalToIso(payload.endDate);
      
      // Convert numbers
      if (payload.totalTickets) payload.totalTickets = Number(payload.totalTickets);
      if (payload.pricePerTicket) payload.pricePerTicket = Number(payload.pricePerTicket);
      if (payload.minTickets) payload.minTickets = Number(payload.minTickets);
      if (payload.maxTickets !== undefined && payload.maxTickets !== "") payload.maxTickets = Number(payload.maxTickets);
      else if (payload.maxTickets === "") payload.maxTickets = null;

      if (payload.mainPrizeValue !== undefined && payload.mainPrizeValue !== "") payload.mainPrizeValue = Number(payload.mainPrizeValue);
      else if (payload.mainPrizeValue === "") payload.mainPrizeValue = null;

      // Handle removed image
      if (!imagePreview && !imageFile) {
        payload.mainImage = null;
      }

      await updateMutation.mutateAsync({ id: raffleId, data: payload });

      // If new image file is chosen, upload it
      if (imageFile) {
        await uploadImageMutation.mutateAsync({ id: raffleId, file: imageFile });
      }

      toast.success("Competition updated successfully!");
      router.push("/dashboard/host/competitions");
    } catch (err: any) {
      toast.error(extractApiError(err, "Failed to update competition."));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="text-[#a0d056]">Loading competition data...</div>;
  }

  if (!raffle) {
    return <div className="text-red-500">Competition not found.</div>;
  }

  const isSaving = isSubmitting || updateMutation.isPending || uploadImageMutation.isPending;

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
          <div className="flex flex-col gap-[8px]">
            <label className="font-sans font-medium text-[13px] text-[#e8edd4]">Prize Name</label>
            <input
              type="text"
              value={formData.prizeName || ""}
              onChange={(e) => handleChange("prizeName", e.target.value)}
              placeholder="e.g. Tokyo Marui MWS GBB"
              className="h-[48px] px-[16px] bg-[#0d0d0b] border border-[#2d3c13] rounded-[8px] text-[#e8edd4] outline-none focus:border-[#8cb34a]"
            />
          </div>

          <div className="flex flex-col gap-[8px]">
            <label className="font-sans font-medium text-[13px] text-[#e8edd4]">Prize Valuation (£)</label>
            <input
              type="number"
              step="0.01"
              value={formData.mainPrizeValue || ""}
              onChange={(e) => handleChange("mainPrizeValue", e.target.value)}
              placeholder="e.g. 650.00"
              className="h-[48px] px-[16px] bg-[#0d0d0b] border border-[#2d3c13] rounded-[8px] text-[#e8edd4] outline-none focus:border-[#8cb34a]"
            />
          </div>
        </div>

        {/* Category & Classification */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
          <div className="flex flex-col gap-[8px]">
            <div className="flex items-center justify-between">
              <label className="font-sans font-medium text-[13px] text-[#e8edd4]">Category</label>
              {isCategoriesLoading && (
                <span className="font-sans text-[11px] text-[#8cb34a] animate-pulse">Loading categories...</span>
              )}
            </div>
            <div className="relative">
              <select
                value={formData.category || ""}
                onChange={(e) => handleChange("category", e.target.value)}
                disabled={isCategoriesLoading}
                className="w-full h-[48px] px-[16px] bg-[#0d0d0b] border border-[#2d3c13] rounded-[8px] text-[#e8edd4] outline-none focus:border-[#8cb34a] appearance-none cursor-pointer disabled:opacity-50"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id || cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
                {formData.category && !categories.some((c) => c.name === formData.category) && (
                  <option value={formData.category}>{formData.category}</option>
                )}
              </select>
              <svg
                className="w-5 h-5 text-[#5a752a] absolute right-[16px] top-1/2 -translate-y-1/2 pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
          </div>

          <div className="flex flex-col gap-[8px]">
            <label className="font-sans font-medium text-[13px] text-[#e8edd4]">Prize Classification</label>
            <div className="relative">
              <select
                value={formData.prizeClassification || "RIF"}
                onChange={(e) => handleChange("prizeClassification", e.target.value)}
                className="w-full h-[48px] px-[16px] bg-[#0d0d0b] border border-[#2d3c13] rounded-[8px] text-[#e8edd4] outline-none focus:border-[#8cb34a] appearance-none cursor-pointer"
              >
                <option value="RIF">RIF (Realistic Imitation Firearm - UKARA required)</option>
                <option value="TWO_TONE_IF">TWO TONE IF (18+ only, No UKARA required)</option>
                <option value="ACCESSORY">ACCESSORY (Optics, Apparel, Gear, etc.)</option>
              </select>
              <svg
                className="w-5 h-5 text-[#5a752a] absolute right-[16px] top-1/2 -translate-y-1/2 pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
          </div>
        </div>

        {/* Cover Image Upload & Preview */}
        <div className="flex flex-col gap-[8px]">
          <label className="font-sans font-medium text-[13px] text-[#e8edd4]">
            Cover Image
          </label>
          <div 
            onClick={!imagePreview ? () => fileInputRef.current?.click() : undefined}
            className={`w-full h-[240px] border-2 border-dashed rounded-[16px] flex flex-col items-center justify-center transition-colors relative overflow-hidden group ${
              imagePreview 
                ? "border-[#2d3c13] bg-[#0d0d0b]" 
                : "border-[#2d3c13] hover:border-[#8cb34a] hover:bg-[#1a230a]/50 cursor-pointer bg-[#0d0d0b]"
            }`}
          >
            {imagePreview ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={imagePreview} 
                  alt="Cover preview" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-[40px] px-[16px] bg-[#8cb34a] text-[#0d0d0b] font-sans font-medium text-[13px] rounded-[8px] hover:bg-[#72943a] transition-colors cursor-pointer"
                  >
                    Change Image
                  </button>
                  <button 
                    type="button"
                    onClick={handleClearImage}
                    className="h-[40px] px-[16px] bg-[#f76b6b] text-white font-sans font-medium text-[13px] rounded-[8px] hover:bg-[#ef4444] transition-colors cursor-pointer"
                  >
                    Remove Image
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="w-[48px] h-[48px] rounded-full bg-[#1a230a] flex items-center justify-center mb-[16px]">
                  <svg className="w-6 h-6 text-[#8cb34a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                  </svg>
                </div>
                <span className="font-sans font-medium text-[14px] text-[#e8edd4]">
                  Click to upload cover image
                </span>
                <span className="font-sans font-normal text-[12px] text-[#5a752a] mt-1">
                  JPG, JPEG, PNG, or WEBP (Max 5MB)
                </span>
              </>
            )}
            <input 
              type="file" 
              accept="image/jpeg,image/jpg,image/png,image/webp" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
            />
          </div>
        </div>

        {/* Description */}
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
              Total Tickets {hasSoldTickets && <span className="text-red-400 text-[11px]">(Locked: tickets already sold)</span>}
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
              Price per Ticket (£) {hasSoldTickets && <span className="text-red-400 text-[11px]">(Locked: tickets already sold)</span>}
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

        {/* Entrant Limits: Minimum & Maximum Tickets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
          <div className="flex flex-col gap-[8px]">
            <label className="font-sans font-medium text-[13px] text-[#e8edd4]">
              Minimum Tickets Per Order
            </label>
            <input
              type="number"
              min="1"
              value={formData.minTickets || ""}
              onChange={(e) => handleChange("minTickets", e.target.value)}
              placeholder="e.g. 1"
              className="h-[48px] px-[16px] bg-[#0d0d0b] border border-[#2d3c13] rounded-[8px] text-[#e8edd4] outline-none focus:border-[#8cb34a]"
            />
          </div>

          <div className="flex flex-col gap-[8px]">
            <label className="font-sans font-medium text-[13px] text-[#e8edd4]">
              Maximum Tickets Per Entrant (Optional)
            </label>
            <input
              type="number"
              min="1"
              value={formData.maxTickets || ""}
              onChange={(e) => handleChange("maxTickets", e.target.value)}
              placeholder="e.g. 25 (blank = unlimited)"
              className="h-[48px] px-[16px] bg-[#0d0d0b] border border-[#2d3c13] rounded-[8px] text-[#e8edd4] outline-none focus:border-[#8cb34a]"
            />
          </div>
        </div>

        {/* Schedule */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
          <div className="flex flex-col gap-[8px]">
            <label className="font-sans font-medium text-[13px] text-[#e8edd4]">Start Date & Time (UK Time)</label>
            <input
              type="datetime-local"
              value={formData.startDate || ""}
              onChange={(e) => handleChange("startDate", e.target.value)}
              className="h-[48px] px-[16px] bg-[#0d0d0b] border border-[#2d3c13] rounded-[8px] text-[#e8edd4] outline-none focus:border-[#8cb34a] [color-scheme:dark]"
            />
          </div>

          <div className="flex flex-col gap-[8px]">
            <label className="font-sans font-medium text-[13px] text-[#e8edd4]">Draw Date & Time (UK Time)</label>
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
                <span className="font-sans font-medium text-[14px] text-[#e8edd4]">Draw Type</span>
                <span className="font-sans font-normal text-[12px] text-[#5a752a]">How will the winner be selected?</span>
              </div>
            </div>

            <div className="flex flex-col gap-[12px] mt-[8px] pt-[16px] border-t border-[#2d3c13]">
              <label className="flex items-start gap-[12px] cursor-pointer">
                <input 
                  type="radio"
                  name="drawType"
                  checked={!formData.isAutoDraw}
                  onChange={() => setFormData((prev: any) => ({ ...prev, isAutoDraw: false, autoDrawDate: false, autoDrawSoldOut: false }))}
                  className="mt-1 w-[16px] h-[16px] rounded-full border-[#2d3c13] bg-[#161810] text-[#8cb34a] focus:ring-[#8cb34a]"
                />
                <div className="flex flex-col gap-1">
                  <span className="font-sans font-medium text-[14px] text-[#e8edd4]">Live Draw</span>
                  <span className="font-sans font-normal text-[12px] text-[#b3b8aa]">You will manually run the draw from your dashboard (e.g., live on Instagram).</span>
                </div>
              </label>

              <label className="flex items-start gap-[12px] cursor-pointer">
                <input 
                  type="radio"
                  name="drawType"
                  checked={formData.isAutoDraw}
                  onChange={() => setFormData((prev: any) => ({ ...prev, isAutoDraw: true, autoDrawDate: true, autoDrawSoldOut: true }))}
                  className="mt-1 w-[16px] h-[16px] rounded-full border-[#2d3c13] bg-[#161810] text-[#8cb34a] focus:ring-[#8cb34a]"
                />
                <div className="flex flex-col gap-1">
                  <span className="font-sans font-medium text-[14px] text-[#e8edd4]">Automatic Draw</span>
                  <span className="font-sans font-normal text-[12px] text-[#b3b8aa]">System automatically draws a winner when all tickets are sold out OR the end time expires.</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-[16px] mt-[24px] pt-[24px] border-t border-[#2d3c13]">
          <button
            type="button"
            onClick={() => router.push("/dashboard/host/competitions")}
            className="px-[24px] h-[48px] rounded-[8px] border border-[#2d3c13] text-[#e8edd4] hover:bg-[#1a230a] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-[32px] h-[48px] rounded-[8px] bg-[#8cb34a] text-[#0d0d0b] font-medium hover:bg-[#72943a] transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
