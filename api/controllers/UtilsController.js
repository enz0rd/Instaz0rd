const db = require('../models');
const fs = require('fs');
const path = require('path');
const AuthController = require('./AuthController');

class UtilsController {
  static async getCountries(req, res) {
    try {
      const states = await db.Country.findAll({
        attributes: ['id', 'nameCountry'],
      });
      res.json(states);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getImages(req, res) {
    try {
      const { valid, email } = await AuthController.verifyToken(req);
      if (valid) {
        const user = await db.User.findOne({ where: { email: email, active: 1 } });
        if (!user) {
          return res.status(404).json({ title: "User not found", message: 'The user you are trying to access does not exist' });
        }
        
        const relativePath = req.query.path;
        if (!relativePath) {
          return res.status(400).json({ title: "Bad Request", message: 'Path query parameter is required' });
        }
        
        // Prevenir ataques de Path Traversal
        const safePath = path.normalize(relativePath).replace(/^(\.\.(\/|\\|$))+/, '');
        const basePath = path.join(__dirname, '../..');
        const imagePath = path.join(basePath, safePath);
        
        // Verificar se o arquivo está dentro do diretório permitido
        if (!imagePath.startsWith(basePath)) {
          return res.status(400).json({ title: "Bad Request", message: 'Invalid path' });
        }
        
        // Verificar se o arquivo existe
        if (fs.existsSync(imagePath)) {
          return res.sendFile(imagePath);
        } else {
          return res.status(404).json({ title: "Image not found", message: 'The image does not exist' });
        }
      } else {
        return res.status(401).json({ title: "Unauthorized", message: 'You are not logged in' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async randomUsersWithFollowers(req, res) {
    const { valid, email } = await AuthController.verifyToken(req);
    if(valid) {
      try {
        const users = await db.User.findAll({
          where: { email: { [db.Sequelize.Op.ne]: email } },
          order: db.Sequelize.literal('rand()'),
          limit: 10,
          attributes: ['id', 'username', 'name', 'userIcon'],
          raw: true
        });

        for(let user of users) {
          user.userIcon = user.userIcon.split(`Instaz0rd`)[1];
          const followers = await db.Followers.findAll({
            where: { followedId: user.id },
            attributes: ['followerId'],
          });
          user.followers = followers.length;
        }

        res.status(200).json(users);
      } catch (error) {
        res.status(500).json({ title:"Error:", message: `There was an error fetching users: ${error.message}` });
      }
    } else {
      return res.status(401).json({ title: "Unauthorized", message: 'You are not logged in' });
    }
  }
}

module.exports = UtilsController;