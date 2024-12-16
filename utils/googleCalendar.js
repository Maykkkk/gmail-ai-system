const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');
const TOKEN_PATH = path.join(__dirname, 'token.json');

let oAuth2Client;

function initializeAuth() {
    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
    const { client_id, client_secret, redirect_uris } = credentials.web;

    oAuth2Client = new google.auth.OAuth2(
        client_id,
        client_secret,
        redirect_uris[0]
    );

    // Check if token exists; if not, prompt for authorization
    if (fs.existsSync(TOKEN_PATH)) {
        const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
        oAuth2Client.setCredentials(token);
    } else {
        console.log('Token not found. Running authentication flow...');
        getAccessToken();
    }
}

function getAccessToken() {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/calendar'],
    });

    console.log('Authorize this app by visiting this URL:', authUrl);

    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    readline.question('Enter the code from that page here: ', (code) => {
        readline.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error retrieving access token', err);
            oAuth2Client.setCredentials(token);

            // Save the token for future use
            fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
            console.log('Token stored to', TOKEN_PATH);
        });
    });
}

// Initialize authentication
initializeAuth();

// Create Calendar instance
const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

module.exports = { calendar };
