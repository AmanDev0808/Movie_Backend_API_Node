const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const env = require('dotenv');

env.config();

const User = require('./model/user.model');
const Booking = require('./model/booking.model');
const Show = require('./model/show.model');
const Payment = require('./model/payment.model');

async function test() {
  try {
    console.log("Connecting to Database:", process.env.DB_URL);
    await mongoose.connect(process.env.DB_URL);
    console.log("Connected to DB!");

    // 1. Find any user
    const user = await User.findOne();
    if (!user) {
      console.log("No user found in DB.");
      return;
    }

    // 2. Find any show that is in the future
    const show = await Show.findOne({ showDate: { $gt: new Date() } });
    if (!show) {
      console.log("No future show found in DB to test. Creating a dummy future show...");
    }

    // Let's find any show, force its showDate to be in the future, save it, and use it
    let testShow = await Show.findOne();
    if (!testShow) {
      console.log("No show found in DB.");
      return;
    }
    
    // Backup original values
    const originalDate = testShow.showDate;
    const originalAvailableSeats = testShow.availableSeats;
    
    // Set to next year to ensure it's in the future
    testShow.showDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    await testShow.save();
    console.log(`Prepared test show with date: ${testShow.showDate}`);

    // 3. Create or prepare a SUCCESS booking
    const testBooking = await Booking.create({
      userId: user._id,
      showId: testShow._id,
      seats: 3,
      seatNumbers: [88, 89, 90],
      totalCost: testShow.price * 3,
      status: "SUCCESS"
    });
    console.log(`Created SUCCESS booking with ID: ${testBooking._id}`);

    // Create a SUCCESS Payment record associated with it
    const testPayment = await Payment.create({
      bookingId: testBooking._id,
      razorpayOrderId: "order_mock_" + testBooking._id,
      amount: testBooking.totalCost,
      status: "SUCCESS"
    });
    console.log(`Created SUCCESS payment with ID: ${testPayment._id}`);

    // Keep track of the show's available seats before cancellation
    const showBefore = await Show.findById(testShow._id);
    const seatsBefore = showBefore.availableSeats;
    console.log(`Available seats before cancellation: ${seatsBefore}`);

    // Generate JWT token for owner
    const token = jwt.sign({ id: user._id }, process.env.SECRET, { expiresIn: '1h' });

    // Helper to send HTTP requests to local server
    const callCancelApi = async () => {
      const url = `http://localhost:${process.env.PORT || 1910}/mba/api/v1/bookings/${testBooking._id}/cancel`;
      console.log(`Sending POST ${url}`);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token
        }
      });
      console.log("HTTP Response Status:", response.status);
      const body = await response.json();
      console.log("Response Body:", JSON.stringify(body, null, 2));
      return { status: response.status, body };
    };

    // --- TEST 1: Cancel SUCCESS booking ---
    console.log("\n--- TEST 1: Performing cancellation ---");
    const test1 = await callCancelApi();
    
    // Verify Database state
    const bookingAfter1 = await Booking.findById(testBooking._id);
    const paymentAfter1 = await Payment.findOne({ bookingId: testBooking._id });
    const showAfter1 = await Show.findById(testShow._id);

    console.log(`Booking Status after Test 1: ${bookingAfter1.status} (Expected: CANCELLED)`);
    console.log(`Payment Status after Test 1: ${paymentAfter1.status} (Expected: REFUNDED)`);
    console.log(`Available seats after Test 1: ${showAfter1.availableSeats} (Expected: ${seatsBefore + 3})`);

    if (bookingAfter1.status !== "CANCELLED" || paymentAfter1.status !== "REFUNDED" || showAfter1.availableSeats !== seatsBefore + 3) {
      console.error("FAIL: Test 1 database assertions failed.");
    } else {
      console.log("PASS: Test 1 database assertions passed!");
    }

    // --- TEST 2: Idempotent call on already cancelled booking ---
    console.log("\n--- TEST 2: Performing idempotent cancellation call ---");
    const test2 = await callCancelApi();
    
    const showAfter2 = await Show.findById(testShow._id);
    console.log(`Available seats after Test 2: ${showAfter2.availableSeats} (Expected: ${seatsBefore + 3} - no duplicate seat release)`);
    
    if (test2.status === 200 && test2.body.message.includes("already cancelled") && showAfter2.availableSeats === seatsBefore + 3) {
      console.log("PASS: Idempotency check passed!");
    } else {
      console.error("FAIL: Idempotency check failed.");
    }

    // --- TEST 3: Cancel booking of another user ---
    console.log("\n--- TEST 3: Attempting cancellation with another user's token ---");
    const dummyUser = await User.create({
      name: "Dummy User",
      email: "dummy" + Date.now() + "@gmail.com",
      password: "password123",
      userType: "CUSTOMER"
    });
    const dummyToken = jwt.sign({ id: dummyUser._id }, process.env.SECRET, { expiresIn: '1h' });

    const dummyUrl = `http://localhost:${process.env.PORT || 1910}/mba/api/v1/bookings/${testBooking._id}/cancel`;
    const dummyRes = await fetch(dummyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": dummyToken
      }
    });
    const dummyBody = await dummyRes.json();
    console.log("HTTP Response Status (Other User):", dummyRes.status);
    console.log("Response Body (Other User):", JSON.stringify(dummyBody, null, 2));

    if (dummyRes.status === 400 && dummyBody.err.includes("Unauthorized")) {
      console.log("PASS: Ownership authorization check passed!");
    } else {
      console.error("FAIL: Ownership authorization check failed.");
    }

    // Cleanup mock data
    await Booking.findByIdAndDelete(testBooking._id);
    await Payment.findByIdAndDelete(testPayment._id);
    await User.findByIdAndDelete(dummyUser._id);
    
    // Restore show properties
    testShow.showDate = originalDate;
    testShow.availableSeats = originalAvailableSeats;
    await testShow.save();
    console.log("Cleaned up and restored database state.");

  } catch (err) {
    console.error("Testing execution failed:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected DB.");
  }
}

test();
