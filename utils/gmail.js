const { google } = require('googleapis');
const { OAuth2 } = google.auth;
const fs = require('fs');
const path = require('path');

// Read credentials from the JSON file
const credentials = JSON.parse(fs.readFileSync(path.join(__dirname, '../credentials.json'))).web;

// Create an OAuth2 client
const oAuth2Client = new OAuth2(
    credentials.client_id,
    credentials.client_secret,
    credentials.redirect_uris[0] // Fixed to access web.redirect_uris
);

oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

async function getEmails() {
    try {
        const res = await gmail.users.messages.list({
            userId: 'me',
            maxResults: 10
        });

        const messages = res.data.messages || [];
        const emails = [];

        for (let message of messages) {
            const msg = await gmail.users.messages.get({ userId: 'me', id: message.id });
            const headers = msg.data.payload.headers;
            const subject = headers.find(h => h.name === 'Subject')?.value || 'No Subject';
            const sender = headers.find(h => h.name === 'From')?.value || 'Unknown Sender';
            const body = msg.data.payload.body.data || '';

            emails.push({ subject, sender, body: Buffer.from(body, 'base64').toString('utf-8') });
        }

        return emails;
    } catch (error) {
        console.error('Error fetching emails:', error);
        throw error;
    }
}

module.exports = { getEmails };
