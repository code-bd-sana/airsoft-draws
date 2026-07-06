"use client";

import React, { useState } from "react";
import CreateRaffleStepper from "./CreateRaffleStepper";
import CreateRaffleStep1 from "./CreateRaffleStep1";
import CreateRaffleStep2 from "./CreateRaffleStep2";
import CreateRaffleStep3 from "./CreateRaffleStep3";
import CreateRaffleStep4 from "./CreateRaffleStep4";
import CreateRaffleStep5 from "./CreateRaffleStep5";
import CreateRaffleStep6 from "./CreateRaffleStep6";
import { useRouter } from "next/navigation";
import { useMySubscription } from "../../../../hooks/useSubscriptionHooks";
import { useCreateRaffle, useUploadRaffleImage } from "../../../../hooks/useRaffleHooks";

export interface RaffleFormData {
  // Step 1
  title: string;
  category: string;
  description: string;
  // Step 2
  totalTickets: string;
  ticketPrice: string;
  minTickets: string;
  // Step 3
  coverImage: string | null; // URL or mock path
  gallery: string[];
  // Step 4 (Instant Wins)
  hasInstantWins: boolean;
  instantWins: { prizeName: string; imageFile: File | null; imageUrl: string | null }[];
  // Step 5
  startDate: string;
  endDate: string;
  autoDraw: boolean;
  guaranteedDraw: boolean;
}

const initialData: RaffleFormData = {
  title: "",
  category: "Airsoft Rifles",
  description: "",
  totalTickets: "",
  ticketPrice: "",
  minTickets: "1",
  coverImage: null,
  gallery: [],
  hasInstantWins: false,
  instantWins: [],
  startDate: "",
  endDate: "",
  autoDraw: true,
  guaranteedDraw: false,
};

export default function CreateRaffleWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<RaffleFormData>(initialData);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const router = useRouter();

  const { data: mySub, isLoading: isSubLoading } = useMySubscription();
  const createRaffle = useCreateRaffle();
  const uploadImage = useUploadRaffleImage();

  const updateForm = (data: Partial<RaffleFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => setCurrentStep((p) => Math.min(p + 1, 6));
  const prevStep = () => setCurrentStep((p) => Math.max(p - 1, 1));
  
  const handlePublish = async () => {
    try {
      // 1. Upload instant win images first
      const processedInstantWins = [];
      for (const iw of formData.instantWins) {
        if (iw.imageFile) {
          const res = await fetch('/api/v1/raffles/image', {
            method: 'POST',
            body: (() => {
              const fd = new FormData();
              fd.append('file', iw.imageFile);
              return fd;
            })(),
            headers: {
              Authorization: `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1")}`
            }
          });
          if (res.ok) {
            const data = await res.json();
            processedInstantWins.push({ prizeName: iw.prizeName, image: data.url });
          } else {
            processedInstantWins.push({ prizeName: iw.prizeName, image: iw.imageUrl });
          }
        } else {
          processedInstantWins.push({ prizeName: iw.prizeName, image: iw.imageUrl });
        }
      }

      // 2. Create Raffle
      const created = await createRaffle.mutateAsync({
        title: formData.title,
        description: formData.description,
        ticketPrice: formData.ticketPrice,
        totalTickets: formData.totalTickets,
        startDate: formData.startDate,
        endDate: formData.endDate,
        instantWins: formData.hasInstantWins ? processedInstantWins : [],
      });

      // 3. Upload main image if exists
      if (imageFile && created.id) {
        await uploadImage.mutateAsync({ id: created.id, file: imageFile });
      }

      alert("Competition Created and Pending Approval!");
      router.push("/dashboard/host/competitions");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to create competition");
    }
  };

  if (isSubLoading) return <div className="text-white p-8">Checking subscription...</div>;

  if (!mySub || mySub.status !== 'ACTIVE') {
    return (
      <div className="w-full bg-[#161810] border border-[#2d3c13] rounded-[16px] p-[32px] text-center">
        <h2 className="text-[#f76b6b] text-xl mb-4">Active Subscription Required</h2>
        <p className="text-[#e8edd4] mb-6">You must have an active subscription to create a competition.</p>
        <button onClick={() => router.push('/dashboard/host/billing')} className="px-6 py-2 bg-[#8cb34a] text-black rounded-lg">View Plans</button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full px-[10px] md:px-[20px]">
        <CreateRaffleStepper currentStep={currentStep} totalSteps={6} />
      </div>

      <div className="w-full bg-[#161810] border border-[#2d3c13] rounded-[16px] p-[32px] mt-[16px]">
        {currentStep === 1 && (
          <CreateRaffleStep1 formData={formData} updateForm={updateForm} onNext={nextStep} />
        )}
        {currentStep === 2 && (
          <CreateRaffleStep2 formData={formData} updateForm={updateForm} onNext={nextStep} onPrev={prevStep} />
        )}
        {currentStep === 3 && (
          <CreateRaffleStep3 formData={formData} updateForm={updateForm} onNext={nextStep} onPrev={prevStep} setImageFile={setImageFile} />
        )}
        {currentStep === 4 && (
          <CreateRaffleStep4 formData={formData} updateForm={updateForm} onNext={nextStep} onPrev={prevStep} />
        )}
        {currentStep === 5 && (
          <CreateRaffleStep5 formData={formData} updateForm={updateForm} onNext={nextStep} onPrev={prevStep} />
        )}
        {currentStep === 6 && (
          <CreateRaffleStep6 formData={formData} onPublish={handlePublish} onPrev={prevStep} />
        )}
      </div>
    </div>
  );
}
