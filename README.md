# NexaScale — Setup Guide (Hinglish)

## Ye files kya hain

Ye poora frontend hai — landing page, login, signup, dashboard, pricing — dark UI ke saath, mobile pe bhi sahi dikhega. Vercel pe **abhi seedha deploy ho sakta hai**, koi coding kiye bina.

## Abhi kya REAL hai, kya PLACEHOLDER hai

| Feature | Status |
|---|---|
| UI design (sab pages) | ✅ Real, fully working |
| Login/Signup form | ⚠️ Kaam karta hai but sirf ek hi phone/browser pe (localStorage) — ye real account system nahi hai |
| Gmail/SMTP connect buttons | ❌ Placeholder — click karne par alert dikhata hai |
| Stripe $25 payment button | ❌ Placeholder — click karne par alert dikhata hai |
| Gemini AI lead replies | ❌ Abhi sirf demo data dikh raha hai (fake leads), real AI call nahi ho raha |

**Ye sab isliye placeholder hai kyunki inke liye tumhari khud ki accounts aur secret keys chahiye — main wo tumhare liye nahi bana sakta, sirf tum bana sakte ho apne naam se.**

---

## Step 1: Vercel pe deploy karo (5 minute, abhi ho sakta hai)

1. [vercel.com](https://vercel.com) pe free account banao (GitHub se sign in kar sakte ho)
2. Ye saari files ek GitHub repo mein daalo (ya Vercel ka "drag and drop" upload use karo)
3. Deploy dabao — turant live link mil jayega

Ye step abhi ho sakta hai, koi backend chahiye nahi.

---

## Step 2: Real login/signup (Supabase — free tier)

1. [supabase.com](https://supabase.com) pe free project banao
2. Authentication → Providers mein Email enable karo
3. Supabase docs mein "Auth quickstart" copy-paste karke `auth-demo.js` ki jagah use karo
4. Isse real database mein users store honge, sab devices pe kaam karega

## Step 3: Real Stripe payment (free to set up, per-transaction fee lagta hai)

1. [stripe.com](https://stripe.com) pe account banao apne bank details ke saath
2. Dashboard → Payment Links → $25/month ka ek product/price banao
3. Wo link `pricing.html` ke andar comment mein diye gaye jagah pe daal do
4. Ab button click karne se real Stripe checkout khulega, paisa seedha tumhare account mein aayega

## Step 4: Gmail/SMTP connect (Google OAuth chahiye)

Ye thoda technical hai — Google Cloud Console mein project banana padega OAuth ke liye. Jab is step tak pahunch jao, bata dena, isko bhi step-by-step karwa dunga.

## Step 5: Gemini AI replies

1. [ai.google.dev](https://ai.google.dev) se free Gemini API key lo
2. Ye key sirf backend (server) pe use honi chahiye — frontend code mein kabhi mat daalna, warna koi bhi chura sakta hai
3. Iske liye ek chhota backend function chahiye hoga (Vercel "Serverless Function" free tier mein ban sakta hai)

---

## Sabse zaroori baat

Step 1 (Vercel deploy) abhi turant ho sakta hai — website live dikhegi, demo ke taur pe kaam karegi. Steps 2-5 real business ke liye zaroori hain but har ek alag time lega aur thoda samajhna padega.

Jab bhi ready ho agla step karne ke liye, bata dena — ek-ek karke saath mein karte hain.
