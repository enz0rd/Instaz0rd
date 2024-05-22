const router = require('express').Router();
const PostController = require('../controllers/PostController');
const cookieParser = require('cookie-parser');

router.use(cookieParser());

const multer = require('multer');
const upload = multer({
    dest: 'uploads/posts/', // Pasta temporária para uploads
});

router.use(cookieParser());

router.post('/u/createPost', upload.single('postContent'), PostController.createPost);
router.get('/u/posts', PostController.getUserPosts);
router.get('/u/posts/details', PostController.getUserPostById);
router.post('/u/likePost', PostController.likePost);
router.get('/posts/getComments', PostController.getComments);
router.post('/posts/createComment', PostController.createComment);
router.get('/posts/fy', PostController.getPostsFY);
router.get('/posts/friends', PostController.getPostsFriends);


module.exports = router;