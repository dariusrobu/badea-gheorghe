# Stripe Payment Integration for Catering Orders

## Overview
The catering ordering system includes support for online payments through Stripe Checkout.

## Setup Instructions

### 1. Create a Stripe Account
1. Go to https://stripe.com and create an account
2. Navigate to the Dashboard → API Keys
3. Copy your **Publishable Key** (starts with `pk_`)
4. Copy your **Secret Key** (starts with `sk_`)

### 2. Configure Environment Variables (Vercel)
In your Vercel project settings, add:
- `STRIPE_SECRET_KEY` = your secret key
- `NEXT_PUBLIC_URL` = https://badea-gheorghe.vercel.app

### 3. Update the JavaScript
In `js/catering.js`, replace the placeholder:
```javascript
const STRIPE_PUBLISHABLE_KEY = 'pk_test_YOUR_STRIPE_PUBLISHABLE_KEY';
```

### 4. The Payment Flow
1. Customer selects catering items
2. Fills in delivery details
3. Clicks "Plasează Comanda"
4. Order is saved to Sanity with status "pending"
5. Customer is redirected to Stripe Checkout
6. After payment, customer returns to success page
7. Order status in Sanity is updated to "paid"

### 5. Webhook for Payment Confirmation (Optional)
For production, set up a webhook to automatically update order status when payment succeeds:

```javascript
// api/webhook.js - handles Stripe webhooks
```

## Current Status
- API endpoint created at `/api/create-checkout.js`
- JavaScript updated to support payment flow
- Need: Stripe account and API keys to activate

## Testing
Use Stripe's test mode with test card numbers:
- 4242 4242 4242 4242 (success)
- 4000 0000 0000 0002 (decline)