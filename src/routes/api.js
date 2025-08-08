const express = require("express");
router = express.Router();
const { validate } = require("../request/validate");
const {
  signupValidationRules,
  sendemailSignupValidationRules,
} = require("../request/signup");
const {
  loginValidationRules,
  verifyValidationRules,
  verifyCodePasswordValidationRules,
  sendEmailPasswordChangeRules,
} = require("../request/login");

const FetchUserDetails = require("../controllers/userDashboard/fetchUserDetails");
// const Fetchapps = require("../controllers/Mains/fetch-active-apps");
// const {
//   createAppValidationRules,
//   updateAppValidationRules,
//   submittAppValidationRules,
// } = require("../request/otherValidation");

const auth = require("../middleware/auth");
const multer = require("multer");
const { responseMessage } = require("../helpers/helpers");
const SignupController = require("../controllers/Auth/signup");
const LoginController = require("../controllers/Auth/login");
// const ImageController = require("../controllers/images/appimages");
// const CreateApp = require("../controllers/Mains/createapp");
// const ApkUploadController = require("../controllers/Mains/uploadapp");
// const fetchUserController = require("../controllers/Mains/userprofile");

// const FetchProfile = require("../controllers/Mains/fetchmyprofile");

// const FetchMyApps = require("../controllers/Mains/fetchmyapps");

// const FetchInReviewApps = require("../controllers/Mains/fetchonlyappsinreview");
// const RejectSubmission = require("../controllers/Mains/reject-submission");
// const RejectActiveApp = require("../controllers/Mains/reject-active-app");

// const app = express();
// const admin = require("firebase-admin");
// const FetchActiveApps = require("../controllers/Mains/fetch-active-apps");
// // Middleware for parsing JSON
// app.use(express.json());

const upload = multer(); // memory storage by default for text + file fields

// routes;
router.post(
  "/signup-start",
  signupValidationRules(),
  validate,
  SignupController.signup
);

router.post(
  "/signup/sendemail",
  sendemailSignupValidationRules(),
  validate,
  SignupController.sendemailSignup
);

router.post("/login", loginValidationRules(), validate, LoginController.login);

router.post(
  "/upload-images",
  upload.single("file")
  //   auth,
  // ImageController.images
);

router.get("/getUserDetails", auth, validate, FetchUserDetails.getUserDetails);

// router.post(
//   "/verify-login",
//   verifyValidationRules(),
//   validate,
//   LoginController.verify
// );

// router.post(
//   "/create-app",
//   createAppValidationRules(),
//   validate,
//   auth,
//   CreateApp.createNewApp
// );

// router.post(
//   "/initiate-new-version",
//   loginValidationRules(),
//   validate,
//   auth,
//   CreateApp.initiateNewVersion
// );

// router.post(
//   "/update-app",
//   updateAppValidationRules(),
//   validate,
//   auth,
//   CreateApp.submitNewVersion
// );

// router.post(
//   "/submit-newapp",
//   submittAppValidationRules(),
//   validate,
//   auth,
//   CreateApp.submitNewVersion
// );

// router.get(
//   "/get-user-profile",
//   validate,
//   auth,
//   fetchUserController.fetchUserByUid
// );

// router.post(
//   "/password-email-send",
//   sendEmailPasswordChangeRules(),
//   validate,
//   LoginController.sendEmailPasswordChange
// );

// router.post(
//   "/verify-code-password-change",
//   verifyCodePasswordValidationRules(),
//   validate,
//   LoginController.verifyCodeForPasswordChange
// );

// router.post("/password-change", validate, auth, LoginController.passwordChange);

// router.get(
//   "/fetch-active-apps",
//   auth,
//   validate,
//   FetchActiveApps.FetchActiveApps
// );

// router.post(
//   "/upload-app",
//   upload.single("file"),
//   auth,
//   validate,
//   ApkUploadController.uploadApk
// );

// router.get("/fetch-myapps", auth, validate, FetchMyApps.fetchmyApps);

// router.get("/fetch-my-profile", auth, validate, FetchProfile.fetchProfile);

// router.get(
//   "/fetch-apps-inreview",
//   auth,
//   validate,
//   FetchInReviewApps.fetchInReviewApps
// );

// router.post(
//   "/reject-submission-inreview",
//   auth,
//   validate,
//   RejectSubmission.rejectSubmission
// );

// router.post(
//   "/reject-active-app",
//   auth,
//   validate,
//   RejectActiveApp.rejectActiveApp
// );

module.exports = router;
