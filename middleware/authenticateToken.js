// authenticateToken.js
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) {
    return res.sendStatus(401);
  }
  JWT_SECRET="#%YRWR#F#"

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.log("eroor is here");
      return res.sendStatus(403);
    }
    console.log("i am here");
    req.userId = user.userId; // Add userId to request object
    console.log("i am here",req.userId);
    next();
  });
};

module.exports = authenticateToken;
