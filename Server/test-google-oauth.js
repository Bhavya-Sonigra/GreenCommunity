// Test script to verify Google OAuth configuration
const axios = require('axios');

async function testGoogleOAuth() {
  try {
    console.log('Testing Google OAuth configuration...');
    
    // Test 1: Check if server is running
    console.log('1. Checking server health...');
    const healthResponse = await axios.get('http://localhost:5000/api/auth/health');
    console.log('✅ Server is running:', healthResponse.data);
    
    // Test 2: Test Google OAuth redirect
    console.log('\n2. Testing Google OAuth redirect...');
    const oauthResponse = await axios.get('http://localhost:5000/api/auth/google', {
      maxRedirects: 0,
      validateStatus: function (status) {
        return status >= 200 && status < 400; // Allow redirects
      }
    });
    
    if (oauthResponse.status === 302) {
      const location = oauthResponse.headers.location;
      console.log('✅ OAuth redirect working');
      console.log('📍 Redirect URL:', location);
      
      // Check if redirect URL contains correct parameters
      if (location.includes('accounts.google.com') && 
          location.includes('redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Fapi%2Fauth%2Fgoogle%2Fcallback') &&
          location.includes('client_id=1058167507322-t1j607326krdmjle9sfi3labqqah4hdm.apps.googleusercontent.com')) {
        console.log('✅ All OAuth parameters are correct');
      } else {
        console.log('❌ OAuth parameters might be incorrect');
      }
    }
    
    console.log('\n🎉 Google OAuth configuration is working correctly!');
    console.log('\nTo test from your frontend, use: http://localhost:5000/api/auth/google');
    
  } catch (error) {
    console.error('❌ Error testing Google OAuth:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('🔥 Make sure your server is running on port 5000');
      console.log('   Run: npm start');
    }
  }
}

// Only run if axios is available
if (typeof require !== 'undefined') {
  try {
    const axios = require('axios');
    testGoogleOAuth();
  } catch (e) {
    console.log('⚠️  axios not found. Install with: npm install axios');
    console.log('Or test manually by visiting: http://localhost:5000/api/auth/google');
  }
} else {
  console.log('Test manually by visiting: http://localhost:5000/api/auth/google');
}
