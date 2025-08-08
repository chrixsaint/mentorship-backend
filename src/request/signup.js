const { body } = require("express-validator");

const sendemailSignupValidationRules = () => {
  return [
    body("email")
      .notEmpty()
      .withMessage("Email address field is required")
      .isEmail()
      .withMessage("Email must be a valid email address"),
  ];
};
const signupValidationRules = () => {
  return [
    body("code")
      .notEmpty()
      .withMessage("code field is required")
      .isLength({ min: 4, max: 4 })
      .withMessage("code must be a 4-digit number")
      .isNumeric()
      .withMessage("code must be numeric"),

    // body("phoneNumber")
    //   .isMobilePhone()
    //   .withMessage("Enter a valid mobile number"),
    body("firstName").notEmpty().withMessage("user name field is required"),
    body("lastName").notEmpty().withMessage("user name field is required"),
    body("country")
      .notEmpty()
      .withMessage("Country field is required")
      .isString()
      .withMessage("Country must be a string"),

    // body("businessName")
    //   .notEmpty()
    //   .withMessage("business name field is required"),

    body("email")
      .notEmpty()
      .withMessage("Email address field is required")
      .isEmail()
      .withMessage("Email must be a valid email address"),
    body("password").notEmpty().withMessage("password field is required"),
  ];
};

module.exports = {
  sendemailSignupValidationRules,
  signupValidationRules,
};
