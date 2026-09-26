# Instant Win & Ticket Allocation System Architecture (Detailed Explanation)

এই ডকুমেন্টে Airsoft Draws প্ল্যাটফর্মের **Instant Win** এবং **Ticket Allocation** সিস্টেম শুরু থেকে শেষ পর্যন্ত (Host Setup -> Payment -> Ticket Generation -> Instant Win Detection -> Claim Flow) কীভাবে কাজ করে তা বিস্তারিতভাবে ব্যাখ্যা করা হলো।

---

## ১. সিস্টেম ওভারভিউ এবং মূল ধারণা (Core Concept)

Airsoft Draws প্ল্যাটফর্মে যেকোনো কম্পিটিশনে (Raffle) মূলত **দুই ধরণের প্রাইজ ড্র** থাকে:

1. **Main Grand Prize Draw**:
   - কম্পিটিশন শেষ হওয়ার পর (ড্র ডেট আসলে বা সব টিকিট বিক্রি হয়ে গেলে) সকল বিক্রি হওয়া টিকিটের মধ্য থেকে একটি লাকি ড্র এর মাধ্যমে মূল বিজয়ী নির্বাচন করা হয়।
2. **Instant Win Prizes**:
   - এটি টিকিট কেনার সাথে সাথে **তাৎক্ষণিক (Real-Time)** নির্ধারিত হয়।
   - হোস্ট যখন কম্পিটিশন তৈরি করে, তখন কিছু নির্দিষ্ট টিকিট নম্বরের সাথে আগে থেকেই ইনস্ট্যান্ট প্রাইজ যুক্ত করে দেওয়া হয়।
   - টিকিট কেনার সাথে সাথে সিস্টেম চেক করে যে ব্যবহারকারীর প্রাপ্ত টিকিট নম্বরের সাথে কোনো ইনস্ট্যান্ট উইন প্রাইজ মিলেছে কি না।
   - **সবচেয়ে গুরুত্বপূর্ণ বৈশিষ্ট্য**: কোনো টিকিট ইনস্ট্যান্ট উইন জিতলেও, সেই টিকিটটি বাতিল হয় না! টিকিটটি ভবিষ্যতেও **Main Grand Prize Draw-এর জন্য পুরোপুরি ভ্যালিড এবং সক্রিয় থাকে** (Double winning chance)।

---

## ২. কম্পিটিশন তৈরি ও ইনস্ট্যান্ট উইন সেটআপ (Host Setup Flow)

