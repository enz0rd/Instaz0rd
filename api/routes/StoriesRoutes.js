const router = require('express').Router();
const StoryController = require('../controllers/StoryController');
const cookieParser = require('cookie-parser');

router.use(cookieParser());

const multer = require('multer');
const stories = multer({
    dest: 'uploads/stories/', // Pasta temporária para uploads
});

router.use(cookieParser());

router.post('/u/createStory', stories.single('storyContent'), StoryController.createStory);
router.delete('/u/deleteStory', StoryController.deleteStory);
router.get('/u/getStories', StoryController.getStories);

module.exports = router;