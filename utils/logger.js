const fs = require('fs');
const path = require('path');

// Function to log events to a file
const logEvents = (message, logFile) => {
    const dateTime = new Date().toISOString(); // Get the current timestamp
    const logMessage = `${dateTime} - ${message}\n`; // Format the log message

    const logFilePath = path.join(__dirname, '../logs', logFile); // Ensure logs are saved in a logs folder

    // Check if the 'logs' directory exists; if not, create it
    if (!fs.existsSync(path.dirname(logFilePath))) {
        fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
    }

    // Append the log message to the file
    fs.appendFile(logFilePath, logMessage, (err) => {
        if (err) {
            console.error('Error logging event: ', err);
        }
    });
};

module.exports = { logEvents };
