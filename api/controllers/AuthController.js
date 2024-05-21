const db = require('../models');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const privateKey = fs.readFileSync('./api/private.key');

class AuthController {
    static async login(req, res) {
        const { username, password } = req.body;
        try {
            var user;
            const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (regex.test(username)) {
                user = await db.User.findOne({ where: { email: username, active: 1 } });
            } else {
                user = await db.User.findOne({ where: { username: username, active: 1 } });
            }
            
            if (!user || user.password !== atob(password)) {
                return res.status(404).json({ title: 'Invalid credentials', message: "The user and password combination are incorrect or the user doesn't exists" });
            }

            let userSend = {
                id: user.id,
                username: user.username,
                name: user.name,
                bio: user.bio,
                email: user.email,
                phonenum: user.phonenum,
                countryFrom: user.countryFrom,
                since: user.createdAt,
            }            

            var token = jwt.sign({ email: user.email }, privateKey, { expiresIn: 86400 }); 
            
            return res.status(200)
                .cookie('token', token)
                .cookie('user', userSend)
                .json({ title: 'Success', message: 'Logged in successfully', userIcon: user.dataValues.userIcon.split('Instaz0rd')[1] });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    static async logout(res) {
        return res.clearCookie('token').clearCookie('user').json({ message: 'Logged out' });
    }

    static async verifyToken(req) {
        return new Promise((resolve, reject) => {
            const cookies = req.cookies;
            if (cookies === undefined) {
                resolve({valid: false});
            }
    
            const token = req.cookies.token;
    
            jwt.verify(token, privateKey, (err, decoded) => {
                if (err) {
                    resolve({valid: false});
                }
                const email = decoded.email;
                resolve({valid: true, email: email});
            });
        });
    }
}

module.exports = AuthController;