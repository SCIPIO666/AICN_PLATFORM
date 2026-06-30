// config/cloudinary.js
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// ✅ Make sure this is correct
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dlvyrnaso',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true  // ← Add this to use HTTPS
});

// ✅ Test the configuration
console.log('Cloudinary configured:', {
    cloud_name: cloudinary.config().cloud_name,
    api_key: cloudinary.config().api_key ? 'Set' : 'Not set',
    api_secret: cloudinary.config().api_secret ? 'Set' : 'Not set'
});

module.exports = cloudinary;