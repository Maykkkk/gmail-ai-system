const express = require('express');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path'); // Optional: For handling paths easily

const app = express();
// Serve static files (HTML, CSS, JS) from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});


app.use(bodyParser.urlencoded({ extended: true }));

// Replace with your client credentials
const CLIENT_ID = '827243920121-acs8dtk47n9l8v57rrf4trds720cq4je.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'http://localhost:5000/oauth2callback';

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
const TOKEN_PATH = 'token.json';

// Helper function to load tokens from file
const loadTokens = () => {
  if (fs.existsSync(TOKEN_PATH)) {
    const tokenData = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));
    oAuth2Client.setCredentials(tokenData);
    return true;
  }
  return false;
};

// Root endpoint to start the OAuth2 flow
app.get('/', (req, res) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar.readonly'],
  });
  res.send(`Authorize the app by visiting this URL: <a href="${authUrl}">${authUrl}</a>`);
});

// OAuth2 callback route
app.get('/oauth2callback', async (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res.status(400).send('Error: Authorization code not found.');
  }

  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    // Save tokens to file
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
    res.send('Authentication successful! You can close this tab.');
  } catch (error) {
    console.error('Error retrieving access token:', error);
    res.status(500).send('Error retrieving access token. Please try again.');
  }
});

// Calendar endpoint to fetch data
app.get('/calendar', async (req, res) => {
  if (!loadTokens()) {
    return res.status(400).send('User is not authenticated. Please authenticate by visiting the root URL.');
  }

  try {
    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
    const response = await calendar.calendarList.list(); // Fetch user's calendars
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching calendar data:', error);
    res.status(500).send('Failed to fetch calendar data. Ensure you are authenticated.');
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
