"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import WebsiteNavbar from "../../components/website/layout/WebsiteNavbar";
import WebsiteFooter from "../../components/website/layout/WebsiteFooter";
import { useBasket, BasketItem } from "../../features/basket/BasketContext";
import { useAuthUser } from "../../hooks/useAuthHooks";
import { useQueryClient } from "@tanstack/react-query";
import { useClaimInstantWinsMutation } from "../../hooks/useUserHooks";
import WinAnimationModal, { WinPrizeItem } from "../../components/ui/WinAnimationModal";
import { toast } from "sonner";
import { api } from "../../services/api";

export function calculateAgeFromDob(dobStr: string): number | null {
  if (!dobStr) return null;
  const match = dobStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) {
    const d = new Date(dobStr);
    if (isNaN(d.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - d.getFullYear();
    const m = today.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < d.getDate())) {
      age--;
    }
    return age;
  }

  const birthYear = parseInt(match[1], 10);
  const birthMonth = parseInt(match[2], 10);
  const birthDay = parseInt(match[3], 10);

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();

  let age = currentYear - birthYear;
  if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)) {
    age--;
  }
  return age;
}

export function formatDateForInput(dateVal: any): string {
  if (!dateVal) return "";
  if (typeof dateVal === "string") {
    const match = dateVal.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }
  }
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return "";
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  } catch {
    return "";
  }
}

