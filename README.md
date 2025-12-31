
# Pahara Guard Card Management - নিরাপত্তা প্রহরী আইডি কার্ড জেনারেটর

![Guard Card Generator Screenshot](https://i.imgur.com/your-screenshot.png) <!-- আপনি এখানে আপনার অ্যাপের একটি স্ক্রিনশট যুক্ত করতে পারেন -->

"Pahara Guard Card Management" একটি ওয়েব অ্যাপ্লিকেশন যা নিরাপত্তা প্রহরীদের জন্য পেশাদার আইডি কার্ড তৈরি করার প্রক্রিয়াকে সহজ করে তোলে। এই টুলটি ব্যবহার করে একক কার্ড তৈরি করা যায়, আবার একটি তালিকা থেকে একসাথে একাধিক কার্ডও (বাল্ক) তৈরি করা সম্ভব।

This is a Next.js application for generating security guard ID cards. It supports generating single cards as well as bulk generation from a list of guards.

## Features (প্রধান বৈশিষ্ট্যসমূহ)

- **Single Card Generation (একক কার্ড তৈরি):** একজন নিরাপত্তা প্রহরীর তথ্য পূরণ করে তাৎক্ষণিকভাবে আইডি কার্ড তৈরি করা যায়।
- **Bulk Card Generation (বাল্ক কার্ড তৈরি):** একটি ফর্মের মাধ্যমে একাধিক প্রহরীর তথ্য যোগ করে একসাথে অনেকগুলো আইডি কার্ড তৈরি করা যায়।
- **Photo Upload (ছবি আপলোড):** প্রতিটি কার্ডে প্রহরীর ছবি যোগ করার জন্য সহজ ফটো আপলোডার।
- **Static QR Code (স্থির QR কোড):** প্রতিটি কার্ডে একটি QR কোড থাকে, যা স্ক্যান করলে জরুরি যোগাযোগের নম্বরগুলো দেখা যায়।
- **Download Card (কার্ড ডাউনলোড):** তৈরি করা প্রতিটি কার্ড PNG ফরম্যাটে ডাউনলোড করার সুবিধা।
- **Print Friendly (প্রিন্ট-বান্ধব):** একক অথবা একাধিক কার্ড সরাসরি ব্রাউজার থেকে প্রিন্ট করার জন্য অপটিমাইজ করা হয়েছে। A4 পেপারে একাধিক কার্ড প্রিন্ট করার জন্য লেআউট স্বয়ংক্রিয়ভাবে ঠিক হয়ে যায়।

## How to Use (ব্যবহারবিধি)

অ্যাপ্লিকেশনটি ব্যবহার করা খুবই সহজ। দুটি প্রধান ট্যাব রয়েছে: "একক কার্ড" এবং "বাল্ক জেনারেট"।

### Single Card Generation (একক কার্ড তৈরি)

1.  **"একক কার্ড"** ট্যাবে যান।
2.  ফর্মটিতে প্রহরীর **পুরো নাম**, **ঠিকানা**, এবং **আইডি নম্বর** পূরণ করুন।
3.  প্রয়োজনে **ছবি আপলোড করুন**।
4.  "কার্ড আপডেট করুন" বাটনে ক্লিক করলে ডানপাশে কার্ডের একটি প্রিভিউ দেখতে পাবেন।
5.  প্রিভিউর নিচে থাকা **"ডাউনলোড"** বাটনে ক্লিক করে কার্ডটি ছবি হিসেবে সংরক্ষণ করতে পারেন অথবা **"প্রিন্ট করুন"** বাটনে ক্লিক করে সরাসরি প্রিন্ট করতে পারেন।

### Bulk Card Generation (বাল্ক জেনারেট)

1.  **"বাল্ক জেনারেট"** ট্যাবে যান।
2.  প্রথমে সাধারণ তথ্য, যেমন—সকল কার্ডের জন্য প্রযোজ্য **সাধারণ ঠিকানা** এবং **সাধারণ জরুরি যোগাযোগ** নম্বরগুলো পূরণ করুন।
3.  নিচে প্রতিটি গার্ডের জন্য আলাদা আলাদা ফর্ম দেখতে পাবেন। সেখানে গার্ডের **নাম**, **আইডি নম্বর** এবং **ছবি** আপলোড করুন।
4.  আরও গার্ড যোগ করার জন্য **"নতুন গার্ড যোগ করুন"** বাটনে ক্লিক করুন।
5.  সকল তথ্য পূরণ হয়ে গেলে **"কার্ডগুলো জেনারেট করুন"** বাটনে ক্লিক করুন। ডানপাশে সকল কার্ডের প্রিভিউ প্রদর্শিত হবে।
6.  আপনি প্রতিটি কার্ডের নিচে থাকা **"ডাউনলোড"** বাটন ব্যবহার করে আলাদাভাবে ডাউনলোড করতে পারেন অথবা **"সবগুলো প্রিন্ট করুন"** বাটনে ক্লিক করে সবগুলো কার্ড একসাথে প্রিন্ট করতে পারেন।

## Technology Stack (ব্যবহৃত প্রযুক্তি)

- **Framework:** Next.js
- **UI Library:** React
- **Styling:** Tailwind CSS
- **Components:** ShadCN UI
- **Form Management:** React Hook Form & Zod
- **Image Conversion:** html-to-image
- **QR Code Generation:** qrcode

## Getting Started (লোকাল মেশিনে চালানো)

First, install the dependencies:
প্রথমে, প্রয়োজনীয় প্যাকেজগুলো ইনস্টল করুন:

```bash
npm install
```

Then, run the development server:
তারপর, ডেভলপমেন্ট সার্ভার চালু করুন:

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## Deploy on Vercel (Vercel-এ হোস্ট করুন)

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

আপনার GitHub একাউন্টে এই প্রজেক্টটি পুশ করুন এবং Vercel-এ আপনার GitHub রিপোজিটরিটি ইম্পোর্ট করুন। Vercel স্বয়ংক্রিয়ভাবে প্রজেক্টটি বিল্ড এবং ডেপ্লয় করে দেবে।

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
