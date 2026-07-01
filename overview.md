# Airsoft Draws - High-Level Interactive Overview

> [!NOTE]
> **কীভাবে দেখবেন? (How to view):** VSCode-এ এই ফাইলের ডানপাশে উপরে থাকা "Open Preview to the Side" (Magnifying Glass আইকন) এ ক্লিক করুন। তাহলে নিচের ফ্লো-চার্টটি একটি চমৎকার ইন্টারঅ্যাক্টিভ ডায়াগ্রাম হিসেবে দেখতে পাবেন!

এই ডায়াগ্রামটি আপনার `database.md` লজিকের উপর ভিত্তি করে তৈরি। এটি দেখলে যে কেউই বুঝতে পারবে সিস্টেমে কে কী করছে এবং একটি Raffle কীভাবে শুরু থেকে শেষ পর্যন্ত যায়।

## The Complete Platform Lifecycle

```mermaid
graph TD
    %% Define Styles (Colors)
    classDef client fill:#3b82f6,stroke:#2563eb,stroke-width:2px,color:#fff;
    classDef host fill:#10b981,stroke:#059669,stroke-width:2px,color:#fff;
    classDef admin fill:#ef4444,stroke:#dc2626,stroke-width:2px,color:#fff;
    classDef system fill:#8b5cf6,stroke:#7c3aed,stroke-width:2px,color:#fff;
    classDef db fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff;

    %% 1. Host Journey
    subgraph "1. Host Onboarding & Creation"
        H1([Host Registers]) ::: host
        H2[Buys Subscription Plan] ::: host
        H3[(Database: Subscriptions active)] ::: db
        H4[Host Creates Raffle & Sets Instant Wins] ::: host
        H5[Raffle State: PENDING_APPROVAL] ::: system
        
        H1 --> H2 --> H3 --> H4 --> H5
    end

    %% 2. Admin Approval
    subgraph "2. Admin Moderation"
        A1([Admin Logs In]) ::: admin
        A2{Reviews New Raffle} ::: admin
        A3[Approves Raffle] ::: admin
        A4[Raffle State: ACTIVE (Live on Site!)] ::: system

        H5 -.->|Waits for approval| A1
        A1 --> A2 --> A3 --> A4
    end

    %% 3. Client Journey
    subgraph "3. Client Ticket Purchase"
        C1([Client Browses Home Page]) ::: client
        C2[Selects Raffle & Clicks 'Buy Tickets'] ::: client
        C3[Pays via Stripe/PayPal] ::: system
        C4[(DB: Tickets Created & Host Wallet Increased)] ::: db
        C5{Is it an Instant Win?} ::: system
        C6[Yes! Winner gets Instant Prize] ::: client
        
        A4 -.->|Clients can now see it| C1
        C1 --> C2 --> C3 --> C4 --> C5
        C5 -- Match! --> C6
    end

    %% 4. Main Draw & Payouts
    subgraph "4. Main Draw & Host Payouts"
        D1[Raffle Timer Ends] ::: system
        D2[Admin Triggers Main Draw] ::: admin
        D3[System RNG Picks Main Winner] ::: system
        D4[(DB: Winner Details Saved)] ::: db
        D5([Everyone Views 'Winners Gallery']) ::: client
        
        W1[Host Requests Withdrawal] ::: host
        W2[Admin Approves & Sends Money] ::: admin

        C5 -- No Match --> D1
        C6 --> D1
        D1 --> D2 --> D3 --> D4 --> D5
        
        C4 -.->|Host sees earnings| W1
        W1 --> W2
    end
```

---

## 🚦 ফ্লো-এর সারসংক্ষেপ (Summary of the Journey)

1. **Host-এর কাজ:** হোস্ট প্রথমে সাবস্ক্রিপশন কিনে Raffle তৈরি করে এবং কোন কোন টিকিটে "Instant Win" থাকবে তা সেট করে দেয়।
2. **Admin-এর কাজ:** এডমিন সেটা এপ্রুভ করলে তবেই সেটা ওয়েবসাইটের হোম পেইজে লাইভ হয়।
3. **Client-এর কাজ:** ক্লায়েন্ট স্ট্রাইপ দিয়ে টিকিট কেনে। কেনার সাথে সাথেই সিস্টেম চেক করে যে ক্লায়েন্টের টিকিট নাম্বারটি "Instant Win" এর সাথে মিলে গেছে কিনা। মিললে সে সাথে সাথে জিতে যায়।
4. **Draw ও শেষ কাজ:** সময় শেষ হলে এডমিন একটা বাটনে ক্লিক করে মেইন ড্র (Main Draw) করে। যে জিতে তার নাম ও লোকেশন `winners` পেইজে সুন্দরভাবে শো করে। অন্যদিকে হোস্ট তার জমানো টাকা উত্তোলনের (Withdrawal) জন্য রিকোয়েস্ট পাঠায়।

> [!TIP]
> **ডেভেলপমেন্টের জন্য:** এই `overview.md` ফাইলটা আপনার প্রজেক্টের রুট ডিরেক্টরিতে রেখে দিতে পারেন। পরবর্তীতে নতুন কোনো ডেভেলপার টিমে যোগ দিলে, শুধু এই ডায়াগ্রামটা দেখলেই সে পুরো সিস্টেমের আর্কিটেকচার ২ মিনিটে বুঝে যাবে!
