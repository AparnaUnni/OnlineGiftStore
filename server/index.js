// import dotenv from "dotenv";
// dotenv.config();

// import express from "express";
// import cors from "cors";
// import { dbConnect } from "./db.js";
// import Category from "./models/Category.js";
// import Gift from "./models/Gift.js";

// const app = express();
// app.use(cors({ origin: "http://localhost:3000" }));
// app.use(express.json());  // ADD this too

// // Test route first
// app.get("/api/test", (req, res) => {
//   res.json({ 
//     mongodbUri: !!process.env.MONGODB_URI ? "✅ Loaded" : "❌ Missing",
//     message: "Server working!"
//   });
// });

// // // ADD THIS - for home page
// // app.get("/api/categories", (req, res) => {
// //   const apiCategories = categories.map(cat => ({
// //     id: cat.id,
// //     name: cat.name,
// //     description: cat.description,
// //     imageSrc: cat.imageSrc,
// //     imageAlt: cat.imageAlt,
// //     href: cat.href
// //   }));
// //   res.json(apiCategories);
// // });

// // List of categories for homepage
// app.get("/api/categories", async (req, res) => {
//   try {
//     await dbConnect();
//     const categories = await Category.find().lean();
//     res.json(categories);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Gifts route
// app.get("/api/gifts/:type", async (req, res) => {
//   const { type } = req.params;
//   try {
//     await dbConnect();
//     const category = await Category.findOne({ slug: type }).lean();
//     if (!category) return res.status(404).json({ error: "Category not found" });
    
//     const items = await Gift.find({ category: type }).lean();
    
//     res.json({
//       title: `${category.name} Gifts`,
//       description: category.description,
//       items,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });

// const port = process.env.PORT || 4000;
// app.listen(port, () => {
//   console.log(`server at http://localhost:${port}`);
// });



// server/index.js

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { dbConnect } from "./db.js";
import Category from "./models/Category.js";
import Gift from "./models/Gift.js";
import User from "./models/User.js";
import Order from "./models/Order.js";

const app = express();

// ==================== MIDDLEWARE ====================

app.use(cors({ 
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use(express.json());

// Log all requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} | ${req.method} ${req.url}`);
    next();
});

// ==================== EXISTING ROUTES ====================

// Root
app.get("/", (req, res) => {
    res.json({ message: "Memoria API Server" });
});

// Test route
app.get("/api/test", (req, res) => {
    res.json({ 
        mongodbUri: !!process.env.MONGODB_URI ? "✅ Loaded" : "❌ Missing",
        message: "Server working!"
    });
});

// Health check
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Memoria API is running!",
        timestamp: new Date().toISOString(),
    });
});

// Categories
app.get("/api/categories", async (req, res) => {
    try {
        await dbConnect();
        const categories = await Category.find().lean();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Gifts by type
app.get("/api/gifts/:type", async (req, res) => {
    const { type } = req.params;
    try {
        await dbConnect();
        const category = await Category.findOne({ slug: type }).lean();
        if (!category) return res.status(404).json({ error: "Category not found" });
        
        const items = await Gift.find({ category: type }).lean();
        
        res.json({
            title: `${category.name} Gifts`,
            description: category.description,
            items,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// ==================== AUTH ROUTES ====================

// Register
app.post("/api/auth/register", async (req, res) => {
    try {
        await dbConnect();
        
        const { fullName, email, password } = req.body;

        console.log("📝 Register attempt:", email);

        if (!fullName || !email || !password) {
            return res.status(400).json({
                success: false,
                error: "Please provide fullName, email, and password",
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                error: "Password must be at least 6 characters",
            });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: "User already exists with this email",
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            fullName,
            email: email.toLowerCase(),
            password: hashedPassword,
        });

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || "your-secret-key",
            { expiresIn: "7d" }
        );

        console.log("✅ User registered:", user.email);

        res.status(201).json({
            success: true,
            message: "Registration successful",
            data: {
                token,
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    phone: user.phone || "",
                    address: user.address || "",
                    
                },
            },
        });

    } catch (error) {
        console.error("❌ Register error:", error);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

// Login
app.post("/api/auth/login", async (req, res) => {
    try {
        await dbConnect();
        
        const { email, password } = req.body;

        console.log("🔐 Login attempt:", email);

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: "Please provide email and password",
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({
                success: false,
                error: "Invalid credentials",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: "Invalid credentials",
            });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || "your-secret-key",
            { expiresIn: "7d" }
        );

        console.log("✅ User logged in:", user.email);

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                token,
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    phone: user.phone || "",
                    address: user.address || "",
                    
                },
            },
        });

    } catch (error) {
        console.error("❌ Login error:", error);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

// Get current user
app.get("/api/auth/me", async (req, res) => {
    try {
        await dbConnect();
        
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                error: "No token provided",
            });
        }

        const token = authHeader.split(" ")[1];

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
        } catch (err) {
            return res.status(401).json({
                success: false,
                error: "Invalid token",
            });
        }

        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found",
            });
        }

        res.json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    phone: user.phone || "",
                    address: user.address || "",
                    
                },
            },
        });

    } catch (error) {
        console.error("❌ Auth error:", error);
        res.status(401).json({
            success: false,
            error: "Invalid token",
        });
    }
});

