const express = require('express');
const router = express.Router();
const { getNews, getJournalistRatings, storeJournalistRatings } = require('../controllers/newsController');

router.get('/', getNews);
router.get('/journalist/:journalist', getJournalistRatings);
router.post('/journalist', storeJournalistRatings);

module.exports = router;
