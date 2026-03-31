const { body, validationResult } = require("express-validator");
const apiResponse = require("./apiResponse");

/**
 * Middleware to check for validation errors
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(
      apiResponse(false, "Validation failed", {
        errors: errors.array().map((err) => ({
          field: err.path,
          message: err.msg,
        })),
      }),
    );
  }
  next();
};

/**
 * Registration validation rules (Matching frontend Zod schema)
 */
const registerValidator = [
  body("fullName").isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
  body("email").isEmail().withMessage("Invalid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("gender").notEmpty().withMessage("Please select your gender"),
  body("bloodGroup")
    .isIn(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
    .withMessage("Please select a valid blood group"),
  body("phone")
    .isLength({ min: 10 })
    .withMessage("Valid phone number is required"),
  body("city").isLength({ min: 2 }).withMessage("City is required"),
  body("district").isLength({ min: 2 }).withMessage("District is required"),
  body("country").isLength({ min: 2 }).withMessage("Country is required"),
  body("lastDonation").optional(),
  body("agreedToTerms")
    .custom((val) => val === true)
    .withMessage("You must agree to the terms"),
  validate,
];

/**
 * Login validation rules
 */
const loginValidator = [
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
  validate,
];

/**
 * Donation Request validation rules
 */
const donationRequestValidator = [
  body("bloodGroup")
    .isIn(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
    .withMessage("Invalid blood group"),
  body("urgency")
    .isIn(["low", "medium", "high", "emergency"])
    .withMessage("Invalid urgency level"),
  body("location").notEmpty().withMessage("Location is required"),
  validate,
];

module.exports = {
  registerValidator,
  loginValidator,
  donationRequestValidator,
};
