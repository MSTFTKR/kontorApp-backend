const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET; 

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ error: 'Token bulunamadı.' });
  }

  jwt.verify(token, SECRET_KEY,async (err, decodedToken) => {
    if (err) {
      return res.status(403).json({ error: 'Geçersiz token.' });
    }

    
    req.userTcVkn=decodedToken.tcVkn
    next(); 
  });
};

module.exports = authenticateToken;