export function parseSavedAddress(rawAddress?: string | null, rawLocation?: string | null) {
  const addr = (rawAddress || "").trim();
  const loc = (rawLocation || "").trim();

  let addressLine1 = "";
  let addressLine2 = "";
  let city = "";
  let postalCode = "";
  let country = "United Kingdom";

  const ukPostcodeRegex = /([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})/i;

  if (addr) {
    const pcMatch = addr.match(ukPostcodeRegex);
    if (pcMatch) {
      postalCode = pcMatch[0].toUpperCase();
    }

    const parts = addr.split(",").map((s) => s.trim()).filter(Boolean);

    if (parts.length >= 5) {
      addressLine1 = parts[0];
      addressLine2 = parts[1];
      city = parts[2];
      if (!postalCode) postalCode = parts[3];
      country = parts[4];
    } else if (parts.length === 4) {
      addressLine1 = parts[0];
      city = parts[1];
      if (!postalCode) postalCode = parts[2];
      country = parts[3];
    } else if (parts.length === 3) {
      addressLine1 = parts[0];
      city = parts[1];
      if (!postalCode) {
        postalCode = parts[2];
      } else {
        country = parts[2];
      }
    } else if (parts.length === 2) {
      addressLine1 = parts[0];
      city = parts[1];
    } else if (parts.length === 1) {
      addressLine1 = parts[0];
    }
  }

  if (!city && loc) {
    const locParts = loc.split(",").map((p) => p.trim()).filter(Boolean);
    if (locParts.length > 0) city = locParts[0];
    if (locParts.length > 1 && (!country || country === "United Kingdom")) country = locParts[1];
  }

  return {
    addressLine1,
    addressLine2,
    city,
    postalCode,
    country: country || "United Kingdom",
  };
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

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const isDirectParam = searchParams.get("direct") === "true";
  const { data: user, isLoading: isUserLoading } = useAuthUser();
  const {
    items: basketItems,
    itemCount: basketItemCount,
    ticketCount: basketTicketCount,
    totalAmount: basketTotalAmount,
    hasRifItems: basketHasRifItems,
    isHydrated: isBasketHydrated,
    clearBasket,
    removeFromBasket,
  } = useBasket();

  const isHost = user?.role?.toUpperCase() === "HOST";
  const [showWinModal, setShowWinModal] = useState(false);
  const claimMutation = useClaimInstantWinsMutation();

  const [directItem, setDirectItem] = useState<BasketItem | null>(null);
  const [isDirectHydrated, setIsDirectHydrated] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("direct_checkout_item");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.raffleId) {
            setDirectItem(parsed);
          }
        }
      } catch (e) {
        console.error("Failed to parse direct_checkout_item:", e);
      } finally {
        setIsDirectHydrated(true);
      }
    }
  }, []);

  const isDirectCheckout = isDirectParam && !!directItem;
  const isHydrated = isDirectParam ? (isDirectHydrated && isBasketHydrated) : isBasketHydrated;

  const items: BasketItem[] = isDirectCheckout && directItem ? [directItem] : basketItems;
  const itemCount = isDirectCheckout ? (directItem ? 1 : 0) : basketItemCount;
  const ticketCount = isDirectCheckout
    ? (directItem?.quantity || 0)
    : basketTicketCount;
  const totalAmount = isDirectCheckout
    ? (directItem ? directItem.quantity * directItem.ticketPrice : 0)
    : basketTotalAmount;
  const hasRifItems = isDirectCheckout
    ? (directItem ? (directItem.prizeClassification || "RIF") === "RIF" : false)
    : basketHasRifItems;

  // Contact Information Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("user_email") || "";
    }
    return "";
  });
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("checkout_dob") || "";
    }
    return "";
  });
  const [dobDay, setDobDay] = useState("");
  const [dobMonth, setDobMonth] = useState("");
  const [dobYear, setDobYear] = useState("");
  const calendarInputRef = React.useRef<HTMLInputElement>(null);

  // Synchronize separate day, month, year dropdowns whenever dob is set
  useEffect(() => {
    if (dob) {
      const match = dob.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (match) {
        setDobYear(match[1]);
        setDobMonth(match[2]);
        setDobDay(match[3]);
      }
    }
  }, [dob]);

  const handleDatePartChange = (part: "day" | "month" | "year", val: string) => {
    const nextDay = part === "day" ? val : dobDay;
    const nextMonth = part === "month" ? val : dobMonth;
    const nextYear = part === "year" ? val : dobYear;

    if (part === "day") setDobDay(val);
    if (part === "month") setDobMonth(val);
    if (part === "year") setDobYear(val);

    if (nextDay && nextMonth && nextYear) {
      setDob(`${nextYear}-${nextMonth.padStart(2, "0")}-${nextDay.padStart(2, "0")}`);
    } else {
      setDob("");
    }
  };

  const daysList = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0"));
  const monthsList = [
    { value: "01", label: "01 - Jan" },
    { value: "02", label: "02 - Feb" },
    { value: "03", label: "03 - Mar" },
    { value: "04", label: "04 - Apr" },
    { value: "05", label: "05 - May" },
    { value: "06", label: "06 - Jun" },
    { value: "07", label: "07 - Jul" },
    { value: "08", label: "08 - Aug" },
    { value: "09", label: "09 - Sep" },
    { value: "10", label: "10 - Oct" },
    { value: "11", label: "11 - Nov" },
    { value: "12", label: "12 - Dec" },
  ];
  const currentYearVal = new Date().getFullYear();
  const yearsList = Array.from({ length: 101 }, (_, i) => String(currentYearVal - i));

  // Shipping Address Form State
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("United Kingdom");

  // Legal & Compliance State
  const [ukara, setUkara] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("checkout_ukara") || "";
    }
    return "";
  });
  const [acceptedTerms, setAcceptedTerms] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("checkout_accepted_terms") === "true";
    }
    return false;
  });
  const [saveToProfile, setSaveToProfile] = useState(true);

  // Submission & Results State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [purchaseResult, setPurchaseResult] = useState<PurchaseResult | null>(null);

  // Immediate redirect for unauthenticated visitors
  useEffect(() => {
    if (!isUserLoading && !user) {
      const redirectUrl = isDirectParam ? "/checkout?direct=true" : "/checkout";
      router.replace(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
    }
  }, [isUserLoading, user, router, isDirectParam]);

  // Comprehensive pre-fill from authenticated user profile
  useEffect(() => {
    const currentUser = (user as any)?.user || user;
    if (currentUser) {
      const uEmail = currentUser.email;
      if (uEmail) {
        setEmail(uEmail);
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("user_email", uEmail);
          } catch {}
        }
      }
      if (currentUser.firstName) {
        setFirstName(currentUser.firstName);
      }
      if (currentUser.lastName) {
        setLastName(currentUser.lastName);
      }
      // If firstName / lastName aren't set separately, extract from composite name or fullName
      if (!currentUser.firstName) {
        const compositeName = currentUser.name || currentUser.fullName;
        if (compositeName) {
          const parts = String(compositeName).trim().split(/\s+/);
          if (parts.length > 0) setFirstName(parts[0]);
          if (parts.length > 1) setLastName(parts.slice(1).join(" "));
        }
      }
      const userPhone = currentUser.phone || currentUser.hostProfile?.phone;
      if (userPhone) {
        setPhone(userPhone);
      }
      if (currentUser.dateOfBirth) {
        const formattedDob = formatDateForInput(currentUser.dateOfBirth);
        if (formattedDob) setDob(formattedDob);
      } else if (typeof window !== "undefined") {
        const cachedDob = localStorage.getItem("checkout_dob");
        if (cachedDob) setDob(cachedDob);
      }
      if (currentUser.ukaraNumber) {
        setUkara(currentUser.ukaraNumber);
      } else if (typeof window !== "undefined") {
        const cachedUkara = localStorage.getItem("checkout_ukara");
        if (cachedUkara) setUkara(cachedUkara);
      }
      if (typeof window !== "undefined") {
        const cachedAccepted = localStorage.getItem("checkout_accepted_terms");
        if (cachedAccepted === "true") setAcceptedTerms(true);
      }
      const parsedAddr = parseSavedAddress(currentUser.address, currentUser.location);
      if (parsedAddr.addressLine1) setAddressLine1(parsedAddr.addressLine1);
      if (parsedAddr.addressLine2) setAddressLine2(parsedAddr.addressLine2);
      if (parsedAddr.city) setCity(parsedAddr.city);
      if (parsedAddr.postalCode) setPostalCode(parsedAddr.postalCode);
      if (parsedAddr.country) setCountry(parsedAddr.country);
    } else if (typeof window !== "undefined") {
      // Fallback from localStorage if user object is still syncing
      const cachedEmail = localStorage.getItem("user_email");
      if (cachedEmail) {
        setEmail(cachedEmail);
      }
      try {
        const cachedUserStr = localStorage.getItem("user_data");
        if (cachedUserStr) {
          const cachedUser = JSON.parse(cachedUserStr);
          if (cachedUser.email) setEmail(cachedUser.email);
          if (cachedUser.firstName) setFirstName(cachedUser.firstName);
          if (cachedUser.lastName) setLastName(cachedUser.lastName);
          if (cachedUser.phone) setPhone(cachedUser.phone);
        }
      } catch {}
    }
  }, [user]);

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
      ukaraNumber: ukara.trim() || undefined,
      acceptedTerms,
      saveToProfile,
    };

    try {
      const response = await api.post("/tickets/checkout", payload);
      const data = response.data;

      // If Cashflows gateway redirect URL is present
      if (data?.url) {
        if (isDirectCheckout) {
          try {
            localStorage.setItem("direct_checkout_pending", "true");
            if (directItem?.raffleId) {
              localStorage.setItem("direct_checkout_raffle_id", directItem.raffleId);
            }
            localStorage.removeItem("direct_checkout_item");
          } catch {}
        }
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

      if (!isHost) {
        setShowWinModal(true);
      }

      if (data.instantWins && data.instantWins.length > 0) {
        queryClient.invalidateQueries({ queryKey: ["unclaimed-instant-wins"] });
        queryClient.setQueryData(["unclaimed-instant-wins"], data.instantWins);
      }

      if (isDirectCheckout) {
        try {
          localStorage.removeItem("direct_checkout_item");
          if (directItem?.raffleId) {
            removeFromBasket(directItem.raffleId);
          }
        } catch {}
      } else {
        // Clear basket after successful basket purchase
        clearBasket();
      }
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

  const modalPrizes: WinPrizeItem[] = (purchaseResult?.instantWins || []).map(
    (w: any) => ({
      id: w.id,
      title: w.prizeName || w.title || "Instant Win Prize",
      ticketNumber: w.ticketNumber,
      image: w.prizeImage || w.image || null,
      rrpValue: w.rrpValue ? Number(w.rrpValue) : null,
      raffleTitle: w.raffleTitle,
    })
  );

  const handleClaimPrizes = async () => {
    if (modalPrizes.length === 0) {
      setShowWinModal(false);
      return;
    }
    try {
      const winnerIds = modalPrizes.map((p) => p.id).filter(Boolean) as string[];
      await claimMutation.mutateAsync(winnerIds.length > 0 ? winnerIds : undefined);
      setShowWinModal(false);
      toast.success(
        modalPrizes.length > 1
          ? `🎉 ${modalPrizes.length} Instant Win prizes claimed!`
          : "🎉 Instant Win prize claimed!",
        {
          description:
            "Your prize has been recorded. Check your Dashboard > Winnings for delivery status.",
          duration: 6000,
        }
      );
      queryClient.invalidateQueries({ queryKey: ["unclaimed-instant-wins"] });
      queryClient.invalidateQueries({ queryKey: ["my-winners"] });
      queryClient.invalidateQueries({ queryKey: ["my-tickets"] });
    } catch (err: any) {
      toast.error("Could not claim instant win", {
        description: err?.message || "Please try again or contact support.",
      });
    }
  };

  if (isUserLoading) {
    return (
      <>
        <WebsiteNavbar />
        <main className="min-h-screen bg-[#0D0D0B] text-[#E8EDD4] pt-32 pb-24 px-4 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-4 bg-[#111210] border border-[#2D3C13] rounded-2xl p-8 max-w-sm w-full text-center shadow-xl">
            <div className="w-10 h-10 border-3 border-[#8CB34A] border-t-transparent rounded-full animate-spin" />
            <div className="flex flex-col gap-1">
              <h3 className="font-heading font-semibold text-sm text-[#E8EDD4]">
                Verifying Session...
              </h3>
              <p className="font-sans text-xs text-[#72943A]">
                Checking authentication before loading checkout
              </p>
            </div>
          </div>
        </main>
        <WebsiteFooter />
      </>
    );
  }

  if (!user) {
    return (
      <>
        <WebsiteNavbar />
        <main className="min-h-screen bg-[#0D0D0B] text-[#E8EDD4] pt-32 pb-24 px-4 flex flex-col items-center justify-center">
          <div className="bg-[#111210] border border-[#2D3C13] rounded-2xl p-8 sm:p-10 max-w-md w-full text-center flex flex-col items-center gap-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-[#1A230A] border border-[#8CB34A] flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(140,179,74,0.3)]">
              🔒
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-semibold tracking-wider uppercase text-[#8CB34A] bg-[#1A230A] px-3 py-0.5 rounded-full border border-[#2D3C13] self-center">
                Authentication Required
              </span>
              <h1 className="font-heading font-bold text-2xl text-[#E8EDD4]">
                Please Log In to Continue
              </h1>
              <p className="font-sans text-xs sm:text-sm text-[#72943A] leading-relaxed">
                You must have an active account to checkout competition tickets, verify age eligibility (18+), and link allocations.
              </p>
            </div>
            <div className="w-full flex flex-col gap-3">
              <Link
                href={`/login?redirect=${encodeURIComponent(isDirectParam ? "/checkout?direct=true" : "/checkout")}`}
                className="w-full h-12 bg-[#8CB34A] hover:bg-[#A0D056] text-[#0D0D0B] font-heading font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(140,179,74,0.2)]"
              >
                Log In to Checkout →
              </Link>
              <Link
                href={`/register?redirect=${encodeURIComponent(isDirectParam ? "/checkout?direct=true" : "/checkout")}`}
                className="w-full h-11 bg-transparent hover:bg-[#1A230A] border border-[#2D3C13] text-[#E8EDD4] font-sans font-medium text-xs rounded-lg transition-colors flex items-center justify-center"
              >
                Create New Account
              </Link>
            </div>
          </div>
        </main>
        <WebsiteFooter />
      </>
    );
  }

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

              {!isHost && (
                <WinAnimationModal
                  isOpen={showWinModal}
                  onClose={() => setShowWinModal(false)}
                  prizes={modalPrizes}
                  onClaim={handleClaimPrizes}
                  isClaiming={claimMutation.isPending}
                />
              )}
            </div>
          ) : isHydrated && items.length === 0 ? (
            /* Empty Basket on Checkout */
            <div className="bg-[#111210] border border-[#2D3C13] rounded-2xl p-12 text-center flex flex-col items-center gap-5 max-w-xl mx-auto shadow-xl">
              <h3 className="font-heading font-bold text-xl text-[#E8EDD4]">
                {isDirectParam ? "No Competition Selected" : "No Items in Basket"}
              </h3>
              <p className="font-sans text-xs text-[#72943A]">
                {isDirectParam
                  ? "We couldn't find your instant entry competition. Please select a competition to enter directly or add tickets to your basket."
                  : "You need to add competition tickets to your basket before proceeding to checkout."}
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

              {/* Authenticated User Status Banner */}
              {user && (
                <div className="bg-[#161810] border border-[#2D3C13] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-[#1A230A] border border-[#8CB34A]/60 flex items-center justify-center text-[#8CB34A] font-bold text-sm shrink-0">
                      ✓
                    </div>
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-heading font-bold text-sm text-[#E8EDD4] truncate">
                          Logged in as {user.email}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#1A230A] text-[#8CB34A] border border-[#8CB34A]/40 shrink-0">
                          Profile Synced
                        </span>
                      </div>
                      <p className="font-sans text-xs text-[#72943A]">
                        Your account email and profile delivery information have been automatically loaded below.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Instant Direct Entry Notification Banner */}
              {isDirectCheckout && basketItems.length > 0 && (
                <div className="bg-[#161810] border border-[#8CB34A]/40 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-md">
                  <div className="flex items-center gap-2.5 text-[#E8EDD4]">
                    <span className="text-base text-[#8CB34A] shrink-0">⚡</span>
                    <p>
                      <strong className="text-[#8CB34A]">Instant Direct Entry:</strong> You are checking out only this competition directly. Your <strong>{basketItemCount} other basket item{basketItemCount > 1 ? "s" : ""}</strong> (£{basketTotalAmount.toFixed(2)}) will remain safely saved in your shopping basket.
                    </p>
                  </div>
                  <Link
                    href="/checkout"
                    className="text-[#8CB34A] hover:text-[#A0D056] font-semibold underline whitespace-nowrap self-start sm:self-auto shrink-0 transition-colors"
                  >
                    Checkout full basket instead ({basketItemCount}) →
                  </Link>
                </div>
              )}

              {!isDirectCheckout && directItem && (
                <div className="bg-[#161810] border border-[#2D3C13] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-md">
                  <div className="flex items-center gap-2.5 text-[#E8EDD4]">
                    <span className="text-base text-[#8CB34A] shrink-0">⚡</span>
                    <p>
                      You also have a pending instant direct entry for <strong>{directItem.title}</strong> ({directItem.quantity} ticket{directItem.quantity > 1 ? "s" : ""} — £{(directItem.quantity * directItem.ticketPrice).toFixed(2)}).
                    </p>
                  </div>
                  <Link
                    href="/checkout?direct=true"
                    className="text-[#8CB34A] hover:text-[#A0D056] font-semibold underline whitespace-nowrap self-start sm:self-auto shrink-0 transition-colors"
                  >
                    Switch to Instant Entry →
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
                        <div className="flex items-center justify-between">
                          <label className="font-sans font-medium text-xs text-[#E8EDD4]">
                            Email Address (Ticket Confirmation) <span className="text-[#F76B6B]">*</span>
                          </label>
                          <span className="text-[10px] text-[#8CB34A] font-semibold bg-[#1A230A] border border-[#2D3C13] px-2 py-0.5 rounded-full flex items-center gap-1">
                            <span>✓</span> Auto-filled from login
                          </span>
                        </div>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. john.smith@example.co.uk"
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
                          placeholder="+44 7000 123123"
                          className="h-11 px-3.5 bg-[#0D0D0B] border border-[#2D3C13] rounded-lg font-sans text-sm text-[#E8EDD4] focus:border-[#8CB34A] outline-none transition-colors"
                        />
                      </div>
                    </div>

                    {/* Date of Birth 18+ check */}
                    <div className="flex flex-col gap-2.5 pt-2 border-t border-[#2D3C13]/50">
                      <div className="flex items-center justify-between">
                        <label className="font-sans font-medium text-xs text-[#E8EDD4]">
                          Date of Birth (18+ Only) <span className="text-[#F76B6B]">*</span>
                        </label>
                        {calculatedAge !== null && (
                          <span
                            className={
                              isValidAge
                                ? "text-[#8CB34A] text-xs font-semibold bg-[#1A230A] border border-[#2D3C13] px-2.5 py-0.5 rounded-full"
                                : "text-[#F76B6B] text-xs font-semibold bg-red-950/50 border border-red-900 px-2.5 py-0.5 rounded-full"
                            }
                          >
                            Age: {calculatedAge} {isValidAge ? "(Verified 18+)" : "(Under 18 Blocked)"}
                          </span>
                        )}
                      </div>

                      {/* 3 Dropdowns: Day, Month, Year */}
                      <div className="grid grid-cols-3 gap-2 sm:gap-3">
                        {/* Day Selector */}
                        <div className="flex flex-col gap-1">
                          <span className="text-[11px] font-sans text-[#72943A]">Day (DD)</span>
                          <select
                            value={dobDay}
                            onChange={(e) => handleDatePartChange("day", e.target.value)}
                            className="h-11 px-2.5 sm:px-3 bg-[#0D0D0B] border border-[#2D3C13] rounded-lg font-sans text-xs sm:text-sm text-[#E8EDD4] focus:border-[#8CB34A] outline-none transition-colors cursor-pointer"
                          >
                            <option value="">Select Day</option>
                            {daysList.map((d) => (
                              <option key={d} value={d} className="bg-[#161810] text-[#E8EDD4]">
                                {d}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Month Selector */}
                        <div className="flex flex-col gap-1">
                          <span className="text-[11px] font-sans text-[#72943A]">Month (MM)</span>
                          <select
                            value={dobMonth}
                            onChange={(e) => handleDatePartChange("month", e.target.value)}
                            className="h-11 px-2.5 sm:px-3 bg-[#0D0D0B] border border-[#2D3C13] rounded-lg font-sans text-xs sm:text-sm text-[#E8EDD4] focus:border-[#8CB34A] outline-none transition-colors cursor-pointer"
                          >
                            <option value="">Select Month</option>
                            {monthsList.map((m) => (
                              <option key={m.value} value={m.value} className="bg-[#161810] text-[#E8EDD4]">
                                {m.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Year Selector */}
                        <div className="flex flex-col gap-1">
                          <span className="text-[11px] font-sans text-[#72943A]">Year (YYYY)</span>
                          <select
                            value={dobYear}
                            onChange={(e) => handleDatePartChange("year", e.target.value)}
                            className="h-11 px-2.5 sm:px-3 bg-[#0D0D0B] border border-[#2D3C13] rounded-lg font-sans text-xs sm:text-sm text-[#E8EDD4] focus:border-[#8CB34A] outline-none transition-colors cursor-pointer"
                          >
                            <option value="">Select Year</option>
                            {yearsList.map((y) => (
                              <option key={y} value={y} className="bg-[#161810] text-[#E8EDD4]">
                                {y}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Helper and optional calendar trigger */}
                      <div className="flex items-center justify-between text-[11px] text-[#72943A] pt-0.5">
                        <span>Format: DD/MM/YYYY • Must be 18+ to participate.</span>
                        <button
                          type="button"
                          onClick={() => {
                            try {
                              calendarInputRef.current?.showPicker?.();
                            } catch {
                              calendarInputRef.current?.focus();
                            }
                          }}
                          className="text-[#8CB34A] hover:text-[#A0D056] font-medium flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <span>📅</span>
                          <span>Calendar Picker</span>
                        </button>
                        <input
                          ref={calendarInputRef}
                          type="date"
                          tabIndex={-1}
                          value={dob}
                          onChange={(e) => {
                            if (e.target.value) {
                              setDob(e.target.value);
                            }
                          }}
                          className="sr-only"
                        />
                      </div>

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
                        placeholder="House number and street name"
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
                        placeholder="Apartment, suite, unit, etc. (optional)"
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
                          placeholder="Town / City"
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
                          placeholder="Postcode (e.g. SW1A 1AA)"
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

                    {/* UKARA Registration Input Field */}
                    <div className="flex flex-col gap-2 p-4 bg-[#0D0D0B] border border-[#2D3C13] rounded-xl">
                      <div className="flex items-center justify-between">
                        <label className="font-sans font-medium text-xs text-[#E8EDD4]">
                          UKARA Registration Number {hasRifItems && <span className="text-[#F76B6B]">*</span>}
                        </label>
                        {hasRifItems ? (
                          <span className="text-[10px] text-amber-400 font-bold uppercase bg-amber-950/40 border border-amber-800/60 px-2 py-0.5 rounded">
                            Mandatory for RIF Competitions
                          </span>
                        ) : (
                          <span className="text-[10px] text-[#8CB34A] font-medium bg-[#1A230A] border border-[#2D3C13] px-2 py-0.5 rounded">
                            Optional for Accessories / Non-RIF
                          </span>
                        )}
                      </div>
                      <input
                        type="text"
                        required={hasRifItems}
                        value={ukara}
                        onChange={(e) => setUkara(e.target.value)}
                        placeholder="e.g. UKARA123456"
                        className="h-11 px-3.5 bg-[#161810] border border-[#2D3C13] rounded-lg font-sans text-sm text-[#E8EDD4] focus:border-[#8CB34A] outline-none transition-colors uppercase"
                      />
                      {hasRifItems ? (
                        <p className="font-sans text-[11px] text-[#72943A] leading-normal">
                          Required as evidence supporting a statutory legal defence under VCRA Section 37 for Realistic Imitation Firearms. Checked following a win to confirm it is active.
                        </p>
                      ) : (
                        <p className="font-sans text-[11px] text-[#72943A] leading-normal">
                          Your current basket contains non-RIF items. You can optionally enter your UKARA number here to link and save it to your account for future RIF competitions.
                        </p>
                      )}
                    </div>

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
                  <div className="flex items-center justify-between border-b border-[#2D3C13] pb-3">
                    <h3 className="font-heading font-bold text-lg text-[#E8EDD4]">
                      {isDirectCheckout ? "Direct Competition Entry" : `Items in Order (${itemCount})`}
                    </h3>
                    {isDirectCheckout && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#1A230A] text-[#8CB34A] border border-[#8CB34A]/40">
                        Instant Entry
                      </span>
                    )}
                  </div>

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

export default function CheckoutPage() {
  return (
    <React.Suspense
      fallback={
        <>
          <WebsiteNavbar />
          <main className="min-h-screen bg-[#0D0D0B] text-[#E8EDD4] pt-32 pb-24 px-4 flex flex-col items-center justify-center">
            <div className="flex flex-col items-center gap-4 bg-[#111210] border border-[#2D3C13] rounded-2xl p-8 max-w-sm w-full text-center shadow-xl">
              <div className="w-10 h-10 border-3 border-[#8CB34A] border-t-transparent rounded-full animate-spin" />
              <div className="flex flex-col gap-1">
                <h3 className="font-heading font-semibold text-sm text-[#E8EDD4]">
                  Loading Checkout...
                </h3>
              </div>
            </div>
          </main>
          <WebsiteFooter />
        </>
      }
    >
      <CheckoutContent />
    </React.Suspense>
  );
}
