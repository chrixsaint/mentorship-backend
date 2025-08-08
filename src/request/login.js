const { body } = require("express-validator");

const loginValidationRules = () => {
  return [
    body("email")
      .notEmpty()
      .withMessage("Email address field is required")
      .isEmail()
      .withMessage("Email must be a valid email address"),
    body("password").notEmpty().withMessage("password field is required"),
  ];
};

const verifyValidationRules = () => {
  return [body("emailCode").notEmpty().withMessage("code field is required")];
};

// const sendEmailPasswordChangeRules = () => {
//   return [
//     body("email")
//       .notEmpty()
//       .withMessage("Email address field is required")
//       .isEmail()
//       .withMessage("Email must be a valid email address"),
//   ];
// };

// const verifyCodePasswordValidationRules = () => {
//   return [
//     body("code").notEmpty().withMessage("code field is required"),
//     body("email")
//       .notEmpty()
//       .withMessage("Email address field is required")
//       .isEmail()
//       .withMessage("Email must be a valid email address"),
//   ];
// };

module.exports = {
  verifyValidationRules,
  loginValidationRules,
  // verifyCodePasswordValidationRules,
  // sendEmailPasswordChangeRules,
};
