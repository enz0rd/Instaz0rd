const router = require('express').Router();
const UtilsController = require('../controllers/UtilsController');
const cookieParser = require('cookie-parser');

router.use(cookieParser());

router.get('/utils/countries', UtilsController.getCountries);
router.get('/api/getImages', UtilsController.getImages);

module.exports = router;