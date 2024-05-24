const db = require('../models');
const AuthController = require('./AuthController');
const fs = require('fs');
const path = require('path');

class PostController {
    static async getPostsFY(req, res) {
        const { valid, email } = await AuthController.verifyToken(req);
        if (valid) {
            try {
                const fromCountry = await db.User.findAll({
                    attributes: ['id'],
                    where: {
                        country: req.query.country
                    },
                });

                const usersFromCountry = fromCountry.map(user => user.id);

                const posts = await db.Post.findAll({
                    where: {
                        userId: {
                            [db.Sequelize.Op.in]: usersFromCountry
                        }
                    },
                    include: [
                        {
                            model: db.User,
                            attributes: ['username', 'userIcon']
                        }
                    ],
                    limit: 10
                });

                return res.status(200).json(posts);
            } catch (error) {
                console.error('Error getting posts:', error);
                return res.status(500).json({ title: "Server error", message: 'An error occurred while getting posts' });
            }
        } else {
            return res.status(401).json({ title: "Unauthorized", message: 'You are not logged in' });
        }
    }

    static async getPostsFriends(req, res) {
        const { valid, email } = await AuthController.verifyToken(req);
        if (valid) {
            try {
                const friends = await db.Friend.findAll({
                    where: {
                        [db.Sequelize.Op.or]: [
                            { ownerId: req.query.userId },
                            { friendId: req.query.userId }
                        ]
                    },
                    include: [
                        {
                            model: db.User,
                            as: 'owner'
                        },
                        {
                            model: db.User,
                            as: 'friend'
                        }
                    ]
                });

                const friendIds = friends.map(friend => friend.ownerId === req.query.userId ? friend.friendId : friend.ownerId);

                const posts = await db.Post.findAll({
                    where: {
                        userId: {
                            [db.Sequelize.Op.in]: friendIds
                        }
                    },
                    include: [
                        {
                            model: db.User,
                            attributes: ['username', 'userIcon']
                        }
                    ]
                });

                return res.status(200).json(resp);
            } catch (error) {
                console.error('Error getting posts:', error);
                return res.status(500).json({ title: "Server error", message: 'An error occurred while getting posts' });
            }
        } else {
            return res.status(401).json({ title: "Unauthorized", message: 'You are not logged in' });
        }
    }

    static async getUserPosts(req, res) {
        const { valid, email } = await AuthController.verifyToken(req);
        if (valid) {
            try {
                const user = await db.User.findAll({ 
                    where: {
                        username: { 
                            [db.Sequelize.Op.or]: [req.query.username] 
                        }
                    },
                    raw: true,
                });

                if(user.length == 0) {
                    return res.status(404).json({ title: "User not found", message: 'The user you are trying to get does not exist' });
                }

                const posts = await db.Post.findAll({
                    where: {
                        userId:{ 
                            [db.Sequelize.Op.or]: [
                                user[0].id 
                            ]
                        }
                    },
                    include: [
                        {
                            model: db.User,
                            attributes: ['username', 'userIcon']
                        }
                    ],
                    raw: true,
                    nest: true,
                    order: [['createdAt', 'DESC']]
                });
                
                for (let post of posts) {
                    const likes = await db.LikesPosts.findAll({ where: { postId: post.id } });
                    const comments = await db.CommentsPosts.findAll({ where: { postId: post.id } });
                    post.likes = likes.length;
                    post.comments = comments.length;
                    post.User.userIcon = post.User.userIcon.split('Instaz0rd')[1];
                    post.postContent = post.postContent.split('Instaz0rd')[1];
                }
                return res.status(200).json(posts);
            } catch (error) {
                console.error('Error getting posts:', error);
                return res.status(500).json({ title: "Server error", message: 'An error occurred while getting posts' });
            }
        } else {
            return res.status(401).json({ title: "Unauthorized", message: 'You are not logged in' });
        }
    }

    static async getUserPostById(req, res) {
        const { valid, email } = await AuthController.verifyToken(req);
        if (valid) {
            try {
                const user = await db.User.findAll({ 
                    where: {
                        username: { 
                            [db.Sequelize.Op.or]: [req.query.username] 
                        }
                    },
                    raw: true,
                });

                console.log(req.query)

                if(user.length == 0) {
                    return res.status(404).json({ title: "User not found", message: 'The user you are trying to get does not exist' });
                }

                const post = await db.Post.findOne({
                    where: {
                        id:{ 
                            [db.Sequelize.Op.or]: [
                                req.query.postId 
                            ],
                        userId:{
                            [db.Sequelize.Op.or]: [
                                user[0].id
                            ]
                        }
                        }
                    },
                    include: [
                        {
                            model: db.User,
                            attributes: ['username', 'userIcon']
                        }
                    ],
                    raw: true,
                    nest: true,
                    order: [['createdAt', 'DESC']]
                });
                
                if(post == null) {
                    return res.status(404).json({ title: "Post not found", message: 'The post you are trying to get does not exist' });
                }

                const likes = await db.LikesPosts.findAll({ where: { postId: post.id } });
                const comments = await db.CommentsPosts.findAll({ where: { postId: post.id } });
                post.likes = likes.length;
                post.comments = comments.length;
                post.User.userIcon = post.User.userIcon.split('Instaz0rd')[1];
                post.postContent = post.postContent.split('Instaz0rd')[1];

                return res.status(200).json(post);
            } catch (error) {
                console.error('Error getting posts:', error);
                return res.status(500).json({ title: "Server error", message: 'An error occurred while getting posts' });
            }
        } else {
            return res.status(401).json({ title: "Unauthorized", message: 'You are not logged in' });
        }
    }