// ==================== UPDATE PROFILE (PUT) ====================

app.put("/api/auth/update-profile", async (req, res) => {
    try {
        await dbConnect();
        
        // Get token from header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                error: "No token provided",
            });
        }

        const token = authHeader.split(" ")[1];

        // Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
        } catch (err) {
            return res.status(401).json({
                success: false,
                error: "Invalid token",
            });
        }

        const { fullName, email, phone, address } = req.body;

        console.log("📝 Update profile for user:", decoded.userId);

        // Find user
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found",
            });
        }

        // Check if email is being changed and if it's already taken
        if (email && email.toLowerCase() !== user.email) {
            const emailExists = await User.findOne({ email: email.toLowerCase() });
            if (emailExists) {
                return res.status(400).json({
                    success: false,
                    error: "Email is already in use",
                });
            }
        }

        // Update fields
        if (fullName) user.fullName = fullName;
        if (email) user.email = email.toLowerCase();
        if (phone !== undefined) user.phone = phone;
        if (address !== undefined) user.address = address;
        

        await user.save();

        console.log("✅ Profile updated:", user.email);

        res.json({
            success: true,
            message: "Profile updated successfully",
            data: {
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    phone: user.phone || "",
                    address: user.address || "",
                    
                },
            },
        });

    } catch (error) {
        console.error("❌ Update profile error:", error);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

// ==================== CHANGE PASSWORD (PUT) ====================

app.put("/api/auth/change-password", async (req, res) => {
    try {
        await dbConnect();
        
        // Get token from header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                error: "No token provided",
            });
        }

        const token = authHeader.split(" ")[1];

        // Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
        } catch (err) {
            return res.status(401).json({
                success: false,
                error: "Invalid token",
            });
        }

        const { currentPassword, newPassword } = req.body;

        console.log("🔑 Change password for user:", decoded.userId);

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                error: "Please provide current and new password",
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                error: "New password must be at least 6 characters",
            });
        }

        // Find user
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found",
            });
        }

        // Check current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                error: "Current password is incorrect",
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        console.log("✅ Password changed for:", user.email);

        res.json({
            success: true,
            message: "Password changed successfully",
        });

    } catch (error) {
        console.error("❌ Change password error:", error);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});




// ==================== CART ROUTES ====================

