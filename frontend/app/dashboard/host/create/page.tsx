import React from "react";
import CreateRaffleWizard from "../../../../components/dashboard/host/create/CreateRaffleWizard";

export const metadata = {
  title: "Create New Raffle | Host Dashboard",
};

export default function CreateRafflePage() {
  return (
    <div className="flex-1 w-full px-[20px] lg:px-[40px] py-[24px] lg:py-[32px] flex justify-center">
      <div className="w-full max-w-[800px]">
        <CreateRaffleWizard />
      </div>
    </div>
  );
}
