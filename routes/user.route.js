const express = require("express");
const router = express.Router();
const { upload } = require("../middlewares/multer.middleware.js");
const { registerUser,logInUser,logOutUser} = require("../controllers/user.controller.js");
const verifyJwt = require("../middlewares/auth.middleware.js")

router.route("/signUp").post(
  upload.fields(
    [{ name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 }]
  ),
  registerUser
);
 router.route("/logIn").post(logInUser)
// secured routes

 router.route("/logOut").post(  verifyJwt, logOutUser)

module.exports = router;
