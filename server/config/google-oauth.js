const { OAuth2Client } = require('google-auth-library');

let oauth2Client;

try {
  oauth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'postmessage'
  );
  
  console.log('Google OAuth client initialized successfully');
} catch (error) {
  console.error('Failed to initialize Google OAuth client:', error);
  process.exit(1);
}

// Add a health check method
oauth2Client.checkHealth = async () => {
  try {
    // Attempt a lightweight operation to verify the client is working
    await oauth2Client.getTokenInfo('test');
    return true;
  } catch (error) {
    if (error.message.includes('Invalid Value')) {
      // This is actually good - means the client can communicate with Google
      return true;
    }
    return false;
  }
};

module.exports = oauth2Client;
