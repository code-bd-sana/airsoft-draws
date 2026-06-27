"use client";

import React, { useState } from "react";
import CreateRaffleStepper from "./CreateRaffleStepper";
import CreateRaffleStep1 from "./CreateRaffleStep1";
import CreateRaffleStep2 from "./CreateRaffleStep2";
import CreateRaffleStep3 from "./CreateRaffleStep3";
import CreateRaffleStep4 from "./CreateRaffleStep4";
import CreateRaffleStep5 from "./CreateRaffleStep5";
import { useRouter } from "next/navigation";

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
  // Step 4
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
  startDate: "",
  endDate: "",
  autoDraw: true,
  guaranteedDraw: false,
};

export default function CreateRaffleWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<RaffleFormData>(initialData);
  const router = useRouter();

  const updateForm = (data: Partial<RaffleFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => setCurrentStep((p) => Math.min(p + 1, 5));
  const prevStep = () => setCurrentStep((p) => Math.max(p - 1, 1));
  
  const handlePublish = () => {
    // In a real app, API call goes here
    alert("Raffle Published Successfully!");
    router.push("/dashboard/host/competitions");
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full px-[10px] md:px-[20px]">
        <CreateRaffleStepper currentStep={currentStep} totalSteps={5} />
      </div>

      <div className="w-full bg-[#161810] border border-[#2d3c13] rounded-[16px] p-[32px] mt-[16px]">
        {currentStep === 1 && (
          <CreateRaffleStep1 formData={formData} updateForm={updateForm} onNext={nextStep} />
        )}
        {currentStep === 2 && (
          <CreateRaffleStep2 formData={formData} updateForm={updateForm} onNext={nextStep} onPrev={prevStep} />
        )}
        {currentStep === 3 && (
          <CreateRaffleStep3 formData={formData} updateForm={updateForm} onNext={nextStep} onPrev={prevStep} />
        )}
        {currentStep === 4 && (
          <CreateRaffleStep4 formData={formData} updateForm={updateForm} onNext={nextStep} onPrev={prevStep} />
        )}
        {currentStep === 5 && (
          <CreateRaffleStep5 formData={formData} onPublish={handlePublish} onPrev={prevStep} />
        )}
      </div>
    </div>
  );
}
