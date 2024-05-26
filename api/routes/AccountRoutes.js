const router = require('express').Router();
const AccountController = require('../controllers/AccountController');
const cookieParser = require('cookie-parser');
const path = require('path');

const multer = require('multer');
const upload = multer({
    dest: 'uploads/', // Pasta temporária para uploads
});

router.use(cookieParser());

router.post('/createAccount', AccountController.createAccount);
router.post('/deleteAccount', AccountController.deleteAccount);
router.post('/updateAccount', upload.single('userIcon'), AccountController.updateAccount);
router.post('/u/confirmPassword', AccountController.confirmPassword);

module.exports = router;
