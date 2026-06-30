// scripts/test-cloudinary.js
const cloudinary = require('../config/cloudinary');

async function testCloudinary() {
    try {
        console.log('Testing Cloudinary connection...');
        
        // ✅ Use a simple upload test with a small file
        const testBuffer = Buffer.from('Hello Cloudinary');
        const base64String = testBuffer.toString('base64');
        const dataURI = `data:text/plain;base64,${base64String}`;

        console.log('Uploading test file...');
        
        const result = await cloudinary.uploader.upload(dataURI, {
            folder: 'test',
            resource_type: 'upload',  // ✅ Use 'upload' not 'raw'
            public_id: 'test-file-' + Date.now()
        });

        console.log('✅ Upload successful!');
        console.log('   URL:', result.secure_url);
        console.log('   Public ID:', result.public_id);
        return true;
    } catch (error) {
        console.error('❌ Cloudinary test failed:', error.message);
        console.error('   Status:', error.http_code || 'Unknown');
        console.error('   Response:', error.response?.body || 'No response');
        return false;
    }
}

testCloudinary().then(result => {
    process.exit(result ? 0 : 1);
});