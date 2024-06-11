const sendNotifications = (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const sendEvent = (data) => {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    // Example: Send a notification every 10 seconds
    const intervalId = setInterval(() => {
        sendEvent({ message: 'This is a test notification' });
    }, 10000);

    req.on('close', () => {
        clearInterval(intervalId);
        res.end();
    });
};

module.exports = { sendNotifications };