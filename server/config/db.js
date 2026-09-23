// // server/config/db.js

// const mongoose = require('mongoose');

// const connectDB = async () => {
//     try {
//         mongoose.set('strictQuery', false);
        
//         const conn = await mongoose.connect(process.env.MONGODB_URI);
        
//         console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        
//         // Handle connection events
//         mongoose.connection.on('error', (err) => {
//             console.error('MongoDB connection error:', err);
//         });
        
//         mongoose.connection.on('disconnected', () => {
//             console.log('MongoDB disconnected');
//         });
        
//     } catch (error) {
//         console.error(`❌ MongoDB Error: ${error.message}`);
//         process.exit(1);
//     }
// };

// module.exports = connectDB;

// server/config/db.js

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;