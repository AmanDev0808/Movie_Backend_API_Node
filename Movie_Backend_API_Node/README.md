# Cineverse Email Notification System (Nodemailer)

This directory contains the production-ready email notification system built using Nodemailer. It integrates seamlessly with payment verification and booking cancellation flows to deliver beautifully styled responsive HTML emails (Netflix × BookMyShow cinematic dark theme).

---

## Folder Structure

```
Movie_Backend_API_Node/
├── config/
│   └── mail.config.js       # SMTP Transporter initialization & Singleton exporter
├── helpers/
│   └── sendEmail.js         # Asynchronous, error-safe mailing wrapper with stdout logs
├── services/
│   └── email.service.js     # High-level database fetcher and email compiler
├── templates/
│   ├── bookingConfirmation.js # HTML body for booking validations
│   ├── ticketTemplate.js      # Cinematic perforated card layout body
│   ├── cancellationTemplate.js# HTML body confirming released seats
│   └── refundTemplate.js      # Details of simulated Razorpay refund status
├── utils/
│   └── emailTemplates.js    # Shared modular design templates (Header, Footer, Cards)
└── README.md                # This documentation file
```

---

## Technical Details

### 1. Where Emails are Triggered
- **Booking Confirmation & Digital Ticket**: Triggered asynchronously within `service/payment.service.js` immediately after a successful payment verification (signature verify success) or webhook capture (`payment.captured` event). An atomic `findOneAndUpdate` lock prevents duplicate mail sends.
- **Booking Cancellation & Refund Initiated**: Triggered asynchronously in `service/booking.service.js` immediately after `cancelSuccessBooking` transaction commits (setting booking to CANCELLED and payment status to REFUNDED).

### 2. Error-Resilient Design
- All SMTP calls run **asynchronously** without blocking the Express response thread.
- Every email delivery promise has catch handlers attached. If SMTP credentials fail or are invalid, the error is caught and logged, but booking creation and cancellation checkout transactions **always succeed without crashes**.

---

## Configuration (`.env`)

Add the following keys to your `Movie_Backend_API_Node/.env` file:

```env
# Nodemailer SMTP Configuration
EMAIL_HOST=your_smtp_host
EMAIL_PORT=your_smtp_port
EMAIL_USER=your_smtp_username
EMAIL_PASS=your_smtp_password
EMAIL_FROM="Cineverse Support" <noreply@cineverse.com>

# Frontend Endpoint (For email ticket action buttons)
FRONTEND_URL=http://localhost:5173
```

---

## How to Test

### Option A: Mailtrap (Recommended for Local Dev)
Mailtrap intercepts sent emails in a private test inbox.
1. Sign up/log in at [mailtrap.io](https://mailtrap.io).
2. Go to **Email Sandbox** > **Inboxes** > **SMTP Settings**.
3. Copy the configuration credentials and add them to your `.env` file:
   ```env
   EMAIL_HOST=sandbox.smtp.mailtrap.io
   EMAIL_PORT=2525
   EMAIL_USER=your_mailtrap_user_id
   EMAIL_PASS=your_mailtrap_password
   EMAIL_FROM="Cineverse Support" <noreply@cineverse.com>
   ```

### Option B: Ethereal (Zero Signup Sandbox)
Ethereal provides instant, throwaway SMTP credentials:
1. Visit [ethereal.email](https://ethereal.email) and click **Create Ethereal Account**.
2. Copy the SMTP configuration fields to your `.env`:
   ```env
   EMAIL_HOST=smtp.ethereal.email
   EMAIL_PORT=587
   EMAIL_USER=your_ethereal_username
   EMAIL_PASS=your_ethereal_password
   EMAIL_FROM="Cineverse Support" <noreply@cineverse.com>
   ```
3. After triggering an email, check your inbox directly at the Ethereal login panel.

### Option C: Gmail SMTP (For Live Delivery)
To send emails to real inboxes using Gmail, you must generate an **App Password**:
1. Go to your Google Account Settings > **Security**.
2. Enable **2-Step Verification** (required for App Passwords).
3. Search for "App Passwords" in the search bar.
4. Select App: `Other (Custom)`, type "Cineverse", and click **Generate**.
5. Copy the 16-character code and apply it to `.env`:
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_gmail_address@gmail.com
   EMAIL_PASS=your_16_character_app_password
   EMAIL_FROM="Cineverse Support" <your_gmail_address@gmail.com>
   ```
