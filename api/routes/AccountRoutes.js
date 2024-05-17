const router = require('express').Router();
const AccountController = require('../controllers/AccountController');
const cookieParser = require('cookie-parser');

router.use(cookieParser());

router.post('/createAccount', AccountController.createAccount);
router.post('/deleteAccount', AccountController.deleteAccount);

module.exports = router;