const jwt = require('jsonwebtoken');

/**
 * Generate a JWT for a user
 * @param {string} id - User ID
 * @returns {string} - Signed JWT
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = generateToken;
