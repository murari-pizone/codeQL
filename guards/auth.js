// const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  console.log(req);
  // const token = req.header('Authorization')?.split(' ')[1]; // Bearer <token>

  // if (!token) {
  //     return res.status(401).json({ message: 'Access denied. No token provided.' });
  // }

  try {
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // req.user = decoded; // Attach user info to request
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    res.status(400).json({ message: `Invalid token. Error ${error}` });
  }
};

module.exports = authMiddleware;
