const db = require('../models');
const AuthController = require('./AuthController');
const Sequelize = require('sequelize');
const fs = require('fs').promises;

class ProfileController {
    // static async getMe(req, res) {
    //     const { valid, email } = await AuthController.verifyToken(req);
    //     if (valid) {
    //         const user = await db.User.findOne({attributes: { exclude: ['password'] }},{ where: { email: email } });
    //         if (!user) {
    //             return res.status(404).json({ title: "User not found", message: 'The user you are trying to get does not exist' });
    //         }
    //         return res.status(200).json(user);
    //     } else {
    //         return res.status(401).json({ title: "Unauthorized", message: 'You are not logged in' });
    //     }
    // }
    static async getNotifications(req, res) {
        const { valid, email } = await AuthController.verifyToken(req);
        if (valid) {
            const user = await db.User.findOne({ where: { email: email } });
            if(user == null) {
                return res.status(404).json({ title: "User not found", message: 'The user you are trying to get does not exist' });
            }

            const userId = user.id;
            const notifications = await db.Notification.findAll(
                { 
                    where: { 
                        userToId: userId 
                    },
                    order: [['createdAt', 'DESC']],
                    include: [
                        {
                            model: db.User,
                            attributes: ['username', 'userIcon'],
                            as: 'userFrom',
                        },
                        {
                            model: db.User,
                            attributes: ['username', 'userIcon'],
                            as: 'userTo',
                        },
                    ], 
                });
            
                for (let notification of notifications) {
                    notification.userFrom.userIcon = notification.userFrom.userIcon.split('Instaz0rd')[1];
                }

            return res.status(200).json(notifications);
        } else {
            return res.status(401).json({ title: "Unauthorized", message: 'You are not logged in' });
        }
    }

    static async getDetails(req, res) {
        const { valid, email } = await AuthController.verifyToken(req);
        if (valid) {
            const userReq = await db.User.findOne({ where: { email: email } });

            const user = await db.User.findOne({
                attributes: { exclude: ['password'] },
                where: { username: req.query.username },
                include: [
                    {
                        model: db.Country,
                        attributes: ['nameCountry'],
                        as: 'country'
                    }
                ]
            });
            // console.log(user.dataValues)
            if (user == null) {
                return res.status(404).json({ title: "User not found", message: 'The user you are trying to get does not exist' });
            }

            user.dataValues.qtFollowers = await db.Followers.count({ where: { FollowedId: user.dataValues.id } });
            user.dataValues.qtFollowing = await db.Followers.count({ where: { FollowerId: user.dataValues.id } });
            user.dataValues.qtPosts = await db.Post.count({ where: { UserId: user.dataValues.id } });

            
            if(user.dataValues.id === userReq.dataValues.id) {
                user.dataValues.isSelf = true;
            } else {
                user.dataValues.isSelf = false;
                user.dataValues.isFollowing = await db.Followers.findOne({ where: {
                    FollowedId: user.dataValues.id,
                    FollowerId: userReq.dataValues.id
                }}) ? true : false;
            }

            user.dataValues.userIcon = user.dataValues.userIcon.split('Instaz0rd')[1];

            console.log(user);

            return res.status(200).json(user);
        } else {
            return res.status(401).json({ title: "Unauthorized", message: 'You are not logged in' });
        }
    }

    static async searchUsers(req, res) { 
        const query = req.query.q;
        try {
            const users = await db.User.findAll({
                attributes: ['username', 'userIcon'],
                where: {
                    username: {
                        [Sequelize.Op.like]: `%${query}%`
                    }
                }
            });

            const usersWithImages = await Promise.all(users.map(async (user) => {
                const userIconPath = user.dataValues.userIcon.split('Instaz0rd')[1];
                try {
                    user.dataValues.userIcon = userIconPath;
                } catch (error) {
                    console.error(`Error reading image for user ${user.dataValues.username}:`, error);
                    user.dataValues.userIcon = null; // Handle the case where image reading fails
                }
                return user;
            }));

            return res.status(200).json(usersWithImages);
        } catch (error) {
            console.error("Error fetching users:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    static async followUser(req, res) {
        const { valid, email } = await AuthController.verifyToken(req);
        if (valid) {
            const userReq = await db.User.findOne({ where: { email: email } });
            const userToFollow = await db.User.findOne({ where: { id: req.body.userId } });
            if (userToFollow == null) {
                return res.status(404).json({ title: "User not found", message: 'The user you are trying to follow does not exist' });
            }

            const follow = await db.Followers.findOne({ where: {
                FollowedId: userToFollow.id,
                FollowerId: userReq.id
            }});

            if(follow) {
                return res.status(400).json({ title: "Already following", message: 'You are already following this user' });
            }

            await db.Followers.create({
                FollowedId: userToFollow.id,
                FollowerId: userReq.id
            });

            await db.Notification.create({
                userFromId: userReq.id,
                userToId: userToFollow.id,
                notificationMessage: 'followed you',
            });

            return res.status(200).json({ title: "Success", message: 'You are now following this user' });
        } else {
            return res.status(401).json({ title: "Unauthorized", message: 'You are not logged in' });
        }
    }

    static async unfollowUser(req, res) {
        const { valid, email } = await AuthController.verifyToken(req);
        if(valid) {
            const userReq = await db.User.findOne({ where: { email: email } });
            const userToUnfollow = await db.User.findOne({ where: { id: req.body.userId } });
            if (userToUnfollow == null) {
                return res.status(404).json({ title: "User not found", message: 'The user you are trying to unfollow does not exist' });
            }

            const follow = await db.Followers.findOne({ where: {
                FollowedId: userToUnfollow.id,
                FollowerId: userReq.id
            }});

            if(!follow) {
                return res.status(400).json({ title: "Not following", message: 'You are not following this user' });
            }

            await db.Notification.destroy({ where: {
                userFromId: userReq.id,
                userToId: userToUnfollow.id,
                notificationMessage: 'followed you',
            } });

            await db.Followers.destroy({ where: {
                FollowedId: userToUnfollow.id,
                FollowerId: userReq.id
            }});

            return res.status(200).json({ title: "Success", message: 'You are no longer following this user' });
        }
    }
}

module.exports = ProfileController;