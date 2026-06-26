"use client";

import React, { useState } from "react";
import HostAuthLayout from "../../../components/host-auth/HostAuthLayout";
import HostRegistrationForm from "../../../components/host-auth/HostRegistrationForm";
import { HostRegistrationStep } from "../../../types/host-auth.types";

/**
 * Host Registration Wizard Page.
 * Manages the active step state and coordinates between Layout Stepper and Form Wizard.
 */
export default function HostRegisterPage() {
  const [step, setStep] = useState<HostRegistrationStep>(1);

  return (
    <HostAuthLayout mode="register" currentStep={step}>
      <HostRegistrationForm step={step} onChangeStep={setStep} />
    </HostAuthLayout>
  );
}
