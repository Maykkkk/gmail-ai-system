const axios = require('axios');

async function triggerWebhook(url, payload) {
    try {
        const response = await axios.post(url, payload);
        return response.data;
    } catch (error) {
        console.error('Error triggering webhook:', error);
        throw error;
    }
}

module.exports = { triggerWebhook };