**কোড রেফারেন্স:** [`backend/src/raffles/raffles.service.ts`](file:///Users/syedrakibhasan/projects/airsoft-draws/backend/src/raffles/raffles.service.ts#L118-L155)

১. **সাবস্ক্রিপশন প্ল্যান ভ্যালিডেশন**:
   - হোস্ট যদি কোনো কম্পিটিশনে Instant Win যোগ করতে চায়, তাহলে তার `Premium` বা `Pro` সাবস্ক্রিপশন প্ল্যান থাকতে হবে। `Free` প্ল্যানে ইনস্ট্যান্ট উইন তৈরি করা নিষিদ্ধ।

২. **ইউনিক লাকি টিকিট নম্বর অ্যাসাইন করা (Secret Lucky Numbers)**:
   - ধরি, একটি কম্পিটিশনে মোট টিকিট সংখ্যা (`totalTickets`) = ৫০০টি এবং হোস্ট ৩টি ইনস্ট্যান্ট উইন প্রাইজ দিতে চায়।
   - সিস্টেম ১ থেকে ৫০০ এর মধ্য থেকে ৩টি একদম র‍্যান্ডম ও ইউনিক নম্বর জেনারেট করে:
     ```typescript
     const uniqueTickets = new Set<number>();
     while (uniqueTickets.size < numInstantWins) {
       uniqueTickets.add(Math.floor(Math.random() * totalTickets) + 1);
     }
     const ticketNumbers = Array.from(uniqueTickets);
     ```
   - প্রতিটি প্রাইজকে একটি নির্দিষ্ট টিকিট নম্বরের সাথে ডাটাবেজের `InstantWin` টেবিলে সেভ করা হয়:
     - `raffleId`: কম্পিটিশন আইডি
     - `ticketNumber`: যে টিকিট নম্বরে প্রাইজটি সেট করা হয়েছে (যেমন: #৭৭, #১৫৩, #৪১২)
     - `prizeName`: প্রাইজটির নাম (যেমন: Tokyo Marui Hi-Capa Gas Pistol)
     - `rrpValue`: প্রাইজটির আনুমানিক বাজার মূল্য
     - `image`: প্রাইজের ছবি
     - `isClaimed`: শুরুতে `false` থাকে

---

## ৩. টিকিট কেনা ও টিকিট নম্বর ম্যানেজমেন্ট (Ticket Allocation & Concurrency)

**কোড রেফারেন্স:** [`backend/src/tickets/tickets.service.ts`](file:///Users/syedrakibhasan/projects/airsoft-draws/backend/src/tickets/tickets.service.ts#L156-L235)

টিকিট কেনার সময় কীভাবে টিকিট নম্বরগুলো কোনো ডুপ্লিকেট ছাড়া ফেয়ারলি ও র‍্যান্ডমলি অ্যাসাইন করা হয়?

১. **ডাটাবেজ ট্রানজেকশন (ACID Isolation)**:
   - সম্পূর্ণ প্রসেসটি `prisma.$transaction(async (tx) => { ... })`-এর ভেতরে চলে।
   - ফলে একই সময়ে একাধিক ইউজার একসাথে টিকিট কিনলেও কোনো রেস কন্ডিশন (Race Condition) ঘটে না এবং একই টিকিট নম্বর দুইজন ইউজার পাওয়ার কোনো সম্ভাবনা থাকে না।

২. **উপলব্ধ টিকিট পুল বের করা (Available Pool Calculation)**:
   - ডাটাবেজে আগে বিক্রি হয়ে যাওয়া সব টিকিট নম্বর ফেচ করা হয়:
     ```typescript
     const existingTickets = await tx.ticket.findMany({
       where: { raffleId },
       select: { ticketNumber: true },
     });
     const usedNumbers = new Set(existingTickets.map((t) => t.ticketNumber));
     ```
   - ১ থেকে `totalTickets` পর্যন্ত যে নম্বরগুলো এখনও বিক্রি হয়নি, সেগুলোকে `availableNumbers` পুলে রাখা হয়:
     ```typescript
     const availableNumbers: number[] = [];
     for (let i = 1; i <= raffle.totalTickets; i++) {
       if (!usedNumbers.has(i)) {
         availableNumbers.push(i);
       }
     }
     ```
   - যদি ইউজারের রিকোয়েস্ট করা টিকিটের সংখ্যা অবশিষ্ট টিকিটের চেয়ে বেশি হয়, সাথে সাথে এরর থ্রো করা হয়: `'Not enough ticket numbers available'`.

৩. **ফিশার-ইয়েটস র‍্যান্ডম শাফলিং (Fisher-Yates Shuffle Algorithm)**:
   - টিকিট নম্বরগুলো ক্রমানুসারে (Sequential) দেওয়া হয় না, যাতে কেউ প্রেডিক্ট করতে না পারে।
   - অবশিষ্ট টিকিট নম্বরগুলোকে Fisher-Yates অ্যালগরিদমের মাধ্যমে সম্পূর্ণ এলোমেলো (Shuffle) করা হয়:
     ```typescript
     for (let i = availableNumbers.length - 1; i > 0; i--) {
       const j = Math.floor(Math.random() * (i + 1));
       [availableNumbers[i], availableNumbers[j]] = [
         availableNumbers[j],
         availableNumbers[i],
       ];
     }
     const assignedNumbers = availableNumbers.slice(0, quantity);
     ```
   - শাফলিং-এর পর প্রথম `quantity` সংখ্যক নম্বর ইউজারকে বরাদ্দ করা হয়।

৪. **টিকিট রেকর্ড সংরক্ষণ**:
   - বরাদ্দকৃত নম্বরগুলো ডাটাবেজের `Ticket` টেবিলে ইউজারের অ্যাকাউন্টের সাথে যুক্ত করে তৈরি করা হয়:
     - `userId`: ব্যবহারকারীর আইডি
     - `raffleId`: কম্পিটিশন আইডি
     - `transactionId`: পেমেন্ট ট্রানজেকশন আইডি
     - `ticketNumber`: বরাদ্দকৃত লাকি নম্বর (যেমন: #৭৭)
     - `acceptedTermsVersion`: কমপ্লায়েন্স টার্মস ভার্সন

---

## ৪. ইনস্ট্যান্ট উইন ডিটেকশন ও ম্যাচিং লজিক (Instant Win Detection)

**কোড রেফারেন্স:** [`backend/src/tickets/tickets.service.ts`](file:///Users/syedrakibhasan/projects/airsoft-draws/backend/src/tickets/tickets.service.ts#L245-L280)

ইউজারের টিকিট তৈরি হওয়ার সাথে সাথেই **একই ডাটাবেজ ট্রানজেকশনের ভেতরে** ইনস্ট্যান্ট উইন চেক করা হয়:

```typescript
// Check for Instant Wins
const userInstantWins: any[] = [];

for (const ticket of createdTickets) {
  const matchedInstantWin = raffle.instantWins.find(
    (iw) => iw.ticketNumber === ticket.ticketNumber && !iw.isClaimed,
  );

  if (matchedInstantWin) {
    // ১. InstantWin টেবিলে প্রাইজটি ক্লেইমড মার্ক করা যাতে আর কেউ এটি না পায়
    await tx.instantWin.update({
      where: { id: matchedInstantWin.id },
      data: { isClaimed: true },
    });

    // ২. Winner টেবিলে বিজয়ী রেকর্ড তৈরি
    const winner = await tx.winner.create({
      data: {
        userId,
        raffleId: raffle.id,
        ticketId: ticket.id,
        winType: 'INSTANT_WIN',
        prizeName: matchedInstantWin.prizeName,
        deliveryStatus: 'PENDING',
        verificationStatus: 'WINNER_SELECTED',
        ukaraStatus: isRifCompetition ? 'PENDING_VERIFICATION' : 'NOT_REQUIRED',
        isClaimed: false, // ইউজার ক্লেইম করার জন্য রেডি
      },
    });

    userInstantWins.push({
      ...winner,
      ticketNumber: ticket.ticketNumber,
      raffleTitle: raffle.title,
      prizeImage: matchedInstantWin.image || null,
      rrpValue: matchedInstantWin.rrpValue ? Number(matchedInstantWin.rrpValue) : null,
    });
  }
}
```

- **রিয়েল-টাইম নোটিফিকেশন**:
  - যদি কেউ ইনস্ট্যান্ট উইন পায়, সাথে সাথে ক্রেতার কাছে নোটিফিকেশন চলে যায়: *"🎉 Instant Win Prize Claimed!"*
  - একই সাথে হোস্টের কাছেও এলার্ট যায়: *"Instant Win Hit on Competition"*.

---

## ৫. পেমেন্ট গেটওয়ে এবং সাকসেস রিটার্ন ফ্লো (Payment Lifecycle)

**কোড রেফারেন্স:** [`backend/src/payment/payment.service.ts`](file:///Users/syedrakibhasan/projects/airsoft-draws/backend/src/payment/payment.service.ts#L800-L905)

```
[ ইউজার টিকিট সিলেক্ট করে ] 
         │
         ▼
[ Cashflows Gateway-এ পেমেন্ট সম্পন্ন ]
         │
         ▼
[ Redirect to /payment/success?type=basket&order=BSK_... ]
         │
         ▼
[ Frontend API Call: POST /payment/confirm ]
         │
         ▼
[ Backend: ভেরিফাই পেমেন্ট -> ট্রানজেকশনে টিকিট এলোকেশন ও ইনস্ট্যান্ট উইন চেক ]
         │
         ▼
[ Response: { success: true, tickets: [...], instantWins: [...] } ]
```

- **ওয়েবহুক ও কনফার্মেশন রেজিলিয়েন্স**:
  - ক্যাশফ্লোজ গেটওয়ে থেকে রিটার্ন আসার সময় ব্যাকএন্ড পেমেন্ট স্ট্যাটাস ভেরিফাই করে টিকিট ও ইনস্ট্যান্ট উইন জেনারেট করে।
  - যদি পেজ রিফ্রেশ হয় বা ক্যাশফ্লোজের ব্যাকগ্রাউন্ড ওয়েবহুক আগেই কনফার্ম করে ফেলে, তাহলেও `payment.service.ts` ডাটাবেজ থেকে সেই ট্রানজেকশনের ইনস্ট্যান্ট উইনগুলো খুঁজে রিটার্ন করে, ফলে কোনো ডেটা মিস হয় না।

---

## ৬. ফ্রন্টএন্ড অ্যানিমেশন এবং রোল লজিক (Frontend UI Flow)

**কোড রেফারেন্স:**
- [`frontend/app/payment/success/page.tsx`](file:///Users/syedrakibhasan/projects/airsoft-draws/frontend/app/payment/success/page.tsx)
- [`frontend/components/ui/WinAnimationModal.tsx`](file:///Users/syedrakibhasan/projects/airsoft-draws/frontend/components/ui/WinAnimationModal.tsx)

### ক. হোমপেজ থেকে কেন সরানো হয়েছে?
- পূর্বে `providers.tsx`-এ গ্লোবাল ম্যানেজার থাকার কারণে ইউজার যখনই হোমপেজে আসতো, এটি ডাটাবেজে চেক করতো এবং কোনো আনক্লেইমড প্রাইজ থাকলে হোমপেজেই হুট করে পপআপ দিয়ে দিতো।
- এখন এটি `providers.tsx` থেকে সম্পূর্ণ রিমুভ করা হয়েছে। হোমপেজে এখন আর কোনো ইনস্ট্যান্ট উইন পপআপ বা ডাটাবেজ চেক চলবে না।

### খ. পেমেন্ট সাকসেস পেজে অটোমেটিক অ্যানিমেশন:
- ইউজার পেমেন্ট সম্পন্ন করে `/payment/success` পেজে আসলে:
  1. **রোল চেক**: ইউজার রোল যদি `HOST` হয় অথবা পেমেন্টটি হোস্টের সাবস্ক্রিপশন প্ল্যান (`SUB_...`) হয়, তবে মোডাল **দেখাবে না**।
  2. ইউজার যদি সাধারণ টিকিট ক্রেতা (`USER` / `CLIENT`) হয়, তবে পেজ লোডের **৩৫০ মিলিসেকেন্ডের মধ্যে অ্যানিমেশন মোডালটি অটোমেটিক ওপেন হবে**।

### গ. অ্যানিমেশন স্টেজ (জিতুক বা না জিতুক):
- **স্টেজ ১ (রোলিং সাসপেন্স - ২.৪ সেকেন্ড)**:
  - স্লট-মেশিন টাইপ ফাস্ট রোলিং নম্বর ঘুরতে থাকবে।
  - টেক্সট দেখাবে: *"Checking Tickets... Scanning prize database... Verifying Lucky Numbers..."*
- **স্টেজ ২ (রেজাল্ট রিভিল)**:
  - **যদি ইনস্ট্যান্ট উইন জিতে থাকে (`modalPrizes.length > 0`)**:
    - হেডিং: *"🎉 You Won Instant Win Prize!"*
    - প্রতিটি উইনিং প্রাইজ কার্ড আকারে টিকিট নম্বর, প্রাইজের ছবি, নাম এবং RRP ভ্যালুসহ দেখাবে।
    - নিচে **"Claim Prize"** বাটন থাকবে।
  - **যদি ইনস্ট্যান্ট উইন না জিতে (`modalPrizes.length === 0`)**:
    - হেডিং: *"No Instant Win This Time"*
    - সাবটাইটেল: *"Better luck next time!"*
    - বডি কার্ডে চমৎকার মেসেজ: *"None of your ticket numbers matched an instant win prize, but every ticket is confirmed and entered for the Grand Prize draw!"*
    - নিচে "View My Tickets" বাটন থাকবে।
  - উপরে ডানপাশে (✕) ক্লোজ বাটন থাকবে, যা দিয়ে ইউজার যেকোনো সময় বন্ধ করতে পারবে।

---

## ৭. প্রাইজ ক্লেইম এবং ডেলিভারি লাইফসাইকেল (Claim & Delivery Flow)

**কোড রেফারেন্স:** [`backend/src/users/users.service.ts`](file:///Users/syedrakibhasan/projects/airsoft-draws/backend/src/users/users.service.ts#L271-L293)

১. **Claim বাটনে ক্লিক করলে**:
   - ফ্রন্টএন্ড থেকে কল হয়: `POST /users/claim-instant-wins` সাথে উইনার আইডিগুলো।
   - ব্যাকএন্ড ডাটাবেজের `winner` টেবিলে `isClaimed = true` আপডেট করে।
   - স্ক্রিনে সাথে সাথে কনফার্মেশন টোস্ট দেখায়: *"🎉 Instant Win prize claimed!"*

২. **ড্যাশবোর্ডে স্ট্যাটাস ট্র্যাকিং**:
   - **User Dashboard (`/dashboard/user/tickets`)**:
     - ইউজারের কেনা টিকিটগুলোর পাশে `instant-win` ব্যাজ দেখা যায়।
   - **User Winnings (`/dashboard/user/winners`)**:
     - ইউজার তার সমস্ত জিতা প্রাইজ দেখতে পারে এবং কোনটা Claimed আর কোনটা Unclaimed তা স্পষ্ট দেখতে পায়।
     - মোডাল বন্ধ করে দিলেও ইউজার ড্যাশবোর্ড থেকে পরবর্তীতে যেকোনো সময় ক্লেইম করতে পারে।
   - **Host Dashboard (`/dashboard/host/competitions`)**:
     - হোস্ট দেখতে পায় কোন টিকিটে ইনস্ট্যান্ট উইন হয়েছে, ইউজারের সাথে যোগাযোগ করতে পারে এবং ডেলিভারি ট্র্যাকিং কোড যোগ করতে পারে।

---

## সংক্ষেপে আর্কিটেকচার সামারি (Quick Summary)

| ধাপ | প্রক্রিয়া | যেখানে ঘটে | ফলাফল |
|---|---|---|---|
| **১. তৈরি** | হোস্ট কম্পিটিশনে Instant Win যোগ করে | `raffles.service.ts` | র‍্যান্ডম টিকিট নম্বরের সাথে `InstantWin` তৈরি হয় |
| **২. পেমেন্ট** | ক্রেতা টিকিট কিনে টাকা পরিশোধ করে | Cashflows Gateway | পেমেন্ট কমপ্লিট হয়ে `/payment/success`-এ রিডাইরেক্ট হয় |
| **৩. এলোকেশন** | ডাটাবেজ ট্রানজেকশনে টিকিট বরাদ্দ | `tickets.service.ts` | Fisher-Yates শাফলিংয়ের মাধ্যমে ডুপ্লিকেট-হীন ইউনিক টিকিট নম্বর তৈরি |
| **৪. ম্যাচিং** | কেনা নম্বরের সাথে Instant Win চেক | `tickets.service.ts` | ম্যাচ পেলে `winner` রেকর্ড তৈরি এবং নোটিফিকেশন সেন্ড |
| **৫. অ্যানিমেশন** | পেমেন্ট সাকসেস পেজে অটো-ওপেন | `WinAnimationModal.tsx` | ২.৪ সেকেন্ড রোলিং সাসপেন্স; জিতুক বা না জিতুক ফলাফল প্রদর্শন |
| **৬. ক্লেইম** | ইউজার "Claim Prize"-এ ক্লিক করে | `users.service.ts` | ডাটাবেজে `isClaimed: true` হয় এবং ড্যাশবোর্ডে ট্র্যাকিং চলে যায় |
