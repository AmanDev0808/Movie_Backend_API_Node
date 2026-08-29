const User = require('../model/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { successResponseBody, errorResponseBody } = require('../utils/responsebody');

const signup = async (req, res) => {
    try {
        const userObj = {
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8),
            // Default values assigned by model, or explicitly set here
            userType: "CUSTOMER", 
            userStatus: "APPROVED"
        };

        const user = await User.create(userObj);
        
        // Remove password from response
        const userResp = user.toObject();
        delete userResp.password;

        successResponseBody.data = userResp;
        successResponseBody.message = "User registered successfully";
        return res.status(201).json(successResponseBody);
    } catch (err) {
        errorResponseBody.err = err.message;
        errorResponseBody.message = "Internal server error during registration";
        return res.status(500).json(errorResponseBody);
    }
};

const signin = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            errorResponseBody.message = "User not found";
            return res.status(404).json(errorResponseBody);
        }

        if (user.userStatus !== 'APPROVED') {
            errorResponseBody.message = 'This account is not approved for access';
            return res.status(403).json(errorResponseBody);
        }

        const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

        if (!passwordIsValid) {
            errorResponseBody.message = "Invalid Password!";
            return res.status(401).json(errorResponseBody);
        }

        const token = jwt.sign({ id: user._id }, process.env.SECRET, {
            expiresIn: 86400 // 24 hours
        });

        successResponseBody.data = {
            id: user._id,
            name: user.name,
            email: user.email,
            userType: user.userType,
            avatarUrl: user.avatarUrl || '',
            accessToken: token
        };
        successResponseBody.message = "Login successful";
        return res.status(200).json(successResponseBody);
    } catch (err) {
        errorResponseBody.err = err.message;
        errorResponseBody.message = "Internal server error during signin";
        return res.status(500).json(errorResponseBody);
    }
};

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        return res.status(200).json({ success: true, data: user, message: 'Profile fetched successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to fetch profile' });
    }
};

const updateProfile = async (req, res) => {
    try {
        const updates = {};
        if (typeof req.body.name === 'string' && req.body.name.trim()) updates.name = req.body.name.trim();
        if (typeof req.body.email === 'string' && req.body.email.trim()) updates.email = req.body.email.trim().toLowerCase();
        if (typeof req.body.avatarUrl === 'string') updates.avatarUrl = req.body.avatarUrl.trim();
        if (req.body.notificationPreferences && typeof req.body.notificationPreferences === 'object') {
            updates.notificationPreferences = {
                notifications: Boolean(req.body.notificationPreferences.notifications),
                emailUpdates: Boolean(req.body.notificationPreferences.emailUpdates),
                darkMode: Boolean(req.body.notificationPreferences.darkMode)
            };
        }

        const user = await User.findByIdAndUpdate(req.userId, updates, { new: true, runValidators: true }).select('-password');
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        return res.status(200).json({ success: true, data: user, message: 'Profile updated successfully' });
    } catch (error) {
        if (error.code === 11000) return res.status(409).json({ success: false, message: 'Email is already in use' });
        return res.status(400).json({ success: false, message: 'Failed to update profile' });
    }
};

const changePassword = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user || !bcrypt.compareSync(req.body.currentPassword, user.password)) {
            return res.status(401).json({ success: false, message: 'Current password is incorrect' });
        }
        if (req.body.currentPassword === req.body.newPassword) {
            return res.status(400).json({ success: false, message: 'New password must be different' });
        }
        user.password = bcrypt.hashSync(req.body.newPassword, 12);
        await user.save();
        return res.status(200).json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
        return res.status(400).json({ success: false, message: 'Failed to change password' });
    }
};

module.exports = {
    signup,
    signin,
    getProfile,
    updateProfile,
    changePassword
};
