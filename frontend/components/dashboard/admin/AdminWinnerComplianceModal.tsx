"use client";

import React, { useState, useEffect } from "react";
import { api } from "../../../services/api";

interface WinnerComplianceModalProps {
  isOpen: boolean;
  onClose: () => void;
  winner: any;
  onRefresh: () => void;
}

export default function AdminWinnerComplianceModal({
  isOpen,
  onClose,
  winner,
  onRefresh,
}: WinnerComplianceModalProps) {
  const [activeTab, setActiveTab] = useState<"verification" | "alternative" | "transfer" | "fulfillment">("verification");

  // Verification state
  const [verificationStatus, setVerificationStatus] = useState("WINNER_SELECTED");
  const [ukaraStatus, setUkaraStatus] = useState("PENDING_VERIFICATION");
  const [dobMatch, setDobMatch] = useState(false);
  const [nameMatch, setNameMatch] = useState(false);
  const [idFile, setIdFile] = useState<File | null>(null);

  // Alternative state
  const [alternativeType, setAlternativeType] = useState("NONE");
  const [alternativeAmount, setAlternativeAmount] = useState("");
  const [alternativeReason, setAlternativeReason] = useState("");

  // Transfer state
  const [transferRecipientName, setTransferRecipientName] = useState("");
  const [transferRecipientDob, setTransferRecipientDob] = useState("");
  const [transferRecipientUkara, setTransferRecipientUkara] = useState("");
  const [transferStatus, setTransferStatus] = useState("PENDING");
  const [transferNotes, setTransferNotes] = useState("");

  // Fulfillment state
  const [fulfillmentMethod, setFulfillmentMethod] = useState("SHIPPED");
  const [packagingType, setPackagingType] = useState("BOX");
  const [discreetPackagingConfirmed, setDiscreetPackagingConfirmed] = useState(false);
  const [courierName, setCourierName] = useState("PARCELFORCE");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [collectionStaffMember, setCollectionStaffMember] = useState("");

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    if (winner) {
      setVerificationStatus(winner.verificationStatus || "WINNER_SELECTED");
      setUkaraStatus(winner.ukaraStatus || "PENDING_VERIFICATION");
      setDobMatch(!!winner.dobMatch);
      setNameMatch(!!winner.nameMatch);

      setAlternativeType(winner.alternativeType || "NONE");
      setAlternativeAmount(winner.alternativeAmount ? String(winner.alternativeAmount) : "");
      setAlternativeReason(winner.alternativeReason || "");

      setTransferRecipientName(winner.transferRecipientName || "");
      setTransferRecipientDob(winner.transferRecipientDob ? winner.transferRecipientDob.slice(0, 10) : "");
      setTransferRecipientUkara(winner.transferRecipientUkara || "");
      setTransferStatus(winner.transferStatus || "PENDING");
      setTransferNotes(winner.transferAdminNotes || "");

      setFulfillmentMethod(winner.fulfillmentMethod || "SHIPPED");
      setPackagingType(winner.packagingType || "BOX");
      setDiscreetPackagingConfirmed(!!winner.discreetPackagingConfirmed);
      setCourierName(winner.courierName || "PARCELFORCE");
      setTrackingNumber(winner.trackingNumber || "");
      setCollectionStaffMember(winner.collectionStaffMember || "");
    }
  }, [winner]);

  if (!isOpen || !winner) return null;

  const isRif = (winner.raffle?.prizeClassification || "RIF") === "RIF";

  const handleUploadId = async () => {
    if (!idFile) return;
    setLoading(true);
    setStatusMessage(null);
    try {
      const formData = new FormData();
      formData.append("file", idFile);
      await api.post(`/admin/winners/${winner.id}/upload-id`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setStatusMessage("Identity document uploaded successfully.");
      setIdFile(null);
      onRefresh();
    } catch (err: any) {
      setStatusMessage(`Upload failed: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveVerification = async () => {
    setLoading(true);
    setStatusMessage(null);
    try {
      await api.patch(`/admin/winners/${winner.id}/compliance-verification`, {
        verificationStatus,
        ukaraStatus,
        dobMatch,
        nameMatch,
      });
      setStatusMessage("Verification status saved.");
      onRefresh();
    } catch (err: any) {
      setStatusMessage(`Save failed: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAlternative = async () => {
    setLoading(true);
    setStatusMessage(null);
    try {
      await api.patch(`/admin/winners/${winner.id}/alternative-prize`, {
        alternativeType,
        alternativeAmount: alternativeAmount ? Number(alternativeAmount) : 0,
        alternativeReason,
        alternativeStatus: "OFFERED",
      });
      setStatusMessage("Alternative prize record saved.");
      onRefresh();
    } catch (err: any) {
      setStatusMessage(`Save failed: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTransfer = async () => {
    setLoading(true);
    setStatusMessage(null);
    try {
      await api.patch(`/admin/winners/${winner.id}/prize-transfer`, {
        transferRecipientName,
        transferRecipientDob: transferRecipientDob || undefined,
        transferRecipientUkara: transferRecipientUkara || undefined,
        transferStatus,
        transferAdminNotes: transferNotes,
      });
      setStatusMessage("Prize transfer record saved.");
      onRefresh();
    } catch (err: any) {
      setStatusMessage(`Save failed: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFulfillment = async () => {
    setLoading(true);
    setStatusMessage(null);
    try {
      await api.patch(`/admin/winners/${winner.id}/fulfillment-packaging`, {
        fulfillmentMethod,
        packagingType,
        discreetPackagingConfirmed,
        courierName,
        trackingNumber,
        collectionStaffMember,
        deliveryStatus: fulfillmentMethod === "OFFICE_COLLECTION" ? "COLLECTED" : "SHIPPED",
      });
      setStatusMessage("Fulfillment and discreet packaging details saved.");
      onRefresh();
    } catch (err: any) {
      setStatusMessage(`Save failed: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#161810] border border-[#2D3C13] rounded-2xl w-full max-w-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#2D3C13] pb-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#1A230A] border border-[#43581E] text-[#8CB34A]">
                Compliance Audit Manager
              </span>
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                isRif ? 'bg-amber-950/40 border-amber-800 text-amber-400' : 'bg-blue-950/40 border-blue-800 text-blue-400'
              }`}>
                {isRif ? 'RIF Prize' : 'Accessory'}
              </span>
            </div>
            <h3 className="font-heading font-bold text-xl text-[#E8EDD4] mt-1">
              Winner Verification — {winner.prizeName}
            </h3>
            <p className="font-sans text-xs text-[#B3B8AA]">
              Winner: {winner.user?.firstName} {winner.user?.lastName} ({winner.user?.email})
            </p>
          </div>
          <button onClick={onClose} className="text-[#72943A] hover:text-[#E8EDD4] p-1 text-lg">✕</button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#2D3C13] gap-2 overflow-x-auto">
          {[
            { id: "verification", label: "1. ID & UKARA Check" },
            { id: "alternative", label: "2. Cash / Two-Tone Alt" },
            { id: "transfer", label: "3. Prize Transfer" },
            { id: "fulfillment", label: "4. Packaging & Dispatch" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-[#1A230A] text-[#8CB34A] border-t border-x border-[#43581E]"
                  : "text-[#72943A] hover:text-[#E8EDD4]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {statusMessage && (
          <div className="p-3 bg-[#1A230A] border border-[#8CB34A] text-xs text-[#8CB34A] rounded-lg">
            {statusMessage}
          </div>
        )}

        {/* TAB 1: ID & UKARA VERIFICATION */}
        {activeTab === "verification" && (
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#0D0D0B] p-4 rounded-xl border border-[#2D3C13]">
              <div>
                <span className="text-[11px] text-[#5A752A] uppercase font-semibold block">Registered User Name</span>
                <span className="text-sm font-semibold text-[#E8EDD4]">{winner.user?.firstName} {winner.user?.lastName}</span>
              </div>
              <div>
                <span className="text-[11px] text-[#5A752A] uppercase font-semibold block">Registered Date of Birth</span>
                <span className="text-sm font-semibold text-[#E8EDD4]">
                  {winner.user?.dateOfBirth ? new Date(winner.user.dateOfBirth).toLocaleDateString() : "Not Provided"}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-[#5A752A] uppercase font-semibold block">UKARA Number (At Checkout)</span>
                <span className="text-sm font-semibold text-[#8CB34A]">{winner.user?.ukaraNumber || "None Provided"}</span>
              </div>
              <div>
                <span className="text-[11px] text-[#5A752A] uppercase font-semibold block">Prize Classification</span>
                <span className="text-sm font-semibold text-[#E8EDD4]">{winner.raffle?.prizeClassification || "RIF"}</span>
              </div>
            </div>

            {/* Private ID Document Upload */}
            <div className="flex flex-col gap-3 p-4 bg-[#0D0D0B] border border-[#2D3C13] rounded-xl">
              <label className="text-xs font-semibold text-[#E8EDD4]">Private Government ID Document</label>
              {winner.idDocumentUrl ? (
                <div className="flex items-center justify-between p-3 bg-[#161810] border border-[#2D3C13] rounded-lg text-xs">
                  <span className="text-[#8CB34A]">✓ Document Uploaded ({winner.idDocumentType || "File"})</span>
                  <a
                    href={`/api/v1/admin/winners/${winner.id}/id-document`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1 bg-[#1A230A] border border-[#43581E] text-[#8CB34A] hover:text-[#E8EDD4] rounded font-semibold text-[11px]"
                  >
                    View Private ID Securely
                  </a>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setIdFile(e.target.files?.[0] || null)}
                    className="text-xs text-[#B3B8AA]"
                  />
                  <button
                    onClick={handleUploadId}
                    disabled={!idFile || loading}
                    className="px-4 py-2 bg-[#8CB34A] text-[#0D0D0B] font-semibold text-xs rounded-lg disabled:opacity-50"
                  >
                    Upload ID
                  </button>
                </div>
              )}
            </div>

            {/* Match Checkboxes & Statuses */}
            <div className="flex flex-col gap-3 p-4 bg-[#0D0D0B] border border-[#2D3C13] rounded-xl">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-xs text-[#E8EDD4] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dobMatch}
                    onChange={(e) => setDobMatch(e.target.checked)}
                    className="w-4 h-4 accent-[#8CB34A]"
                  />
                  ID Date of Birth Matches Checkout (18+)
                </label>
                <label className="flex items-center gap-2 text-xs text-[#E8EDD4] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={nameMatch}
                    onChange={(e) => setNameMatch(e.target.checked)}
                    className="w-4 h-4 accent-[#8CB34A]"
                  />
                  ID Full Name Matches Winner
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                <div>
                  <label className="text-xs text-[#E8EDD4] font-medium block mb-1">UKARA Defence Status</label>
                  <select
                    value={ukaraStatus}
                    onChange={(e) => setUkaraStatus(e.target.value)}
                    className="w-full h-10 px-3 bg-[#161810] border border-[#2D3C13] text-xs text-[#E8EDD4] rounded-lg"
                  >
                    <option value="NOT_REQUIRED">NOT_REQUIRED (Non-RIF)</option>
                    <option value="PENDING_VERIFICATION">PENDING_VERIFICATION</option>
                    <option value="VALID">VALID (Active UKARA Defence)</option>
                    <option value="INVALID">INVALID (Unverified / Fake)</option>
                    <option value="EXPIRED">EXPIRED (Out of Date)</option>
                    <option value="DETAILS_MISMATCH">DETAILS_MISMATCH (Name/DOB Mismatch)</option>
                    <option value="ALT_DEFENCE_REVIEW">ALT_DEFENCE_REVIEW (Skirmish Site Evidence)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[#E8EDD4] font-medium block mb-1">Overall Winner Verification</label>
                  <select
                    value={verificationStatus}
                    onChange={(e) => setVerificationStatus(e.target.value)}
                    className="w-full h-10 px-3 bg-[#161810] border border-[#2D3C13] text-xs text-[#E8EDD4] rounded-lg"
                  >
                    <option value="WINNER_SELECTED">WINNER_SELECTED</option>
                    <option value="ID_SUBMITTED">ID_SUBMITTED</option>
                    <option value="AGE_VERIFIED">AGE_VERIFIED</option>
                    <option value="IDENTITY_MATCH_CONFIRMED">IDENTITY_MATCH_CONFIRMED</option>
                    <option value="UKARA_VERIFIED">UKARA_VERIFIED</option>
                    <option value="APPROVED_FOR_FULFILMENT">APPROVED_FOR_FULFILMENT (Full Pass)</option>
                    <option value="VERIFICATION_FAILED">VERIFICATION_FAILED (Block Release)</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleSaveVerification}
                disabled={loading}
                className="mt-3 h-10 px-5 bg-[#8CB34A] text-[#0D0D0B] font-semibold text-xs rounded-lg self-end"
              >
                Save Verification Decision
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: ALTERNATIVE PRIZE */}
        {activeTab === "alternative" && (
          <div className="flex flex-col gap-4 p-4 bg-[#0D0D0B] border border-[#2D3C13] rounded-xl">
            <h4 className="text-sm font-semibold text-[#E8EDD4]">Cash Alternative / Two-Tone Substitution</h4>
            <p className="text-xs text-[#B3B8AA]">
              If a winner lacks a valid UKARA legal defence, the RIF cannot be released. You can offer a cash alternative or two-tone substitution in accordance with policy.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[#E8EDD4] block mb-1 font-medium">Alternative Type</label>
                <select
                  value={alternativeType}
                  onChange={(e) => setAlternativeType(e.target.value)}
                  className="w-full h-10 px-3 bg-[#161810] border border-[#2D3C13] text-xs text-[#E8EDD4] rounded-lg"
                >
                  <option value="NONE">NONE (Standard RIF Release)</option>
                  <option value="CASH">CASH (80% Valuation Cash Alternative)</option>
                  <option value="TWO_TONE_SUBSTITUTION">TWO_TONE_SUBSTITUTION (51%+ Bright Color)</option>
                  <option value="FORFEIT">FORFEIT (Failed Verification)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-[#E8EDD4] block mb-1 font-medium">Alternative Cash Amount (£)</label>
                <input
                  type="number"
                  value={alternativeAmount}
                  onChange={(e) => setAlternativeAmount(e.target.value)}
                  placeholder="e.g. 350.00"
                  className="w-full h-10 px-3 bg-[#161810] border border-[#2D3C13] text-xs text-[#E8EDD4] rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-[#E8EDD4] block mb-1 font-medium">Reason & Notes</label>
              <textarea
                value={alternativeReason}
                onChange={(e) => setAlternativeReason(e.target.value)}
                rows={3}
                placeholder="Explain why the alternative is being offered (e.g. Winner lacks active UKARA)..."
                className="w-full p-3 bg-[#161810] border border-[#2D3C13] text-xs text-[#E8EDD4] rounded-lg resize-none"
              />
            </div>

            <button
              onClick={handleSaveAlternative}
              disabled={loading}
              className="h-10 px-5 bg-[#8CB34A] text-[#0D0D0B] font-semibold text-xs rounded-lg self-end"
            >
              Save Alternative Offer
            </button>
          </div>
        )}

        {/* TAB 3: PRIZE TRANSFER */}
        {activeTab === "transfer" && (
          <div className="flex flex-col gap-4 p-4 bg-[#0D0D0B] border border-[#2D3C13] rounded-xl">
            <h4 className="text-sm font-semibold text-[#E8EDD4]">Prize Transfer Workflow</h4>
            <p className="text-xs text-[#B3B8AA]">
              Prizes may be transferred to a secondary recipient only if the new recipient passes full 18+ age, ID, and UKARA legal defence verification.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-[#E8EDD4] block mb-1 font-medium">Recipient Legal Name</label>
                <input
                  type="text"
                  value={transferRecipientName}
                  onChange={(e) => setTransferRecipientName(e.target.value)}
                  placeholder="Full Legal Name"
                  className="w-full h-10 px-3 bg-[#161810] border border-[#2D3C13] text-xs text-[#E8EDD4] rounded-lg"
                />
              </div>

              <div>
                <label className="text-xs text-[#E8EDD4] block mb-1 font-medium">Recipient Date of Birth</label>
                <input
                  type="date"
                  value={transferRecipientDob}
                  onChange={(e) => setTransferRecipientDob(e.target.value)}
                  className="w-full h-10 px-3 bg-[#161810] border border-[#2D3C13] text-xs text-[#E8EDD4] rounded-lg"
                />
              </div>

              <div>
                <label className="text-xs text-[#E8EDD4] block mb-1 font-medium">Recipient UKARA Number</label>
                <input
                  type="text"
                  value={transferRecipientUkara}
                  onChange={(e) => setTransferRecipientUkara(e.target.value)}
                  placeholder="UKARA Number"
                  className="w-full h-10 px-3 bg-[#161810] border border-[#2D3C13] text-xs text-[#E8EDD4] rounded-lg uppercase"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[#E8EDD4] block mb-1 font-medium">Transfer Status</label>
                <select
                  value={transferStatus}
                  onChange={(e) => setTransferStatus(e.target.value)}
                  className="w-full h-10 px-3 bg-[#161810] border border-[#2D3C13] text-xs text-[#E8EDD4] rounded-lg"
                >
                  <option value="PENDING">PENDING (Recipient Check Required)</option>
                  <option value="VERIFIED">VERIFIED (Recipient Approved)</option>
                  <option value="REJECTED">REJECTED (Transfer Denied)</option>
                  <option value="COMPLETED">COMPLETED</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-[#E8EDD4] block mb-1 font-medium">Transfer Admin Notes</label>
                <input
                  type="text"
                  value={transferNotes}
                  onChange={(e) => setTransferNotes(e.target.value)}
                  placeholder="Notes regarding recipient verification..."
                  className="w-full h-10 px-3 bg-[#161810] border border-[#2D3C13] text-xs text-[#E8EDD4] rounded-lg"
                />
              </div>
            </div>

            <button
              onClick={handleSaveTransfer}
              disabled={loading}
              className="h-10 px-5 bg-[#8CB34A] text-[#0D0D0B] font-semibold text-xs rounded-lg self-end"
            >
              Save Transfer Record
            </button>
          </div>
        )}

        {/* TAB 4: DISCREET PACKAGING & FULFILLMENT */}
        {activeTab === "fulfillment" && (
          <div className="flex flex-col gap-4 p-4 bg-[#0D0D0B] border border-[#2D3C13] rounded-xl">
            <h4 className="text-sm font-semibold text-[#E8EDD4]">Discreet Packaging & Controlled Fulfillment</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[#E8EDD4] block mb-1 font-medium">Fulfillment Method</label>
                <select
                  value={fulfillmentMethod}
                  onChange={(e) => setFulfillmentMethod(e.target.value)}
                  className="w-full h-10 px-3 bg-[#161810] border border-[#2D3C13] text-xs text-[#E8EDD4] rounded-lg"
                >
                  <option value="SHIPPED">SHIPPED (Tracked Courier Delivery)</option>
                  <option value="OFFICE_COLLECTION">OFFICE_COLLECTION (Registered Office In-Person Collection)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-[#E8EDD4] block mb-1 font-medium">Discreet Packaging Choice</label>
                <select
                  value={packagingType}
                  onChange={(e) => setPackagingType(e.target.value)}
                  className="w-full h-10 px-3 bg-[#161810] border border-[#2D3C13] text-xs text-[#E8EDD4] rounded-lg"
                >
                  <option value="BOX">Solid Cardboard Box (No Weapon Markings)</option>
                  <option value="PARCEL_BAG">Opaque Parcel Bag</option>
                  <option value="BLACK_ENVELOPE">Sealed Black Padded Envelope</option>
                  <option value="BLACK_SHRINK_WRAP">Solid Black Opaque Shrink Wrap</option>
                </select>
              </div>
            </div>

            <div className="p-3 bg-[#161810] border border-[#2D3C13] rounded-lg">
              <label className="flex items-center gap-2 text-xs text-[#E8EDD4] cursor-pointer">
                <input
                  type="checkbox"
                  checked={discreetPackagingConfirmed}
                  onChange={(e) => setDiscreetPackagingConfirmed(e.target.checked)}
                  className="w-4 h-4 accent-[#8CB34A]"
                />
                <strong>Confirmed:</strong> Package is completely discreet, cased/covered, with no external product markings identifying airsoft devices or firearms.
              </label>
            </div>

            {fulfillmentMethod === "SHIPPED" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#E8EDD4] block mb-1 font-medium">Courier Service</label>
                  <select
                    value={courierName}
                    onChange={(e) => setCourierName(e.target.value)}
                    className="w-full h-10 px-3 bg-[#161810] border border-[#2D3C13] text-xs text-[#E8EDD4] rounded-lg"
                  >
                    <option value="PARCELFORCE">Parcelforce Worldwide (Tracked & Age Verified)</option>
                    <option value="ROYAL_MAIL">Royal Mail Special Delivery</option>
                    <option value="OTHER">Other Approved Courier</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[#E8EDD4] block mb-1 font-medium">Tracking Reference Number</label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="e.g. PB123456789GB"
                    className="w-full h-10 px-3 bg-[#161810] border border-[#2D3C13] text-xs text-[#E8EDD4] rounded-lg"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="text-xs text-[#E8EDD4] block mb-1 font-medium">Office Collection Staff Member Name</label>
                <input
                  type="text"
                  value={collectionStaffMember}
                  onChange={(e) => setCollectionStaffMember(e.target.value)}
                  placeholder="Staff member verifying physical ID at office handover..."
                  className="w-full h-10 px-3 bg-[#161810] border border-[#2D3C13] text-xs text-[#E8EDD4] rounded-lg"
                />
              </div>
            )}

            <button
              onClick={handleSaveFulfillment}
              disabled={loading}
              className="h-10 px-5 bg-[#8CB34A] text-[#0D0D0B] font-semibold text-xs rounded-lg self-end"
            >
              Save Dispatch & Fulfillment Record
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
