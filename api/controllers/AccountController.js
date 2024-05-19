const db = require('../models');
const fs = require('fs');
const path = require('path');
const AuthController = require('./AuthController');
const cookie = require('cookie');

class AccountController {
    static async createAccount(req, res) {
        const auth = AuthController.verifyToken(req);
        if (auth) {
            const { username, name, email, password, phonenum, countryFrom } = req.body;
            const alreadyCreatedEmail = await db.User.findOne({ where: { email: email } });
            const alreadyCreatedUsername = await db.User.findOne({ where: { username: username } });
            if (alreadyCreatedEmail || alreadyCreatedUsername) {
                return res.status(400).json({ title: "User Exists", message: 'An user with the same email or username already exists' });
            }

            const imagePath = path.join(__dirname,'..', 'assets', 'user-default.png'); // Altere para o caminho correto

            try {
                const newUser = await db.User.create({
                    username: username,
                    name: name,
                    email: email,
                    password: atob(password),
                    userIcon: imagePath,
                    phonenum: phonenum,
                    countryFrom: countryFrom
                });
                return res.status(201).json({ title: "Account created", message: 'Your account has just been created!' });
            } catch (error) {
                return res.status(500).json({ title: "Error creating account", message: `There was an error creating your account: ${error.message}` });
            }
        }
        else {
            return res.status(401).json({ title: "Unauthorized", message: 'You are not logged in' });
        }
    }

    static async deleteAccount(req, res) {
        try {
            const { valid, email } = await AuthController.verifyToken(req);
            if (valid) {
                
                const user = await db.User.findOne({ where: { email: email } });
                if (!user) {
                    return res.status(404).json({ title: "User not found", message: 'The user you are trying to delete does not exist' });
                }
                try {
                    await db.User.update({ active: 0 }, { where: { email: email } });
                    return res.status(200).json({ title: "Account deleted", message: 'The account has been deleted' });
                } catch (error) {
                    return res.status(500).json({ title: "Error deleting account", message: `There was an error deleting the account: ${error.message}` });
                }
            } else {
                return res.status(401).json({ title: "Unauthorized", message: 'You are not logged in' });
            }
        } catch (error) {
            return res.status(500).json({ title: "Error", message: `An error occurred: ${error.message}` });
        }
    }

    static async updateAccount(req, res) {
        try {
            const { valid, email } = await AuthController.verifyToken(req);
            if (valid) {
                const user = await db.User.findOne({ where: { email: email, active: 1 } });
                if (!user) {
                    return res.status(404).json({ title: "User not found", message: 'The user you are trying to update does not exist' });
                }
                
                const { username, name, password, phonenum, countryFrom } = req.body;

                console.log(req.file)

                if (req.file) {
                    let relativeUploadDir;
                    try {
                        relativeUploadDir = path.join(__dirname, '../uploads/users/', `${user.id}`, "Icon");
                        console.log(relativeUploadDir)
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
                        if (fs.existsSync(relativeUploadDir) && fs.lstatSync(relativeUploadDir).isDirectory()) {
                            fs.readdirSync(relativeUploadDir).forEach((file) => {
                                const filePath = path.join(relativeUploadDir, file);
                                if (fs.lstatSync(filePath).isFile()) { // Verifica se é um arquivo
                                    fs.unlinkSync(filePath); // Remove o arquivo
                                }
                            });
                        }
                        fs.writeFileSync(filePath, buffer);
                        const fileUrl = filePath;

                        try {
                            await db.User.update({
                                userIcon: fileUrl
                            }, { where: { email: email } });

                            return res.status(200).json({ title: "Account updated", message: 'The account has been updated', imageDir: fileUrl.split('/Instaz0rd')[1] });
                        } catch (error) {
                            return res.status(500).json({ title: "Error updating account", message: `There was an error updating the account: ${error.message}` });
                        }
                    } catch (error) {
                        return res.status(500).json({ title: "Error saving file", message: `There was an error saving the file: ${error.message}` });
                    }
                } else {
                    if (username) {
                        const userReq = await db.User.findOne({ where: { email: email, active: 1 } });
                        console.log(userReq.id)
                        const findUsername = await db.User.findOne({ where: { username: username } });
                        if (findUsername && findUsername.id !== userReq.id) {
                            return res.status(409).json({ title: "Username taken", message: 'This username is already taken' });
                        }
                    }
                    try {
                        await db.User.update({
                            username: username ? username : user.username,
                            name: name ? name : user.name,
                            password: password ? atob(password) : user.password,
                            phonenum: phonenum ? phonenum : user.phonenum,
                            countryFrom: countryFrom ? countryFrom : user.countryFrom
                        }, { where: { email: email } })

                        const userUpdated = await db.User.findOne({ where: { email: email, active: 1 } });

                        let userSend = {
                            id: userUpdated.id,
                            username: userUpdated.username,
                            name: userUpdated.name,
                            bio: userUpdated.bio,
                            email: userUpdated.email,
                            phonenum: userUpdated.phonenum,
                            countryFrom: userUpdated.countryFrom,
                        } 

                        const newCookie = cookie.serialize('user', JSON.stringify(userSend), "");
                        return res.status(200).setHeader('Set-Cookie', newCookie).json({ title: "Account updated", message: 'The account has been updated' });
                    } catch (error) {
                        return res.status(500).json({ title: "Error updating account", message: `There was an error updating the account: ${error.message}` });
                    }
                }
            } else {
                return res.status(401).json({ title: "Unauthorized", message: 'You are not logged in' });
            }
        } catch (error) {
            return res.status(500).json({ title: "Error", message: `An error occurred: ${error.message}` });
        }
    }
    
}

async function readFileAndConvertToBlob(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (error, data) => {
            if (error) {
                reject(error);
                return;
            }
            const blob = Buffer.from(data, 'base64');
            resolve(blob);
        });
    });
}

module.exports = AccountController;