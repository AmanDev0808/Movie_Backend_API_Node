/**
 * Booking Cancellation Template
 */
const cancellationTemplate = (data, header, footer) => {
  const {
    userName,
    movieName,
    theatreName,
    showDate,
    showTime,
    seatNumbers,
    bookingId,
    amountPaid
  } = data;

  const seatsList = seatNumbers && seatNumbers.length > 0 
    ? seatNumbers.map(s => '#' + s).join(', ') 
    : 'N/A';

  const cancellationTime = new Date().toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });

  const body = `
    <p style="font-size: 16px; line-height: 1.6; color: #dddddd; margin-bottom: 25px;">
      Hello <strong>${userName}</strong>,
    </p>
    <p style="font-size: 15px; line-height: 1.6; color: #aaaaaa; margin-bottom: 30px;">
      This email confirms that your booking has been cancelled successfully upon request. 
    </p>

    <!-- Cancellation details card -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #141414; border: 1px solid #ff4444/20; border-radius: 20px; padding: 20px; margin-bottom: 25px; text-align: left;">
      <tr>
        <td style="padding: 8px 0; font-size: 12px; color: #888888;">Booking ID:</td>
        <td align="right" style="padding: 8px 0; font-size: 12px; font-weight: bold; color: #ffffff; font-family: monospace;">${bookingId}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-size: 12px; color: #888888;">Movie Cancelled:</td>
        <td align="right" style="padding: 8px 0; font-size: 12px; font-weight: bold; color: #ffffff;">${movieName}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-size: 12px; color: #888888;">Seats Released:</td>
        <td align="right" style="padding: 8px 0; font-size: 12px; font-weight: bold; color: #e50914;">${seatsList}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-size: 12px; color: #888888;">Cancellation Time:</td>
        <td align="right" style="padding: 8px 0; font-size: 12px; font-weight: bold; color: #ffffff;">${cancellationTime}</td>
      </tr>
      <tr style="border-top: 1px solid #222;">
        <td style="padding: 15px 0 0 0; font-size: 13px; font-weight: bold; color: #ffffff;">Amount Refunding:</td>
        <td align="right" style="padding: 15px 0 0 0; font-size: 16px; font-weight: 900; color: #4ade80;">₹${amountPaid}</td>
      </tr>
    </table>

    <p style="font-size: 14px; line-height: 1.6; color: #aaaaaa;">
      The seats have been released back to the box office inventory. We hope to host you on your next movie night soon!
    </p>
  `;

  return header('Booking Cancelled', 'Your seats have been released') + body + footer();
};

module.exports = cancellationTemplate;
