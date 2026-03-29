const { body, validationResult } = require('express-validator');
const apiResponse = require('./apiResponse');

/**
 * Middleware to check for validation errors
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(
      apiResponse(false, 'Validation failed', {
        errors: errors.array().map((err) => ({
          field: err.path,
          message: err.msg,
        })),
      })
    );
  }
  next();
};

/**
 * Registration validation rules
 */
const registerValidator = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('bloodType')
    .optional()
    .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
    .withMessage('Invalid blood type'),
  body('role')
    .optional()
    .isIn(['donor', 'recipient', 'admin'])
    .withMessage('Invalid role'),
  validate,
];

/**
 * Login validation rules
 */
const loginValidator = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
];

/**
 * Donation Request validation rules
 */
const donationRequestValidator = [
  body('bloodType')
    .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
    .withMessage('Invalid blood type'),
  body('urgency')
    .isIn(['low', 'medium', 'high', 'emergency'])
    .withMessage('Invalid urgency level'),
  body('location').notEmpty().withMessage('Location is required'),
  validate,
];

module.exports = {
  registerValidator,
  loginValidator,
  donationRequestValidator,
};
