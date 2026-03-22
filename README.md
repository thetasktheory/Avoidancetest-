# Avoidance Test

"What are you actually avoiding?" — AI-powered self-reflection tool.

## Deploy to Vercel (step by step)

### 1. Create GitHub repo
- Go to github.com → New repository → name it `avoidancetest` → Create
- Upload all these files to the repo

### 2. Deploy on Vercel
- Go to vercel.com → Add New Project
- Import your GitHub repo
- Click Deploy (Vercel auto-detects Vite)

### 3. Add your Claude API key
- In Vercel → your project → Settings → Environment Variables
- Add: `ANTHROPIC_API_KEY` = your key from console.anthropic.com

### 4. Set up Stripe
- Go to stripe.com → Payment Links → Create
- Product: "Full Avoidance Report" — $2.00
- After payment success URL: `https://tasktheory.com?paid=true`
- Copy the payment link URL
- In src/App.jsx, replace `YOUR_LINK_HERE` in STRIPE_PAYMENT_LINK

### 5. Connect tasktheory.com
In Namecheap DNS for tasktheory.com, add:
- Type: A | Host: @ | Value: 76.76.21.21
- Type: CNAME | Host: www | Value: cname.vercel-dns.com

In Vercel → project → Settings → Domains → add `tasktheory.com`

### 6. Launch
- Post on Reddit: r/selfimprovement, r/SideProject, r/InternetIsBeautiful
- Post your own result on Twitter/X
- Done.

## Revenue target
500 paying users/month × $2 = $1,000/month
Need ~5,000 visitors/month at 10% conversion
One good Reddit post = 10,000 visitors in a weekend
