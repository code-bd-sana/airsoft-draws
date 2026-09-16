"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import WebsiteNavbar from "../../components/website/layout/WebsiteNavbar";
import WebsiteFooter from "../../components/website/layout/WebsiteFooter";
import { useBasket } from "../../features/basket/BasketContext";
import { useAuthUser } from "../../hooks/useAuthHooks";
import { api } from "../../services/api";

export function calculateAgeFromDob(dobStr: string): number | null {
  if (!dobStr) return null;
  const dob = new Date(dobStr);
  if (isNaN(dob.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

interface PurchaseResult {
  message: string;
  transaction: any;
  tickets: Array<{
    id: string;
    ticketNumber: number;
    raffleId: string;
  }>;
  instantWins: Array<{
    id: string;
    prizeName: string;
    ticketNumber: number;
    raffleTitle?: string;
  }>;
  totalAmount: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { data: user, isLoading: isUserLoading } = useAuthUser();
  const {
    items,
    itemCount,
    ticketCount,
    totalAmount,
    hasRifItems,
    isHydrated,
    clearBasket,
  } = useBasket();

  // Contact Information Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");

  // Shipping Address Form State
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("United Kingdom");

  // Legal & Compliance State
  const [ukara, setUkara] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [saveToProfile, setSaveToProfile] = useState(true);

  // Submission & Results State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [purchaseResult, setPurchaseResult] = useState<PurchaseResult | null>(null);

  // Pre-fill fields from authenticated user
  useEffect(() => {
    if (user) {
      if (!firstName && user.firstName) setFirstName(user.firstName);
      if (!lastName && user.lastName) setLastName(user.lastName);
      if (!email && user.email) setEmail(user.email);
      if (!phone && (user.phone || (user as any).hostProfile?.phone)) {
        setPhone(user.phone || (user as any).hostProfile?.phone || "");
      }
      if (!dob && (user as any).dateOfBirth) {
        setDob(String((user as any).dateOfBirth).slice(0, 10));
      }
      if (!ukara && (user as any).ukaraNumber) {
        setUkara((user as any).ukaraNumber);
      }
      if (!addressLine1 && user.address) {
        const parts = user.address.split(",").map((s: string) => s.trim());
        if (parts.length > 0) setAddressLine1(parts[0]);
        if (parts.length > 2) setCity(parts[parts.length - 2]);
      }
      if (!city && user.location) {
        const locParts = user.location.split(",").map((s: string) => s.trim());
        if (locParts.length > 0) setCity(locParts[0]);
      }
    }
  }, [user, firstName, lastName, email, phone, dob, ukara, addressLine1, city]);

  const calculatedAge = calculateAgeFromDob(dob);
  const isUnder18 = calculatedAge !== null && calculatedAge < 18;
  const isValidAge = calculatedAge !== null && calculatedAge >= 18;

  const isFormValid =
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    email.trim().length > 0 &&
    phone.trim().length > 0 &&
    isValidAge &&
    addressLine1.trim().length > 0 &&
    city.trim().length > 0 &&
    postalCode.trim().length > 0 &&
    country.trim().length > 0 &&
    (!hasRifItems || ukara.trim().length > 0) &&
    acceptedTerms;

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setErrorMessage("Please log in or register an account to complete checkout.");
      return;
    }
    if (!isFormValid || isSubmitting) return;

    for (const item of items) {
      if (item.minTickets && item.quantity < item.minTickets) {
        setErrorMessage(`"${item.title}" requires a minimum of ${item.minTickets} tickets.`);
        return;
      }
      if (item.maxTickets && item.quantity > item.maxTickets) {
        setErrorMessage(`"${item.title}" allows a maximum of ${item.maxTickets} tickets per person.`);
        return;
      }
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const payload = {
      items: items.map((item) => ({
        raffleId: item.raffleId,
        quantity: item.quantity,
      })),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      dateOfBirth: dob,
      shippingAddress: {
        addressLine1: addressLine1.trim(),
        addressLine2: addressLine2.trim() || undefined,
        city: city.trim(),
        postalCode: postalCode.trim().toUpperCase(),
        country: country.trim(),
      },
      ukaraNumber: hasRifItems ? ukara.trim() : undefined,
      acceptedTerms,
      saveToProfile,
    };

    try {
      const response = await api.post("/tickets/checkout", payload);
      const data = response.data;

      // If Cashflows gateway redirect URL is present
      if (data?.url) {
        window.location.href = data.url;
        return;
      }

      // Simulated or immediate confirmation
      setPurchaseResult({
        message: data.message || "Order completed successfully",
        transaction: data.transaction,
        tickets: data.tickets || [],
        instantWins: data.instantWins || [],
        totalAmount: data.totalAmount || totalAmount,
      });

      // Clear basket after successful purchase
      clearBasket();
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Failed to process checkout. Please review your details and try again.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <WebsiteNavbar />

      <main className="min-h-screen bg-[#0D0D0B] text-[#E8EDD4] pt-28 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col gap-8">
          
          {/* Post-Purchase Order Confirmation View */}
          {purchaseResult ? (
            <div className="bg-[#111210] border border-[#8CB34A] rounded-2xl p-6 sm:p-10 shadow-[0_0_40px_rgba(140,179,74,0.2)] flex flex-col gap-8 animate-in fade-in zoom-in-95 duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2D3C13] pb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#1A230A] border border-[#8CB34A] flex items-center justify-center text-[#8CB34A] text-2xl shadow-[0_0_20px_rgba(140,179,74,0.3)]">
                    ✓
                  </div>
                  <div>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#1A230A] text-[#8CB34A] border border-[#8CB34A]/40">
                      Payment Confirmed
                    </span>
                    <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[#E8EDD4] mt-1">
                      Tickets Successfully Allocated!
                    </h1>
                    <p className="font-sans text-xs text-[#72943A]">
                      Confirmation receipt sent to{" "}
                      <strong className="text-[#E8EDD4]">{email}</strong>
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="font-sans text-xs text-[#72943A]">Total Paid</span>
                  <div className="font-heading font-bold text-2xl text-[#8CB34A]">
                    £{purchaseResult.totalAmount.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Instant Wins Celebration Banner */}
              {purchaseResult.instantWins && purchaseResult.instantWins.length > 0 && (
                <div className="bg-gradient-to-r from-amber-950/60 via-amber-900/40 to-amber-950/60 border border-amber-600 rounded-xl p-5 shadow-[0_0_25px_rgba(217,119,6,0.25)] flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🎉</span>
                    <h3 className="font-heading font-bold text-lg text-amber-300">
                      Congratulations! You Won Instant Win Prize(s)!
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {purchaseResult.instantWins.map((iw, idx) => (
                      <div
                        key={idx}
                        className="bg-[#0D0D0B] border border-amber-800/80 p-3 rounded-lg flex items-center justify-between"
                      >
                        <div>
                          <div className="font-heading font-semibold text-sm text-amber-200">
                            {iw.prizeName}
                          </div>
                          {iw.ticketNumber && (
                            <div className="font-sans text-xs text-amber-400">
                              Winning Ticket: #{iw.ticketNumber}
                            </div>
                          )}
                        </div>
                        <span className="px-2 py-0.5 bg-amber-400 text-black text-[10px] font-bold rounded-md uppercase">
                          Claimed
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="font-sans text-xs text-amber-300/80 mt-1">
                    Our team will verify your details and coordinate tracked delivery. You can check status in your dashboard.
                  </p>
                </div>
              )}

              {/* Allocated Tickets List */}
              <div className="flex flex-col gap-4">
                <h3 className="font-heading font-bold text-lg text-[#E8EDD4]">
                  Allocated Ticket Numbers ({purchaseResult.tickets.length})
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-8 gap-2.5">
                  {purchaseResult.tickets.map((t, idx) => (
                    <div
                      key={idx}
                      className="bg-[#0D0D0B] border border-[#2D3C13] rounded-lg p-2.5 text-center font-heading font-bold text-sm text-[#8CB34A]"
                    >
                      #{t.ticketNumber}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-[#2D3C13]">
                <Link
                  href="/dashboard/user/tickets"
                  className="w-full sm:w-auto h-12 px-8 bg-[#8CB34A] hover:bg-[#A0D056] text-[#0D0D0B] font-heading font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(140,179,74,0.2)]"
                >
                  View My Tickets Dashboard →
                </Link>
                <Link
                  href="/live-raffles"
                  className="w-full sm:w-auto h-12 px-6 bg-transparent border border-[#2D3C13] hover:bg-[#1A230A] text-[#72943A] hover:text-[#E8EDD4] font-sans font-medium text-xs rounded-lg transition-colors flex items-center justify-center"
                >
                  Browse More Competitions
                </Link>
              </div>
            </div>
          ) : isHydrated && items.length === 0 ? (
            /* Empty Basket on Checkout */
            <div className="bg-[#111210] border border-[#2D3C13] rounded-2xl p-12 text-center flex flex-col items-center gap-5 max-w-xl mx-auto shadow-xl">
              <h3 className="font-heading font-bold text-xl text-[#E8EDD4]">
                No Items in Basket
              </h3>
              <p className="font-sans text-xs text-[#72943A]">
                You need to add competition tickets to your basket before proceeding to checkout.
              </p>
              <Link
                href="/live-raffles"
                className="h-11 px-6 bg-[#8CB34A] hover:bg-[#A0D056] text-[#0D0D0B] font-heading font-semibold text-sm rounded-lg transition-colors flex items-center gap-2"
              >
                Browse Live Raffles →
              </Link>
            </div>
          ) : (
            /* Standard Two-Column Checkout Form */
            <form onSubmit={handleCheckoutSubmit} className="flex flex-col gap-8">
              
              {/* Checkout Title */}
              <div>
                <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[#E8EDD4]">
                  Competition Checkout
                </h1>
                <p className="font-sans text-xs sm:text-sm text-[#72943A] mt-1">
                  Complete your contact details, delivery address, and statutory verification
                </p>
              </div>

              {/* Unauthenticated User Banner */}
              {!user && !isUserLoading && (
                <div className="bg-[#161810] border border-[#8CB34A]/50 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🔑</span>
                    <div>
                      <h4 className="font-heading font-bold text-sm text-[#E8EDD4]">
                        Already have an Airsoft Draws account?
                      </h4>
                      <p className="font-sans text-xs text-[#72943A]">
                        Log in to automatically load your saved delivery details and streamline checkout.
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/login?redirect=/checkout"
                    className="h-9 px-4 bg-[#8CB34A] hover:bg-[#A0D056] text-[#0D0D0B] font-heading font-semibold text-xs rounded-lg transition-colors flex items-center justify-center shrink-0"
                  >
                    Log In →
                  </Link>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Column: Form Inputs */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                  
                  {/* Step 1: Contact Information */}
                  <div className="bg-[#111210] border border-[#2D3C13] rounded-2xl p-6 flex flex-col gap-5">
                    <div className="flex items-center gap-2.5 border-b border-[#2D3C13] pb-3">
                      <span className="w-6 h-6 rounded-full bg-[#1A230A] border border-[#8CB34A] text-[#8CB34A] font-heading font-bold text-xs flex items-center justify-center">
                        1
                      </span>
                      <h3 className="font-heading font-bold text-base text-[#E8EDD4]">
                        Contact Information
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="font-sans font-medium text-xs text-[#E8EDD4]">
                          First Name <span className="text-[#F76B6B]">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="e.g. Jade"
                          className="h-11 px-3.5 bg-[#0D0D0B] border border-[#2D3C13] rounded-lg font-sans text-sm text-[#E8EDD4] focus:border-[#8CB34A] outline-none transition-colors"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="font-sans font-medium text-xs text-[#E8EDD4]">
                          Last Name <span className="text-[#F76B6B]">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="e.g. Weeks"
                          className="h-11 px-3.5 bg-[#0D0D0B] border border-[#2D3C13] rounded-lg font-sans text-sm text-[#E8EDD4] focus:border-[#8CB34A] outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="font-sans font-medium text-xs text-[#E8EDD4]">
                          Email Address (Ticket Confirmation) <span className="text-[#F76B6B]">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. sd.rakib36@gmail.com"
                          className="h-11 px-3.5 bg-[#0D0D0B] border border-[#2D3C13] rounded-lg font-sans text-sm text-[#E8EDD4] focus:border-[#8CB34A] outline-none transition-colors"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="font-sans font-medium text-xs text-[#E8EDD4]">
                          Contact Phone (Delivery Notifications) <span className="text-[#F76B6B]">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="e.g. +1 (216) 688-7637"
                          className="h-11 px-3.5 bg-[#0D0D0B] border border-[#2D3C13] rounded-lg font-sans text-sm text-[#E8EDD4] focus:border-[#8CB34A] outline-none transition-colors"
                        />
                      </div>
                    </div>

                    {/* Date of Birth 18+ check */}
                    <div className="flex flex-col gap-2 pt-2 border-t border-[#2D3C13]/50">
                      <div className="flex items-center justify-between">
                        <label className="font-sans font-medium text-xs text-[#E8EDD4]">
                          Date of Birth (18+ Only) <span className="text-[#F76B6B]">*</span>
                        </label>
                        {calculatedAge !== null && (
                          <span
                            className={
                              isValidAge
                                ? "text-[#8CB34A] text-xs font-semibold"
                                : "text-[#F76B6B] text-xs font-semibold"
                            }
                          >
                            Age: {calculatedAge} {isValidAge ? "(Verified 18+)" : "(Under 18 Blocked)"}
                          </span>
                        )}
                      </div>
                      <input
                        type="date"
                        required
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="h-11 px-3.5 bg-[#0D0D0B] border border-[#2D3C13] rounded-lg font-sans text-sm text-[#E8EDD4] focus:border-[#8CB34A] outline-none transition-colors"
                      />
                      <p className="font-sans text-[11px] text-[#72943A]">
                        You must be 18 years or older to participate. Automatically saved to your profile.
                      </p>
                      {isUnder18 && (
                        <p className="font-sans text-xs text-[#F76B6B] bg-red-950/40 border border-red-900/80 p-2.5 rounded-lg">
                          ⚠️ Under UK law (VCRA 2006), participants must be 18 years or older. You cannot proceed with checkout.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Step 2: Prize Shipping Address */}
                  <div className="bg-[#111210] border border-[#2D3C13] rounded-2xl p-6 flex flex-col gap-5">
                    <div className="flex items-center gap-2.5 border-b border-[#2D3C13] pb-3">
                      <span className="w-6 h-6 rounded-full bg-[#1A230A] border border-[#8CB34A] text-[#8CB34A] font-heading font-bold text-xs flex items-center justify-center">
                        2
                      </span>
                      <h3 className="font-heading font-bold text-base text-[#E8EDD4]">
                        Prize Shipping Address
                      </h3>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-sans font-medium text-xs text-[#E8EDD4]">
                        Address Line 1 <span className="text-[#F76B6B]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={addressLine1}
                        onChange={(e) => setAddressLine1(e.target.value)}
                        placeholder="e.g. 573 South Oak Lane"
                        className="h-11 px-3.5 bg-[#0D0D0B] border border-[#2D3C13] rounded-lg font-sans text-sm text-[#E8EDD4] focus:border-[#8CB34A] outline-none transition-colors"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-sans font-medium text-xs text-[#E8EDD4]">
                        Address Line 2 (Optional)
                      </label>
                      <input
                        type="text"
                        value={addressLine2}
                        onChange={(e) => setAddressLine2(e.target.value)}
                        placeholder="Apartment, suite, unit, building floor"
                        className="h-11 px-3.5 bg-[#0D0D0B] border border-[#2D3C13] rounded-lg font-sans text-sm text-[#E8EDD4] focus:border-[#8CB34A] outline-none transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="font-sans font-medium text-xs text-[#E8EDD4]">
                          Town / City <span className="text-[#F76B6B]">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="e.g. Occaecat eveniet ne"
                          className="h-11 px-3.5 bg-[#0D0D0B] border border-[#2D3C13] rounded-lg font-sans text-sm text-[#E8EDD4] focus:border-[#8CB34A] outline-none transition-colors"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="font-sans font-medium text-xs text-[#E8EDD4]">
                          Postal Code <span className="text-[#F76B6B]">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                          placeholder="e.g. Incidunt rem enim e"
                          className="h-11 px-3.5 bg-[#0D0D0B] border border-[#2D3C13] rounded-lg font-sans text-sm text-[#E8EDD4] focus:border-[#8CB34A] outline-none transition-colors uppercase"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-sans font-medium text-xs text-[#E8EDD4]">
                        Country <span className="text-[#F76B6B]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="h-11 px-3.5 bg-[#0D0D0B] border border-[#2D3C13] rounded-lg font-sans text-sm text-[#E8EDD4] focus:border-[#8CB34A] outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Step 3: Legal & UKARA Compliance */}
                  <div className="bg-[#111210] border border-[#2D3C13] rounded-2xl p-6 flex flex-col gap-5">
                    <div className="flex items-center gap-2.5 border-b border-[#2D3C13] pb-3">
                      <span className="w-6 h-6 rounded-full bg-[#1A230A] border border-[#8CB34A] text-[#8CB34A] font-heading font-bold text-xs flex items-center justify-center">
                        3
                      </span>
                      <h3 className="font-heading font-bold text-base text-[#E8EDD4]">
                        Compliance & Verification
                      </h3>
                    </div>

                    {hasRifItems ? (
                      <div className="flex flex-col gap-2 p-4 bg-[#0D0D0B] border border-amber-900/60 rounded-xl">
                        <div className="flex items-center justify-between">
                          <label className="font-sans font-medium text-xs text-[#E8EDD4]">
                            UKARA Registration Number <span className="text-[#F76B6B]">*</span>
                          </label>
                          <span className="text-[10px] text-amber-400 font-bold uppercase">
                            Mandatory for RIF Competitions
                          </span>
                        </div>
                        <input
                          type="text"
                          required={hasRifItems}
                          value={ukara}
                          onChange={(e) => setUkara(e.target.value)}
                          placeholder="e.g. UKARA123456"
                          className="h-11 px-3.5 bg-[#161810] border border-[#2D3C13] rounded-lg font-sans text-sm text-[#E8EDD4] focus:border-[#8CB34A] outline-none transition-colors uppercase"
                        />
                        <p className="font-sans text-[11px] text-[#72943A] leading-normal">
                          Required as evidence supporting a statutory legal defence under VCRA Section 37 for Realistic Imitation Firearms. Checked following a win to confirm it is active.
                        </p>
                      </div>
                    ) : (
                      <div className="p-3 bg-[#1A230A] border border-[#2D3C13] rounded-xl text-xs text-[#8CB34A]">
                        ✓ <strong>UKARA Not Required:</strong> Your current basket contains accessories only. UKARA defence details are not required.
                      </div>
                    )}

                    {/* Terms Acceptance */}
                    <div className="flex items-start gap-3 p-3.5 bg-[#0D0D0B] border border-[#2D3C13] rounded-xl">
                      <input
                        type="checkbox"
                        id="termsAccepted"
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                        className="w-4 h-4 mt-0.5 rounded border-[#2D3C13] bg-[#1A230A] accent-[#8CB34A] cursor-pointer"
                      />
                      <label
                        htmlFor="termsAccepted"
                        className="font-sans text-xs text-[#E8EDD4] leading-relaxed cursor-pointer select-none"
                      >
                        I confirm that I am 18 years of age or older, all information provided is accurate, and I accept the official{" "}
                        <a
                          href="/terms"
                          target="_blank"
                          className="text-[#8CB34A] underline font-medium hover:text-[#A0D056]"
                        >
                          Terms & Conditions (v1.0)
                        </a>{" "}
                        and RIF legal defence requirements.
                      </label>
                    </div>

                    {/* Save to Profile Toggle */}
                    <div className="flex items-center gap-3 px-1">
                      <input
                        type="checkbox"
                        id="saveProfileCheck"
                        checked={saveToProfile}
                        onChange={(e) => setSaveToProfile(e.target.checked)}
                        className="w-4 h-4 rounded border-[#2D3C13] bg-[#1A230A] accent-[#8CB34A] cursor-pointer"
                      />
                      <label
                        htmlFor="saveProfileCheck"
                        className="font-sans text-xs text-[#72943A] cursor-pointer select-none"
                      >
                        Automatically save this shipping address and contact info to my profile
                      </label>
                    </div>
                  </div>

                </div>

                {/* Right Column: Order Summary & Pay CTA */}
                <div className="lg:col-span-5 bg-[#111210] border border-[#2D3C13] rounded-2xl p-6 flex flex-col gap-5 sticky top-28 shadow-xl">
                  <h3 className="font-heading font-bold text-lg text-[#E8EDD4] border-b border-[#2D3C13] pb-3">
                    Items in Order ({itemCount})
                  </h3>

                  {/* Mini Cart Preview */}
                  <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-1">
                    {items.map((item) => (
                      <div
                        key={item.raffleId}
                        className="flex items-center justify-between gap-3 text-xs pb-2 border-b border-[#2D3C13]/40"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <div className="relative w-10 h-10 rounded-md overflow-hidden bg-[#1A230A] shrink-0">
                            {item.mainImage ? (
                              <Image
                                src={item.mainImage}
                                alt={item.title}
                                fill
                                className="object-cover"
                              />
                            ) : null}
                          </div>
                          <div className="truncate">
                            <div className="font-heading font-semibold text-[#E8EDD4] truncate">
                              {item.title}
                            </div>
                            <div className="font-sans text-[11px] text-[#72943A]">
                              {item.quantity} × £{item.ticketPrice.toFixed(2)}
                            </div>
                          </div>
                        </div>
                        <span className="font-heading font-bold text-sm text-[#8CB34A] shrink-0">
                          £{(item.ticketPrice * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Financials */}
                  <div className="flex flex-col gap-2.5 font-sans text-xs pt-2 border-t border-[#2D3C13]">
                    <div className="flex items-center justify-between text-[#72943A]">
                      <span>Total Tickets</span>
                      <span className="text-[#E8EDD4] font-medium">{ticketCount}</span>
                    </div>

                    <div className="flex items-center justify-between text-[#72943A]">
                      <span>Prize Delivery (Insured)</span>
                      <span className="text-[#8CB34A] font-medium">Free</span>
                    </div>

                    <div className="border-t border-[#2D3C13] pt-3 flex items-center justify-between">
                      <span className="font-heading font-semibold text-base text-[#E8EDD4]">
                        Amount to Pay
                      </span>
                      <span className="font-heading font-bold text-2xl text-[#8CB34A]">
                        £{totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {errorMessage && (
                    <div className="p-3.5 bg-red-950/60 border border-red-800 rounded-lg text-xs text-red-300">
                      {errorMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={!isFormValid || isSubmitting}
                    className="w-full h-12 bg-[#8CB34A] hover:bg-[#A0D056] disabled:bg-[#8CB34A]/40 disabled:text-[#0D0D0B]/60 disabled:cursor-not-allowed text-[#0D0D0B] font-heading font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(140,179,74,0.2)] cursor-pointer"
                  >
                    {isSubmitting
                      ? "Allocating Tickets & Processing..."
                      : `Confirm & Pay — £${totalAmount.toFixed(2)}`}
                  </button>

                  <div className="flex flex-col gap-1.5 text-center font-sans text-[11px] text-[#72943A] pt-2">
                    <p>🔒 256-bit encrypted secure checkout.</p>
                    <p>Competitions operated strictly under UK VCRA 2006 compliance.</p>
                  </div>
                </div>

              </div>
            </form>
          )}

        </div>
      </main>

      <WebsiteFooter />
    </>
  );
}
