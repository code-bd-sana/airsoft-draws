import React from "react";

interface Transaction {
  id: string;
  transactionId: string;
  date: string;
  description: string;
  amount: string;
  paymentMethod: string;
  status: "completed" | "refunded" | "failed";
}

const DUMMY_TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    transactionId: "#TRN-8821",
    date: "15 Jun 2025",
    description: "5 tickets — VFC HK416 Bundle",
    amount: "£12.50",
    paymentMethod: "**** 4242",
    status: "completed",
  },
  {
    id: "2",
    transactionId: "#TRN-8820",
    date: "10 Jun 2025",
    description: "3 tickets — Tokyo Marui MWS",
    amount: "£9.00",
    paymentMethod: "**** 4242",
    status: "completed",
  },
  {
    id: "3",
    transactionId: "#TRN-8815",
    date: "05 Jun 2025",
    description: "8 tickets — Sniper Precision Set",
    amount: "£16.00",
    paymentMethod: "**** 4242",
    status: "refunded",
  },
  {
    id: "4",
    transactionId: "#TRN-8800",
    date: "01 Jun 2025",
    description: "2 tickets — Tactical Loadout",
    amount: "£3.00",
    paymentMethod: "**** 4242",
    status: "completed",
  },
  {
    id: "5",
    transactionId: "#TRN-8790",
    date: "28 May 2025",
    description: "10 tickets — G36 Bundle",
    amount: "£25.00",
    paymentMethod: "**** 4242",
    status: "completed",
  },
  {
    id: "6",
    transactionId: "#TRN-8780",
    date: "20 May 2025",
    description: "1 ticket — Pistol Pack",
    amount: "£2.00",
    paymentMethod: "**** 4242",
    status: "failed",
  },
];

export default function UserTransactionsPage() {
  return (
    <div className="flex flex-col gap-6 p-8 max-w-[1660px] mx-auto w-full animate-fadeIn">
      {/* Top Summary Card */}
      <div className="bg-[#161810] border border-[#2D3C13] rounded-[16px] p-8 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex flex-col gap-2">
          <span className="font-sans text-[11px] font-medium uppercase tracking-[1.1px] text-[#5A752A]">
            Total Spent This Year
          </span>
          <p className="font-heading font-bold text-[36px] leading-tight text-[#8CB34A]">
            £286.50
          </p>
        </div>

        <div className="flex flex-col gap-4 md:w-[400px]">
          <span className="font-sans text-[10px] font-medium uppercase tracking-[1px] text-[#5A752A]">
            Spend By Category
          </span>
          {/* Segmented Progress Bar */}
          <div className="w-full flex h-[8px] rounded-full overflow-hidden gap-1 bg-[#1A230A]">
            <div className="h-full bg-[#8CB34A]" style={{ width: "45%" }} />
            <div className="h-full bg-[#A0D056]" style={{ width: "30%" }} />
            <div className="h-full bg-[#5A752A]" style={{ width: "25%" }} />
          </div>
          {/* Legend */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#8CB34A]" />
              <span className="font-sans text-[11px] text-[#72943A]">Rifles</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#A0D056]" />
              <span className="font-sans text-[11px] text-[#72943A]">Gear</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#5A752A]" />
              <span className="font-sans text-[11px] text-[#72943A]">Other</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Controls Row */}
      <div className="flex flex-wrap items-center gap-4">
        <button className="flex items-center gap-2 px-4 py-2 rounded-[8px] bg-transparent border border-[#2D3C13] hover:bg-[#1A230A] text-[#72943A] hover:text-[#E8EDD4] font-sans font-medium text-[13px] transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
          Date range
          <svg className="w-3.5 h-3.5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>

        <div className="w-px h-6 bg-[#2D3C13] mx-2" />

        <button className="px-5 py-2 rounded-[20px] bg-transparent border border-[#8CB34A] text-[#8CB34A] font-sans font-medium text-[13px] transition-colors">
          All
        </button>
        <button className="px-5 py-2 rounded-[20px] bg-transparent border border-[#2D3C13] text-[#72943A] hover:border-[#43581E] hover:text-[#E8EDD4] font-sans font-medium text-[13px] transition-colors">
          Purchases
        </button>
        <button className="px-5 py-2 rounded-[20px] bg-transparent border border-[#2D3C13] text-[#72943A] hover:border-[#43581E] hover:text-[#E8EDD4] font-sans font-medium text-[13px] transition-colors">
          Refunds
        </button>
      </div>

      {/* Transactions Data Table */}
      <div className="w-full bg-[#161810] border border-[#2D3C13] rounded-[16px] p-6 overflow-x-auto">
        <div className="min-w-[900px] flex flex-col">
          {/* Table Header Row */}
          <div className="grid grid-cols-12 gap-4 pb-4 border-b border-[#2D3C13] font-sans text-[11px] font-medium text-[#5A752A] uppercase tracking-wider">
            <div className="col-span-2 pl-4">Transaction ID</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-4">Description</div>
            <div className="col-span-1">Amount</div>
            <div className="col-span-2 text-center">Payment Method</div>
            <div className="col-span-1 text-right pr-4">Status</div>
          </div>

          {/* Table Body Rows */}
          <div className="flex flex-col">
            {DUMMY_TRANSACTIONS.map((transaction, index) => (
              <div 
                key={transaction.id} 
                className={`grid grid-cols-12 gap-4 py-5 items-center font-sans transition-colors hover:bg-[#1A230A]/50 ${index !== DUMMY_TRANSACTIONS.length - 1 ? 'border-b border-[#1A230A]' : ''}`}
              >
                {/* Transaction ID */}
                <div className="col-span-2 pl-4 font-medium text-[13px] text-[#72943A]">
                  {transaction.transactionId}
                </div>

                {/* Date */}
                <div className="col-span-2 font-normal text-[13px] text-[#72943A]">
                  {transaction.date}
                </div>

                {/* Description */}
                <div className="col-span-4 font-medium text-[13px] text-[#E8EDD4] truncate pr-4">
                  {transaction.description}
                </div>

                {/* Amount */}
                <div className="col-span-1 font-medium text-[13px] text-[#E8EDD4]">
                  {transaction.amount}
                </div>

                {/* Payment Method */}
                <div className="col-span-2 text-center font-normal text-[13px] text-[#72943A]">
                  {transaction.paymentMethod}
                </div>

                {/* Status */}
                <div className="col-span-1 flex justify-end pr-4">
                  {transaction.status === "completed" && (
                    <div className="px-3 py-1 rounded-full border border-[#4ADE80]/20 bg-[#083b18]">
                      <span className="text-[10px] font-medium text-[#4ADE80] uppercase tracking-wide">Completed</span>
                    </div>
                  )}
                  {transaction.status === "refunded" && (
                    <div className="px-3 py-1 rounded-full border border-[#F59E0B]/20 bg-[#78350F]">
                      <span className="text-[10px] font-medium text-[#F59E0B] uppercase tracking-wide">Refunded</span>
                    </div>
                  )}
                  {transaction.status === "failed" && (
                    <div className="px-3 py-1 rounded-full border border-[#EF4444]/20 bg-[#7F1D1D]">
                      <span className="text-[10px] font-medium text-[#EF4444] uppercase tracking-wide">Failed</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
