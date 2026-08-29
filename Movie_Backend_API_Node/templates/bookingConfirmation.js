/**
 * Booking Confirmation Template
 */
const bookingConfirmation = (data, header, footer, movieCard, paymentCard) => {
  const {
    userName,
    movieName,
    theatreName,
    showDate,
    showTime,
    seatNumbers,
    bookingId,
    razorpayOrderId,
    razorpayPaymentId,
    amountPaid,
    bookingDate,
    posterUrl
  } = data;

  const body = `
    <p style="font-size: 16px; line-height: 1.6; color: #dddddd; margin-bottom: 25px;">
      Hello <strong>${userName}</strong>,
    </p>
    <p style="font-size: 15px; line-height: 1.6; color: #aaaaaa; margin-bottom: 30px;">
      Your cinematic reservation at Cineverse has been successfully captured. Below are the details of your movie schedule and invoice.
    </p>
    
    ${movieCard(movieName, theatreName, showDate, showTime, posterUrl)}
    
    ${paymentCard(bookingId, razorpayOrderId, razorpayPaymentId, amountPaid, 'SUCCESS', bookingDate)}
    
    <p style="font-size: 13px; line-height: 1.6; color: #666666; margin-top: 25px;">
      You will receive a separate follow-up email containing your high-fidelity Digital Ticket Stub shortly. Please scan the QR code in that stub at the theatre gates for fast-track entry.
    </p>
  `;

  return header('Booking Confirmed', 'Your Reservation is Complete') + body + footer();
};

module.exports = bookingConfirmation;
