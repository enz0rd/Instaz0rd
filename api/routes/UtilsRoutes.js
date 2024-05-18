const router = require('express').Router();
const UtilsController = require('../controllers/UtilsController');
const cookieParser = require('cookie-parser');

router.use(cookieParser());

router.get('/utils/countries', UtilsController.getCountries);

module.exports = router;