    static async createPost(req, res) {
        const { valid, email } = await AuthController.verifyToken(req);
        if (valid) {
            const user = await db.User.findOne({ where: { email: email } });
            if (!user) {
                return res.status(404).json({ title: "User not found", message: 'The user you are trying to post as does not exist' });
            }

            if(req.file) {
                let relativeUploadDir;
                try {
                    relativeUploadDir = path.join(__dirname, '../uploads/users/', `${user.id}`, "Posts");
                    fs.mkdirSync(relativeUploadDir, { recursive: true });
                } catch (error) {
                    return res.status(500).json({ title: "Error creating directory", message: `There was an error creating the directory: ${error.message}` });
                }
                
                try {
                    const buffer = await fs.readFileSync(req.file.path);
                    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
                    const filename = `${req.file.originalname.replace(
                        /\.[^/.]+$/,
                        ""
                    )}-${uniqueSuffix}${path.extname(req.file.originalname)}`;
                    const filePath = path.join(relativeUploadDir, filename);
                    fs.writeFileSync(filePath, buffer);
                    const fileUrl = filePath;

                    try {
                        const post = {
                            userId: user.id,
                            postContent: fileUrl
                        };

                        try {
                            const newPost = await db.Post.create({
                                userId: post.userId,
                                postContent: post.postContent,
                                postDescription: req.body.postDescription
                            });
                            return res.status(201).json({ title: "Post created", message: 'The post has been created'});
                        } catch (error) {
                            console.error('Error creating post:', error);
                            return res.status(500).json({ title: "Server error", message: 'An error occurred while creating the post' });
                        }
                    } catch (error) {
                        return res.status(500).json({ title: "Server error", message: `There was an error: ${error.message}` });
                    }
                } catch (error) {
                    return res.status(500).json({ title: "Error saving file", message: `There was an error saving the file: ${error.message}` });
                }
            }

        } else {
            return res.status(401).json({ title: "Unauthorized", message: 'You are not logged in' });
        }
    }

    static async likePost(req, res) {
        const { valid, email } = await AuthController.verifyToken(req);
        if(valid) {
            try {
                const user = await db.User.findOne({ where: { email: email } });
                if (!user) {
                    return res.status(404).json({ title: "User not found", message: 'The user you are trying to like as does not exist' });
                }

                const { postId } = req.body

                const checkLike = await db.LikesPosts.findOne({ where: { userId: user.id, postId: postId } });
                if(checkLike) {
                    const removeLike = await db.LikesPosts.destroy({ where: { userId: user.id, postId: postId } });
                    await db.Notification.destroy({ where: { userFromId: user.id, userToId: postId, notificationMessage: 'liked your post' } });
                    return res.status(200).json({ title: "Like removed", message: 'The like has been removed' });
                } else {
                    const like = await db.LikesPosts.create({ userId: user.id, postId: postId });
                    const post = await db.Post.findAll({
                        attributes: ['userId'],
                        where: { 
                          id: postId // Supondo que 'postId' seja a variável que contém o ID do post
                        }
                      });
                    if(user.id !== post[0].userId) {
                        const sendNotification = await db.Notification.create({ userFromId: user.id, userToId: post[0].userId, notificationMessage: 'liked your post' });
                    }
                    return res.status(200).json({ title: "Like added", message: 'The like has been added' });
                }
            } catch (error) {
                console.error('Error liking post:', error);
                return res.status(500).json({ title: "Server error", message: 'An error occurred while liking the post: '+error.message });
            }
        } else {
            return res.status(401).json({ title: "Unauthorized", message: 'You are not logged in' });
        }
    }

    static async getComments(req, res) {
        const { valid, email } = await AuthController.verifyToken(req);
        if(valid) {
            try {
                const comments = await db.CommentsPosts.findAll({ 
                    where: { 
                        postId: req.query.postId 
                    },
                    include: [
                        {
                            model: db.User,
                            attributes: ['username', 'userIcon'],
                            as: 'commentsUser'
                        }
                    ], 
                });

                for(let comment of comments) {
                    comment.commentsUser.userIcon = comment.commentsUser.userIcon.split('Instaz0rd')[1];
                }
                return res.status(200).json(comments);
            } catch (error) {
                console.error('Error getting comments:', error);
                return res.status(500).json({ title: "Server error", message: 'An error occurred while getting comments' });
            }
        } else {
            return res.status(401).json({ title: "Unauthorized", message: 'You are not logged in' });
        }
    }

    static async createComment(req, res) {
        const { valid, email } = await AuthController.verifyToken(req);
        if(valid) {
            try {
                const user = await db.User.findOne({ where: { email: email } });
                if (!user) {
                    return res.status(404).json({ title: "User not found", message: 'The user you are trying to comment as does not exist' });
                }

                const { postId, comment } = req.body;

                const newComment = await db.CommentsPosts.create({ userId: user.id, postId: postId, comment: comment });
                const sendComment = {
                    userComment: {
                        username: user.username,
                        userIcon: user.userIcon.split('Instaz0rd')[1]
                    },
                    comment: comment,
                    createdAt: newComment.createdAt
                }

                const userPost = await db.Post.findOne({ where: { id: postId }, include: [ { model: db.User, attributes: ['id'] } ]});

                if(user.id !== userPost.User.id) {
                    const notification = await db.Notification.create({ userFromId: user.id, userToId: userPost.User.id, notificationMessage: 'commented on your post' });
                }

                return res.status(201).json(sendComment);
            } catch (error) {
                console.error('Error creating comment:', error);
                return res.status(500).json({ title: "Server error", message: 'An error occurred while creating the comment' });
            }
        } else {
            return res.status(401).json({ title: "Unauthorized", message: 'You are not logged in' });
        }
    }
}

module.exports = PostController