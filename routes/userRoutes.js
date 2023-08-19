const express = require("express");
const {
  loginController,
  registerController,
  forgotPassword,
} = require("../controller/userCtrl");
const {
  newPost,
  getAllPost,
  likePost,
  commentPost,
  updateAPost,
  deleteAPost,
  createPost,
  updatePost,
  like,
} = require("../controller/postCtrl");
const auth = require("../middleware/auth");
const authMiddleware = require("../middleware/auth");

//router onject
const router = express.Router();

//routes

//LOGIN || POST
router.post("/login", loginController);

//REGISTER || POST
router.post("/register", registerController);

//FORGOT-PASSWORD
router.post("/forgot-password", forgotPassword);

router.post("/createpost", authMiddleware, createPost);

router.get("/getallpost", authMiddleware, getAllPost);

router.put("/updatepost/:id", authMiddleware, updatePost);

router.delete("/delete/:id", authMiddleware, deleteAPost);

router.put("/likes", authMiddleware, like);

router.put("/comment/:id", authMiddleware, commentPost);

module.exports = router;
