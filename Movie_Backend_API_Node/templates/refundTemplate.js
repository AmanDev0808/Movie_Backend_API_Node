/**
 * Refund Initiated Template
 */
const refundTemplate = (data, header, footer) => {
  const {
    userName,
    bookingId,
    amountPaid,
    refundStatus
  } = data;

  const body = `
    <p style="font-size: 16px; line-height: 1.6; color: #dddddd; margin-bottom: 25px;">
      Hello <strong>${userName}</strong>,
    </p>
    <p style="font-size: 15px; line-height: 1.6; color: #aaaaaa; margin-bottom: 30px;">
      We have processed your cancellation transaction and initiated a full refund back to your original payment source.
    </p>

    <!-- Refund Details -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #121212; border: 1px solid #222; border-radius: 20px; padding: 20px; margin-bottom: 25px; text-align: left;">
      <tr>
        <td style="padding: 8px 0; font-size: 12px; color: #aaaaaa;">Booking ID:</td>
        <td align="right" style="padding: 8px 0; font-size: 12px; font-weight: bold; color: #ffffff; font-family: monospace;">${bookingId}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-size: 12px; color: #aaaaaa;">Refund Amount:</td>
        <td align="right" style="padding: 8px 0; font-size: 15px; font-weight: 900; color: #e50914;">₹${amountPaid}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-size: 12px; color: #aaaaaa;">Refund Status:</td>
        <td align="right" style="padding: 8px 0;">
          <span style="font-size: 9px; font-weight: 900; background-color: #1e3a8a; color: #93c5fd; padding: 4px 10px; border-radius: 9999px; text-transform: uppercase;">
            ${refundStatus || 'REFUNDED'}
          </span>
        </td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-size: 12px; color: #aaaaaa;">Processing Time:</td>
        <td align="right" style="padding: 8px 0; font-size: 12px; font-weight: bold; color: #ffffff;">5-7 Business Days</td>
      </tr>
    </table>

    <p style="font-size: 14px; line-height: 1.6; color: #aaaaaa;">
      The refund has been simulated and processed back to your simulated digital card/UPI account via Razorpay. It usually settles within 5-7 working days. If you do not see it credit, please contact support.
    </p>
  `;

  return header('Refund Initiated', 'Funds are on the way') + body + footer();
};

module.exports = refundTemplate;