// Get user's cart
app.get("/api/cart", async (req, res) => {
    try {
        await dbConnect();
        
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                error: "No token provided",
            });
        }

        const token = authHeader.split(" ")[1];
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
        } catch (err) {
            return res.status(401).json({ success: false, error: "Invalid token" });
        }

        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        res.json({
            success: true,
            data: {
                cart: user.cart || [],
            },
        });

    } catch (error) {
        console.error("❌ Get cart error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Save/Update cart
app.put("/api/cart", async (req, res) => {
    try {
        await dbConnect();
        
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                error: "No token provided",
            });
        }

        const token = authHeader.split(" ")[1];
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
        } catch (err) {
            return res.status(401).json({ success: false, error: "Invalid token" });
        }

        const { cart } = req.body;

        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        user.cart = cart || [];
        await user.save();

        console.log("✅ Cart updated for:", user.email);

        res.json({
            success: true,
            message: "Cart updated successfully",
            data: {
                cart: user.cart,
            },
        });

    } catch (error) {
        console.error("❌ Update cart error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Clear cart
app.delete("/api/cart", async (req, res) => {
    try {
        await dbConnect();
        
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                error: "No token provided",
            });
        }

        const token = authHeader.split(" ")[1];
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
        } catch (err) {
            return res.status(401).json({ success: false, error: "Invalid token" });
        }

        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        user.cart = [];
        await user.save();

        console.log("✅ Cart cleared for:", user.email);

        res.json({
            success: true,
            message: "Cart cleared successfully",
        });

    } catch (error) {
        console.error("❌ Clear cart error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==================== ORDER ROUTES ====================

// In server/index.js - Update the Create Order route

// Create order - in server/index.js
app.post("/api/orders", async (req, res) => {
    try {
        await dbConnect();
        
        // Auth check
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                error: "No token provided",
            });
        }

        const token = authHeader.split(" ")[1];
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
        } catch (err) {
            return res.status(401).json({ success: false, error: "Invalid token" });
        }

        const { 
            items, 
            shippingAddress, 
            orderNote, 
            paymentMethod,
            subtotal,
            shippingCost,
            tax,
            totalAmount 
        } = req.body;

        // Validate items
        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                error: "Cart is empty",
            });
        }

        // Validate address
        if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.address) {
            return res.status(400).json({
                success: false,
                error: "Shipping address is required",
            });
        }

        // Generate unique order number
        const generateOrderNumber = () => {
            const date = new Date();
            const year = date.getFullYear().toString().slice(-2);
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hour = String(date.getHours()).padStart(2, '0');
            const min = String(date.getMinutes()).padStart(2, '0');
            const sec = String(date.getSeconds()).padStart(2, '0');
            const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
            return `MEM${year}${month}${day}${hour}${min}${sec}${random}`;
        };

        // Create order
        const order = new Order({
            userId: decoded.userId,
            orderNumber: generateOrderNumber(),
            items: items.map(item => ({
                productId: item._id || item.id || item.productId,
                name: item.name,
                price: item.price,
                quantity: item.quantity || 1,
                imageSrc: item.imageSrc || "",
            })),
            subtotal: subtotal || 0,
            shippingCost: shippingCost || 0,
            tax: tax || 0,
            totalAmount: totalAmount || subtotal || 0,
            shippingAddress: {
                fullName: shippingAddress.fullName,
                phone: shippingAddress.phone,
                address: shippingAddress.address,
                city: shippingAddress.city,
                state: shippingAddress.state,
                pincode: shippingAddress.pincode,
            },
            orderNote: orderNote || "",
            paymentMethod: paymentMethod || "cod",
            paymentStatus: "pending",
            orderStatus: "confirmed",
        });

        await order.save();

        // Clear user's cart
        const user = await User.findById(decoded.userId);
        if (user) {
            user.cart = [];
            await user.save();
        }

        console.log("✅ Order created:", order.orderNumber);

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            data: {
                order: {
                    id: order._id,
                    orderNumber: order.orderNumber,
                    totalAmount: order.totalAmount,
                    orderStatus: order.orderStatus,
                    createdAt: order.createdAt,
                },
            },
        });

    } catch (error) {
        console.error("❌ Create order error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get all orders for user
app.get("/api/orders", async (req, res) => {
    try {
        await dbConnect();
        
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                error: "No token provided",
            });
        }

        const token = authHeader.split(" ")[1];
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
        } catch (err) {
            return res.status(401).json({ success: false, error: "Invalid token" });
        }

        const orders = await Order.find({ userId: decoded.userId })
            .sort({ createdAt: -1 })
            .lean();

        res.json({
            success: true,
            data: {
                orders,
            },
        });

    } catch (error) {
        console.error("❌ Get orders error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get single order
app.get("/api/orders/:id", async (req, res) => {
    try {
        await dbConnect();
        
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                error: "No token provided",
            });
        }

        const token = authHeader.split(" ")[1];
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
        } catch (err) {
            return res.status(401).json({ success: false, error: "Invalid token" });
        }

        const order = await Order.findOne({ 
            _id: req.params.id, 
            userId: decoded.userId 
        }).lean();

        if (!order) {
            return res.status(404).json({
                success: false,
                error: "Order not found",
            });
        }

        res.json({
            success: true,
            data: {
                order,
            },
        });

    } catch (error) {
        console.error("❌ Get order error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Cancel order
app.put("/api/orders/:id/cancel", async (req, res) => {
    try {
        await dbConnect();
        
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                error: "No token provided",
            });
        }

        const token = authHeader.split(" ")[1];
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
        } catch (err) {
            return res.status(401).json({ success: false, error: "Invalid token" });
        }

        const order = await Order.findOne({ 
            _id: req.params.id, 
            userId: decoded.userId 
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                error: "Order not found",
            });
        }

        // Can only cancel if not already shipped/delivered
        if (['shipped', 'delivered', 'cancelled'].includes(order.orderStatus)) {
            return res.status(400).json({
                success: false,
                error: `Cannot cancel order with status: ${order.orderStatus}`,
            });
        }

        order.orderStatus = 'cancelled';
        await order.save();

        console.log("✅ Order cancelled:", order.orderNumber);

        res.json({
            success: true,
            message: "Order cancelled successfully",
            data: {
                order,
            },
        });

    } catch (error) {
        console.error("❌ Cancel order error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});


// ==================== 404 HANDLER ====================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: `Route ${req.method} ${req.url} not found`,
    });
});





// ==================== START SERVER ====================

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`Server: http://localhost:${port}`);

});