const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    avatarUrl: {
        type: String,
        default: ''
    },
    notificationPreferences: {
        notifications: { type: Boolean, default: true },
        emailUpdates: { type: Boolean, default: true },
        darkMode: { type: Boolean, default: true }
    },
    userType: {
        type: String,
        required: true,
        default: "CUSTOMER",
        enum: ["CUSTOMER", "ADMIN"]
    },
    userStatus: {
        type: String,
        required: true,
        default: "APPROVED",
        enum: ["PENDING", "APPROVED", "REJECTED"]
    }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
