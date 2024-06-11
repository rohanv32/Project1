const express = require('express');
const { sendNotifications } = require('../controllers/notificationController');

const router = express.Router();

router.get('/', sendNotifications);

module.exports = router;