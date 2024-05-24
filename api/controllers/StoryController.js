const db = require('../models');
const AuthController = require('./AuthController');
const fs = require('fs');
const path = require('path');

class StoryController {
    
    static async createStory(req, res) {
        const { valid, email } = await AuthController.verifyToken(req);
        if (valid) {
            const user = await db.User.findOne({ where: { email: email } });
            if (!user) {
                return res.status(404).json({ title: "User not found", message: 'The user you are trying to post as does not exist' });
            }

            if(req.file) {
                let relativeUploadDir;
                try {
                    relativeUploadDir = path.join(__dirname, '../uploads/users/', `${user.id}`, "Stories");
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
                        const story = {
                            userId: user.id,
                            storyContent: fileUrl
                        };

                        try {
                            const newStory = await db.Story.create({
                                userId: story.userId,
                                storyContent: story.storyContent,
                            });
                            return res.status(201).json({ title: "Story created", message: 'The story has been created'});
                        } catch (error) {
                            console.error('Error creating story:', error);
                            return res.status(500).json({ title: "Server error", message: 'An error occurred while creating the story' });
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

    static async getStories(req, res) {
        const { valid, email } = await AuthController.verifyToken(req);
        if(valid) {
            const user = await db.User.findOne({ where: { username: req.query.username } });
            if(!user) {
                return res.status(404).json({ title: "User not found", message: 'The user you are trying to get stories from does not exist' });
            }
            try {
                const stories = await db.Story.findAll({
                    where: { 
                        userId: user.id, 
                        createdAt: {
                            [db.Sequelize.Op.gt]: new Date(new Date().setDate(new Date().getDate() - 1))
                        }
                    },
                    order: [['createdAt', 'DESC']],
                    include: [
                        {
                            model: db.User,
                            as: 'userStories',
                            attributes: ['id', 'username', 'userIcon']
                        }
                    ]
                });

                if(!stories || stories.length === 0) {
                    return res.status(404).json({ title: "No stories found", message: 'No stories found' });
                }

                stories.forEach(story => {
                    story.dataValues.storyContent = story.dataValues.storyContent.split('Instaz0rd')[1];
                    story.dataValues.userStories.userIcon = story.dataValues.userStories.userIcon.split('Instaz0rd')[1];
                });

                return res.status(200).json({ title: "Stories found", message: 'Stories found', stories: stories });
            } catch (error) {
                return res.status(500).json({ title: "Server error", message: `There was an error: ${error.message}` });
            }
        } else {
            return res.status(401).json({ title: "Unauthorized", message: 'You are not logged in' });
        }
    }
}

module.exports = StoryController;