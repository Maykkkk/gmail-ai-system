const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const emailRoutes = require('./routes/email');
const taskRoutes = require('./routes/tasks');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files (index.html, style.css)

// Routes
app.use('/api/email', emailRoutes); // Email-related endpoints
app.use('/api/tasks', taskRoutes); // Task scheduling endpoints

// Root Route
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
