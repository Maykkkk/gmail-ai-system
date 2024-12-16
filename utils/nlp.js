const { LangEs } = require('@nlpjs/lang-es');

const { NlpManager } = require('node-nlp');

const manager = new NlpManager({ languages: ['en'] });

// Pre-train NLP manager with some tasks
manager.addDocument('en', 'schedule a meeting', 'task.scheduleMeeting');
manager.addDocument('en', 'set up a call', 'task.scheduleCall');
manager.addDocument('en', 'remind me about %task%', 'task.reminder');
manager.addAnswer('en', 'task.scheduleMeeting', 'Task: Schedule a meeting');
manager.addAnswer('en', 'task.scheduleCall', 'Task: Schedule a call');
manager.addAnswer('en', 'task.reminder', 'Task: Reminder for %task%');

manager.train();

function analyzeEmailContent(content) {
    const result = manager.process('en', content);
    return result.intent === 'None' ? 'No task detected' : result.answer;
}

module.exports = { analyzeEmailContent };
