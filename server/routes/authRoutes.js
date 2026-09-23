// // server/routes/authRoutes.js

// const express = require('express');
// const router = express.Router();
// const { protect } = require('../middleware/auth');
// const {
//     register,
//     login,
//     getMe,
//     updateProfile,
//     changePassword,
//     logout,
// } = require('../controllers/authController');

// // Public routes
// router.post('/register', register);
// router.post('/login', login);

// // Protected routes (require authentication)
// router.get('/me', protect, getMe);
// router.put('/update-profile', protect, updateProfile);
// router.put('/change-password', protect, changePassword);
// router.post('/logout', protect, logout);

// module.exports = router;

// server/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @route   POST /api/auth/register
// @desc    Register new user
router.post('/register', async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        console.log('📝 Register attempt:', email);

        // Validate input
        if (!fullName || !email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Please provide all required fields',
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                error: 'Password must be at least 6 characters',
            });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: 'User already exists with this email',
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            fullName,
            email: email.toLowerCase(),
            password: hashedPassword,
        });

        // Generate JWT
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        console.log('✅ User registered:', user.email);

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            data: {
                token,
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                },
            },
        });

    } catch (error) {
        console.error('❌ Register error:', error.message);
        res.status(500).json({
            success: false,
            error: error.message || 'Server error',
        });
    }
});

// @route   POST /api/auth/login
// @desc    Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log('🔐 Login attempt:', email);

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Please provide email and password',
            });
        }

        // Find user
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials',
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials',
            });
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        console.log('✅ User logged in:', user.email);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                },
            },
        });

    } catch (error) {
        console.error('❌ Login error:', error.message);
        res.status(500).json({
            success: false,
            error: error.message || 'Server error',
        });
    }
});

module.exports = router;