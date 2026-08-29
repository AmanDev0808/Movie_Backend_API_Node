/**
 * Digital Ticket Pass Template
 */
const ticketTemplate = (data, header, footer, ticketCard, button) => {
  const {
    userName,
    movieName,
    theatreName,
    showDate,
    showTime,
    seatNumbers,
    bookingId,
    razorpayPaymentId,
    amountPaid
  } = data;

  const seatsList = seatNumbers && seatNumbers.length > 0 
    ? seatNumbers.map(s => '#' + s).join(', ') 
    : 'N/A';

  const body = `
    <p style="font-size: 16px; line-height: 1.6; color: #dddddd; margin-bottom: 20px;">
      Hello <strong>${userName}</strong>,
    </p>
    <p style="font-size: 15px; line-height: 1.6; color: #aaaaaa; margin-bottom: 25px;">
      Here is your digital entry pass stub. Scan the security graphics on the ticket right from your smartphone at the cinema turnstile gates.
    </p>
    
    ${ticketCard(movieName, theatreName, showDate, showTime, seatsList, bookingId, razorpayPaymentId, amountPaid)}
    
    ${button('View Ticket in Dashboard', `${process.env.FRONTEND_URL || 'http://localhost:5173'}/my-bookings`)}
  `;

  return header('Your Digital Ticket Stub', 'Scan at Turnstile Gate') + body + footer();
};

module.exports = ticketTemplate;
