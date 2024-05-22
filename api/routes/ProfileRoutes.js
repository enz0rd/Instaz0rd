const router = require('express').Router();
const ProfileController = require('../controllers/ProfileController');
const cookieParser = require('cookie-parser');

router.use(cookieParser());

router.get('/u/details', ProfileController.getDetails);
router.get('/u/search', ProfileController.searchUsers);
router.get('/u/getNotifications', ProfileController.getNotifications);
router.post('/u/follow', ProfileController.followUser);
router.post('/u/unfollow', ProfileController.unfollowUser);

module.exports = router;