const db = require('../models');
const AuthController = require('./AuthController');

class AccountController {
    static async createAccount(req, res) {
        const auth = AuthController.verifyToken(req);
        if (auth) {
            const { username, name, email, password, userIcon, phonenum, countryFrom } = req.body;
            const alreadyCreated = await db.User.findOne({ where: { email: email } });
            if (alreadyCreated) {
                return res.status(400).json({ title: "User Exists", message: 'An user with the same email already exists' });
            }
            try {
                const newUser = await db.User.create({
                    username: username,
                    name: name,
                    email: email,
                    password: password,
                    userIcon: userIcon,
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
            const auth = await AuthController.verifyToken(req);
            // console.log(req.cookies['token']);
            if (auth) {
                const { email } = req.body;
                const user = await db.User.findOne({ where: { email: email } });
                if (!user) {
                    return res.status(404).json({ title: "User not found", message: 'The user you are trying to delete does not exist' });
                }
                try {
                    // await db.User.destroy({ where: { email: email } });
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
    
}

module.exports = AccountController;