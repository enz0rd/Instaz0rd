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
            user.dataValues.userIcon = user.dataValues.userIcon.split('Instaz0rd')[1];
            
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
}

module.exports = ProfileController;