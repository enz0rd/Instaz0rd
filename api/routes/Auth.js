const router = require('express').Router();
const AuthController = require('../controllers/AuthController');
const cookieParser = require('cookie-parser');

router.use(cookieParser());

router.post('/login', AuthController.login);
router.get('/logout', AuthController.logout);
module.exports = router;