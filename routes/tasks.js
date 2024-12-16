const express = require('express');
const { scheduleEvent } = require('../utils/googleCalendar');
const { triggerWebhook } = require('../utils/webhooks');
const router = express.Router();

// Route: Schedule a Google Calendar event
router.post('/schedule', async (req, res) => {
    const { title, description, startTime, endTime } = req.body;
    try {
        const event = await scheduleEvent(title, description, startTime, endTime);
        res.status(200).json({ success: true, event });
    } catch (error) {
        console.error('Error scheduling event:', error);
        res.status(500).json({ success: false, message: 'Failed to schedule event' });
    }
});

// Route: Trigger a workflow via webhook
router.post('/webhook', async (req, res) => {
    const { url, payload } = req.body;
    try {
        const response = await triggerWebhook(url, payload);
        res.status(200).json({ success: true, response });
    } catch (error) {
        console.error('Error triggering webhook:', error);
        res.status(500).json({ success: false, message: 'Failed to trigger webhook' });
    }
});

module.exports = router;
