const express = require('express');
const { getEmails } = require('../utils/gmail');
const { analyzeEmailContent } = require('../utils/nlp');
const router = express.Router();

// Route: Fetch and analyze emails
router.get('/fetch', async (req, res) => {
    try {
        // Fetch emails using Gmail API
        const emails = await getEmails();
        
        // Analyze email content using NLP
        const analyzedEmails = emails.map(email => ({
            subject: email.subject,
            sender: email.sender,
            tasks: analyzeEmailContent(email.body)
        }));

        res.status(200).json({ success: true, emails: analyzedEmails });
    } catch (error) {
        console.error('Error fetching or analyzing emails:', error);
        res.status(500).json({ success: false, message: 'Failed to process emails' });
    }
});

module.exports = router;
