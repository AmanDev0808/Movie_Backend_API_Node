const Booking = require('../model/booking.model');
const User = require('../model/user.model');
const Show = require('../model/show.model');
const Movie = require('../model/movie.model');
const Theatre = require('../model/theatre.model');
const sendEmail = require('../helpers/sendEmail');
const templates = require('../utils/emailTemplates');

/**
 * Helper to fetch complete booking data populated with related movie, theatre, and user details.
 */
const getPopulatedBooking = async (bookingId) => {
  const booking = await Booking.findById(bookingId)
    .populate({
      path: 'userId',
      select: 'name email'
    })
    .populate({
      path: 'showId',
      populate: {
        path: 'movieId theatreId'
      }
    });

  if (booking) {
    const Payment = require('../model/payment.model');
    const payment = await Payment.findOne({ bookingId: booking._id });
    if (payment) {
      // Cast Mongoose document to plain object if needed, or simply append properties
      booking.razorpayOrderId = payment.razorpayOrderId;
      booking.razorpayPaymentId = payment.razorpayPaymentId;
      booking.paymentStatus = payment.status;
    }
  }

  return booking;
};

/**
 * Orchestrator service to manage and compile dynamic transactional templates.
 * Designed for scalability: adding future triggers (welcome, OTP, passwords)
 * simply requires importing sendEmail and adding a method.
 */
const emailService = {
  
  /**
   * 1. Send Booking Confirmation Email
   */
  sendBookingConfirmation: async (bookingId) => {
    try {
      const booking = await getPopulatedBooking(bookingId);
      if (!booking || !booking.userId) return { success: false, error: 'Booking or user not found' };

      const user = booking.userId;
      const show = booking.showId || {};
      const movie = show.movieId || {};
      const theatre = show.theatreId || {};

      const templateData = {
        userName: user.name || 'Cinephile',
        movieName: movie.name || 'Untitled Movie',
        theatreName: theatre.name || 'Unknown Theatre',
        showDate: show.showDate ? new Date(show.showDate).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : 'TBA',
        showTime: show.showTime || 'TBA',
        seatNumbers: booking.seatNumbers || [],
        bookingId: booking._id.toString(),
        amountPaid: booking.totalCost,
        bookingDate: new Date(booking.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }),
        posterUrl: movie.poster || '',
        // For payment reference details
        razorpayOrderId: booking.razorpayOrderId || '',
        razorpayPaymentId: booking.razorpayPaymentId || ''
      };

      const html = templates.bookingConfirmation(templateData);
      const subject = '🎟️ Booking Confirmed – Your Ticket is Ready';
      
      // Async trigger (non-blocking)
      return await sendEmail({
        to: user.email,
        subject,
        html
      });
    } catch (error) {
      console.error(`❌ EmailService failed during sendBookingConfirmation (${bookingId}):`, error.message);
      return { success: false, error: error.message };
    }
  },

  /**
   * 2. Send Digital Ticket Stub
   */
  sendDigitalTicket: async (bookingId) => {
    try {
      const booking = await getPopulatedBooking(bookingId);
      if (!booking || !booking.userId) return { success: false, error: 'Booking or user not found' };

      const user = booking.userId;
      const show = booking.showId || {};
      const movie = show.movieId || {};
      const theatre = show.theatreId || {};

      const templateData = {
        userName: user.name || 'Cinephile',
        movieName: movie.name || 'Untitled Movie',
        theatreName: theatre.name || 'Unknown Theatre',
        showDate: show.showDate ? new Date(show.showDate).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : 'TBA',
        showTime: show.showTime || 'TBA',
        seatNumbers: booking.seatNumbers || [],
        bookingId: booking._id.toString(),
        amountPaid: booking.totalCost,
        razorpayPaymentId: booking.razorpayPaymentId || ''
      };

      const html = templates.digitalTicket(templateData);
      const subject = '🎫 Your Digital Entry Pass stub – Cineverse';
      
      return await sendEmail({
        to: user.email,
        subject,
        html
      });
    } catch (error) {
      console.error(`❌ EmailService failed during sendDigitalTicket (${bookingId}):`, error.message);
      return { success: false, error: error.message };
    }
  },

  /**
   * 3. Send Booking Cancellation
   */
  sendBookingCancellation: async (bookingId) => {
    try {
      const booking = await getPopulatedBooking(bookingId);
      if (!booking || !booking.userId) return { success: false, error: 'Booking or user not found' };

      const user = booking.userId;
      const show = booking.showId || {};
      const movie = show.movieId || {};
      const theatre = show.theatreId || {};

      const templateData = {
        userName: user.name || 'Cinephile',
        movieName: movie.name || 'Untitled Movie',
        theatreName: theatre.name || 'Unknown Theatre',
        showDate: show.showDate ? new Date(show.showDate).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : 'TBA',
        showTime: show.showTime || 'TBA',
        seatNumbers: booking.seatNumbers || [],
        bookingId: booking._id.toString(),
        amountPaid: booking.totalCost
      };

      const html = templates.bookingCancellation(templateData);
      const subject = '❌ Booking Cancelled Successfully';

      return await sendEmail({
        to: user.email,
        subject,
        html
      });
    } catch (error) {
      console.error(`❌ EmailService failed during sendBookingCancellation (${bookingId}):`, error.message);
      return { success: false, error: error.message };
    }
  },

  /**
   * 4. Send Refund Notification
   */
  sendRefundEmail: async (bookingId) => {
    try {
      const booking = await getPopulatedBooking(bookingId);
      if (!booking || !booking.userId) return { success: false, error: 'Booking or user not found' };

      const user = booking.userId;

      const templateData = {
        userName: user.name || 'Cinephile',
        bookingId: booking._id.toString(),
        amountPaid: booking.totalCost,
        refundStatus: 'REFUNDED'
      };

      const html = templates.refund(templateData);
      const subject = '💰 Refund Initiated';

      return await sendEmail({
        to: user.email,
        subject,
        html
      });
    } catch (error) {
      console.error(`❌ EmailService failed during sendRefundEmail (${bookingId}):`, error.message);
      return { success: false, error: error.message };
    }
  },

  // ====================================================
  // RESERVED CHANNELS FOR FUTURE SCALABILITY (PLACEHOLDERS)
  // ====================================================
  
  sendWelcomeEmail: async (userEmail, userName) => {
    console.log(`[Future Integration] Welcome email template queued for ${userEmail}`);
  },

  sendOTPEmail: async (userEmail, otp) => {
    console.log(`[Future Integration] OTP notification templates queued for ${userEmail}`);
  },

  sendPasswordReset: async (userEmail, resetLink) => {
    console.log(`[Future Integration] Password reset templates queued for ${userEmail}`);
  }
};

module.exports = emailService;
