import React from "react";
import WebsiteNavbar from "@/components/website/layout/WebsiteNavbar";
import WebsiteFooter from "@/components/website/layout/WebsiteFooter";

const steps = [
  {
    id: 1,
    title: "Host Onboarding & Creation",
    role: "Host",
    color: "bg-emerald-500",
    textColor: "text-emerald-500",
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
      </svg>
    ),
    description: "Hosts register on the platform and purchase a subscription plan. Once subscribed, they can create a Raffle and set up specific 'Instant Win' tickets.",
    details: [
      "User registers with HOST role.",
      "Purchases a subscription (Transaction recorded).",
      "Creates a new Raffle (Status: PENDING_APPROVAL).",
      "Assigns prizes to specific lucky ticket numbers for Instant Wins."
    ]
  },
  {
    id: 2,
    title: "Admin Moderation & Approval",
    role: "Admin",
    color: "bg-red-500",
    textColor: "text-red-500",
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    description: "Admins review newly created raffles to ensure quality and compliance before making them visible to the public.",
    details: [
      "Admin views PENDING_APPROVAL raffles.",
      "Reviews raffle details, images, and instant win setup.",
      "Approves the raffle (Status updated to ACTIVE).",
      "Raffle is now live on the public website."
    ]
  },
  {
    id: 3,
    title: "Client Ticket Purchase",
    role: "Client",
    color: "bg-blue-500",
    textColor: "text-blue-500",
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    description: "Clients browse active raffles, purchase tickets via secure checkout, and instantly discover if they've won an Instant Win prize.",
    details: [
      "Client selects a raffle and buys tickets via Stripe.",
      "Database generates ticket records and records transaction.",
      "System checks if any purchased ticket matches an Instant Win number.",
      "If matched, winner is recorded immediately in the Winners Gallery."
    ]
  },
  {
    id: 4,
    title: "Main Draw & Host Payouts",
    role: "System / Admin",
    color: "bg-purple-500",
    textColor: "text-purple-500",
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    description: "Once the raffle ends, a fair draw selects the main winner. Meanwhile, Hosts can request to withdraw their earnings.",
    details: [
      "Raffle timer ends or tickets sell out.",
      "Admin triggers secure Random Number Generator (RNG).",
      "Main Winner is selected and displayed globally.",
      "Host requests withdrawal of earnings from their wallet.",
      "Admin approves payout and transfers funds."
    ]
  }
];

export default function OverviewPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <WebsiteNavbar />
      
      <main className="flex-grow py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              Platform Architecture & Flow
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Interactive high-level overview of the Airsoft Draws lifecycle. 
              Understand how Hosts, Admins, and Clients interact with the platform.
            </p>
          </div>

          {/* Timeline Container */}
          <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
            {steps.map((step) => (
              <div key={step.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                
                {/* Timeline Icon */}
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white ${step.color} shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-transform duration-300 group-hover:scale-125`}>
                  {step.icon}
                </div>
                
                {/* Timeline Card */}
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-white shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out cursor-default relative overflow-hidden">
                  
                  {/* Subtle background color hint on hover */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 ${step.color}`}></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-xs font-bold uppercase tracking-wider ${step.textColor} bg-slate-50 px-3 py-1 rounded-full border border-slate-100`}>
                        Step {step.id} • {step.role}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{step.title}</h3>
                    <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                      {step.description}
                    </p>
                    
                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 group-hover:bg-white group-hover:border-slate-200 transition-colors duration-300">
                      <h4 className="text-xs font-bold text-slate-900 uppercase mb-3 tracking-wider flex items-center">
                        <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                        </svg>
                        Database & System Actions
                      </h4>
                      <ul className="space-y-2.5">
                        {step.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start text-sm text-slate-700">
                            <svg className={`w-4 h-4 ${step.textColor} mr-2 mt-0.5 shrink-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </main>
      
      <WebsiteFooter />
    </div>
  );
}
