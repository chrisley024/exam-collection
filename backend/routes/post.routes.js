// user auth routes
import express from "express";
import formidable from "express-formidable";

const router = express.Router();

// controllers
import {
  createPost,
  uploadPdf,
  uploads,
  likePost,
  unlikePost,
  addComment,
  removeComment,
} from "../controllers/post.controller";
import { requireSignIn } from "../middlewares/auth";

router.post(`/create-post`, requireSignIn, createPost);
router.post(
  `/upload-pdf`,
  requireSignIn,
  formidable({ maxFileSize: 10 * 1024 * 1024 }),
  uploadPdf
);

router.get(`/uploads/:courseCode`, requireSignIn, uploads);

router.put("/like-post", requireSignIn, likePost);
router.put("/unlike-post", requireSignIn, unlikePost);

router.put("/add-comment", requireSignIn, addComment);
router.put("/remove-comment", requireSignIn, removeComment);

module.exports = router;
