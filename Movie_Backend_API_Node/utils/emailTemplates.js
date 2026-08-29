/**
 * Cineverse Email Templates Compiler Module.
 * Houses shared styled HTML partials and links them with template bodies.
 */

// Import template body modules
const bookingConfirmationTemplate = require('../templates/bookingConfirmation');
const ticketTemplateModule = require('../templates/ticketTemplate');
const cancellationTemplateModule = require('../templates/cancellationTemplate');
const refundTemplateModule = require('../templates/refundTemplate');

// ----------------------------------------------------
// SHARED DESIGN BLOCKS (Netflix x BookMyShow Dark Theme)
// ----------------------------------------------------

const getHeader = (title, subtitle = '') => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
      body { margin: 0; padding: 0; background-color: #050505; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
      table { border-collapse: collapse; }
      @media screen and (max-width: 600px) {
        .container { width: 100% !important; padding: 10px !important; }
        .details-col { display: block !important; width: 100% !important; margin-bottom: 15px !important; }
        .ticket-col { display: block !important; width: 100% !important; }
      }
    </style>
  </head>
  <body style="margin: 0; padding: 0; background-color: #050505; color: #ffffff;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #050505; min-height: 100%;">
      <tr>
        <td align="center" style="padding: 20px 0;">
          <table class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="width: 600px; background-color: #0c0c0c; border: 1px solid #1a1a1a; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.8);">
            <!-- Header Brand logo & Gradient -->
            <tr>
              <td style="background: linear-gradient(to bottom, #1f0406, #0c0c0c); padding: 40px 30px; text-align: center; border-bottom: 1px solid #220305;">
                <div style="font-size: 28px; font-weight: 900; color: #e50914; letter-spacing: -1.5px; text-transform: uppercase; margin-bottom: 15px;">🎬 CINEVERSE</div>
                <h1 style="font-size: 24px; font-weight: 800; color: #ffffff; margin: 0; letter-spacing: -0.5px; text-transform: uppercase;">${title}</h1>
                ${subtitle ? `<p style="font-size: 13px; color: #888888; font-weight: 500; margin: 8px 0 0 0; letter-spacing: 0.5px;">${subtitle}</p>` : ''}
              </td>
            </tr>
            <!-- Content Area -->
            <tr>
              <td style="padding: 30px 24px;">
`;

const getFooter = () => `
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td style="background-color: #080808; border-top: 1px solid #151515; padding: 30px; text-align: center;">
                <p style="font-size: 11px; color: #555555; margin: 0 0 12px 0; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px;">Enjoy Your Show!</p>
                <p style="font-size: 12px; color: #888888; margin: 0 0 20px 0; line-height: 1.6;">
                  If you have any questions or require support, visit our Help Center or contact our 24/7 client relations department.
                </p>
                <div style="margin-bottom: 20px;">
                  <a href="#" style="font-size: 11px; font-weight: bold; color: #e50914; text-decoration: none; text-transform: uppercase; letter-spacing: 1px; margin: 0 10px;">Account</a>
                  <span style="color: #333;">•</span>
                  <a href="#" style="font-size: 11px; font-weight: bold; color: #e50914; text-decoration: none; text-transform: uppercase; letter-spacing: 1px; margin: 0 10px;">Support</a>
                  <span style="color: #333;">•</span>
                  <a href="#" style="font-size: 11px; font-weight: bold; color: #e50914; text-decoration: none; text-transform: uppercase; letter-spacing: 1px; margin: 0 10px;">Refunds</a>
                </div>
                <p style="font-size: 10px; color: #444444; margin: 0;">
                  &copy; 2026 Cineverse Ltd. All Rights Reserved. Barcodes and scanning hashes represent digital validation stamps.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
`;

const getButton = (text, url) => `
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 25px 0;">
    <tr>
      <td align="center">
        <a href="${url}" style="background-color: #e50914; color: #ffffff; font-size: 12px; font-weight: 850; text-decoration: none; text-transform: uppercase; letter-spacing: 1px; padding: 14px 28px; border-radius: 12px; display: inline-block; box-shadow: 0 4px 15px rgba(229, 9, 20, 0.4); border: 1px solid #ff1c28;">
          ${text}
        </a>
      </td>
    </tr>
  </table>
`;

const getMovieCard = (movieName, theatreName, showDate, showTime, posterUrl = '') => `
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #121212; border: 1px solid #222; border-radius: 20px; overflow: hidden; margin-bottom: 25px;">
    <tr>
      ${posterUrl ? `
      <!-- Poster Left Column -->
      <td width="120" style="width: 120px; vertical-align: top; padding: 15px; border-right: 1px solid #1a1a1a;">
        <img src="${posterUrl}" width="100" style="width: 100px; border-radius: 12px; display: block; filter: brightness(0.95);" alt="Movie Poster">
      </td>
      ` : ''}
      <!-- Details Right Column -->
      <td style="padding: 20px; text-align: left; vertical-align: middle;">
        <span style="font-size: 9px; color: #e50914; font-weight: 900; letter-spacing: 1.5px; text-transform: uppercase; display: block; margin-bottom: 5px;">Your Selection</span>
        <h3 style="font-size: 20px; font-weight: 800; color: #ffffff; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: -0.5px;">${movieName}</h3>
        <p style="font-size: 13px; color: #aaaaaa; margin: 0 0 15px 0; font-weight: 500;">📍 ${theatreName}</p>
        
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top: 1px solid #1e1e1e; padding-top: 12px;">
          <tr>
            <td style="text-align: left;">
              <span style="font-size: 8px; color: #555555; font-weight: bold; text-transform: uppercase; display: block; margin-bottom: 2px;">Show Date</span>
              <span style="font-size: 13px; color: #ffffff; font-weight: bold;">📅 ${showDate}</span>
            </td>
            <td style="text-align: left; padding-left: 20px;">
              <span style="font-size: 8px; color: #555555; font-weight: bold; text-transform: uppercase; display: block; margin-bottom: 2px;">Show Time</span>
              <span style="font-size: 13px; color: #ffffff; font-weight: bold;">⏰ ${showTime}</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
`;

const getPaymentCard = (bookingId, orderId, paymentId, amount, status, date) => `
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #121212; border: 1px solid #222; border-radius: 20px; padding: 20px; margin-bottom: 20px; text-align: left;">
    <tr>
      <td colspan="2" style="border-bottom: 1px solid #1e1e1e; padding-bottom: 10px; margin-bottom: 10px;">
        <span style="font-size: 9px; color: #888888; font-weight: 900; letter-spacing: 1.5px; text-transform: uppercase;">Payment Receipt</span>
      </td>
    </tr>
    <tr>
      <td style="padding: 10px 0; font-size: 12px; color: #aaaaaa;">Booking ID:</td>
      <td align="right" style="padding: 10px 0; font-size: 12px; font-weight: bold; color: #ffffff; font-family: monospace;">${bookingId}</td>
    </tr>
    ${orderId ? `
    <tr>
      <td style="padding: 10px 0; font-size: 12px; color: #aaaaaa;">Razorpay Order ID:</td>
      <td align="right" style="padding: 10px 0; font-size: 12px; font-weight: bold; color: #ffffff; font-family: monospace;">${orderId}</td>
    </tr>
    ` : ''}
    ${paymentId ? `
    <tr>
      <td style="padding: 10px 0; font-size: 12px; color: #aaaaaa;">Transaction ID:</td>
      <td align="right" style="padding: 10px 0; font-size: 12px; font-weight: bold; color: #ffffff; font-family: monospace;">${paymentId}</td>
    </tr>
    ` : ''}
    <tr>
      <td style="padding: 10px 0; font-size: 12px; color: #aaaaaa;">Payment Date:</td>
      <td align="right" style="padding: 10px 0; font-size: 12px; font-weight: bold; color: #ffffff;">${date}</td>
    </tr>
    <tr>
      <td style="padding: 10px 0; font-size: 12px; color: #aaaaaa;">Payment Status:</td>
      <td align="right" style="padding: 10px 0;">
        <span style="font-size: 9px; font-weight: 900; background-color: ${status === 'SUCCESS' ? '#0f3a20' : '#4a3b10'}; color: ${status === 'SUCCESS' ? '#4ade80' : '#fbbf24'}; padding: 4px 10px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.5px;">
          ${status === 'SUCCESS' ? 'PAID' : status}
        </span>
      </td>
    </tr>
    <tr style="border-top: 1px solid #1e1e1e;">
      <td style="padding: 15px 0 0 0; font-size: 14px; font-weight: bold; color: #ffffff;">Total Charged:</td>
      <td align="right" style="padding: 15px 0 0 0; font-size: 18px; font-weight: 900; color: #e50914;">₹${amount}</td>
    </tr>
  </table>
`;

const getTicketCard = (movieName, theatreName, date, time, seatList, bookingId, paymentId, amount) => `
  <!-- Perforated Cinema Ticket Design -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 25px 0; border: 1px solid #333333; border-radius: 24px; background-color: #0c0c0c; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.9);">
    <tr>
      <td>
        <!-- Ticket Stub Main Body -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding: 24px 24px 15px 24px;">
          <tr>
            <td style="text-align: left;">
              <span style="font-size: 20px; font-weight: 900; color: #e50914; letter-spacing: -1px; text-transform: uppercase;">CINEVERSE ADMIT ONE</span>
              <span style="font-size: 9px; color: #888888; letter-spacing: 1.5px; text-transform: uppercase; display: block; margin-top: 3px;">Official Digital Entry Pass</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 0 10px 0; text-align: left;">
              <h2 style="font-size: 24px; font-weight: 900; color: #ffffff; margin: 0; text-transform: uppercase; letter-spacing: -0.5px;">${movieName}</h2>
              <p style="font-size: 13px; color: #aaaaaa; margin: 5px 0 0 0;">📍 ${theatreName}</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top: 1px solid #1f1f1f; padding-top: 15px;">
                <tr>
                  <td width="33%" style="text-align: left; vertical-align: top;">
                    <span style="font-size: 8px; color: #555555; font-weight: bold; text-transform: uppercase; display: block; margin-bottom: 2px;">Date</span>
                    <span style="font-size: 12px; color: #ffffff; font-weight: bold;">${date}</span>
                  </td>
                  <td width="33%" style="text-align: left; vertical-align: top; padding-left: 10px;">
                    <span style="font-size: 8px; color: #555555; font-weight: bold; text-transform: uppercase; display: block; margin-bottom: 2px;">Time</span>
                    <span style="font-size: 12px; color: #ffffff; font-weight: bold;">${time}</span>
                  </td>
                  <td width="33%" style="text-align: left; vertical-align: top; padding-left: 10px;">
                    <span style="font-size: 8px; color: #555555; font-weight: bold; text-transform: uppercase; display: block; margin-bottom: 2px;">Seats Reserved</span>
                    <span style="font-size: 12px; color: #e50914; font-weight: bold;">${seatList}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        
        <!-- Perforated Notch Line -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td width="15" align="left" style="width: 15px; height: 30px; background-color: #050505; border-top-right-radius: 15px; border-bottom-right-radius: 15px; border-right: 1px solid #333333; border-top: 1px solid #333333; border-bottom: 1px solid #333333;"></td>
            <td style="border-bottom: 2px dashed #262626; height: 30px;"></td>
            <td width="15" align="right" style="width: 15px; height: 30px; background-color: #050505; border-top-left-radius: 15px; border-bottom-left-radius: 15px; border-left: 1px solid #333333; border-top: 1px solid #333333; border-bottom: 1px solid #333333;"></td>
          </tr>
        </table>
        
        <!-- Ticket Stub Tear-off Bottom -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding: 15px 24px 24px 24px; background-color: #0a0a0a;">
          <tr>
            <td class="details-col" width="65%" style="text-align: left; vertical-align: middle;">
              <span style="font-size: 8px; color: #555555; font-weight: bold; text-transform: uppercase; display: block;">Booking ID Reference</span>
              <span style="font-size: 11px; font-family: monospace; color: #888888; font-weight: bold; display: block; margin-bottom: 10px;">${bookingId}</span>
              
              <span style="font-size: 8px; color: #555555; font-weight: bold; text-transform: uppercase; display: block;">Payment Reference ID</span>
              <span style="font-size: 11px; font-family: monospace; color: #888888; font-weight: bold; display: block;">${paymentId || 'N/A'}</span>
            </td>
            
            <td class="ticket-col" width="35%" align="center" style="vertical-align: middle; text-align: center;">
              <!-- Simulated Entry Barcode -->
              <div style="background-color: #1a1a1a; padding: 12px; border-radius: 12px; display: inline-block;">
                <svg width="80" height="40" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block;">
                  <path d="M0 0h7v7H0V0zm1 1v5h5V1H1zm2 2h1v1H3V3zm6-3h1v1H9V0zm2 0h2v1h-2V0zm3 0h1v2h-1V0zm2 0h1v1h-1V0zm1 0h1v1h-1V0zm2 0h3v7h-7V0zm1 1v5h5V1h-5zm2 2h1v1h-3V3zm-13 5h1v1H8V8zm1 0h1v2H9V8zm2 0h1v1h-1V8zm1 0h2v1h-2V8zm4 0h1v2h-1V8zm2 0h1v1h-1V8zm1 0h1v1h-1V8zm-15 2h2v1H3v-1zm4 0h1v1H7v-1zm4 0h1v1h-1v-1zm5 0h2v2h-2v-2zm3 0h1v1h-1v-1zm1 0h1v1h-1v-1zm-19 2h7v7H0v-7zm1 1v5h5v-5H1zm2 2h1v1H3v-1zm6-3h1v1H9v-1zm1 0h1v2h-1v-2zm2 0h1v1h-1v-1zm1 0h1v1h-1v-1zm1 0h2v1h-2v-1zm3 0h1v1h-1v-1zm2 0h1v1h-1v-1zm-9 3h1v1H9v-1zm1 0h1v1h-1v-1zm1 0h1v1h-1v-1zm2 0h2v1h-2v-1zm3 0h1v1h-1v-1zm-13 4h1v1H3v-1zm2 0h1v1H5v-1zm3 0h1v2H8v-2zm2 0h1v1h-1v-1zm1 0h1v1h-1v-1zm2 0h1v1h-1v-1zm2 0h2v1h-2v-1zm3 0h1v1h-1v-1zm1 0h1v1h-1v-1z" fill="#ffffff"/>
                </svg>
                <div style="font-size: 8px; font-family: monospace; letter-spacing: 2px; color: #444444; margin-top: 5px;">VERIFIED PASS</div>
              </div>
              <div style="font-size: 13px; font-weight: bold; color: #e50914; margin-top: 8px;">₹${amount} Paid</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
`;

// ----------------------------------------------------
// PUBLIC COMPILER API EXPORTS
// ----------------------------------------------------

const bookingConfirmation = (data) => {
  return bookingConfirmationTemplate(data, getHeader, getFooter, getMovieCard, getPaymentCard);
};

const digitalTicket = (data) => {
  return ticketTemplateModule(data, getHeader, getFooter, getTicketCard, getButton);
};

const bookingCancellation = (data) => {
  return cancellationTemplateModule(data, getHeader, getFooter);
};

const refund = (data) => {
  return refundTemplateModule(data, getHeader, getFooter);
};

module.exports = {
  bookingConfirmation,
  digitalTicket,
  bookingCancellation,
  refund
};
