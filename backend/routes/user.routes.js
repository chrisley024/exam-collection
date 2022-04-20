// user auth routes
import express from "express";

const router = express.Router();

// controllers
import { register, login, currentUser } from "../controllers/user.controller";
import { requireSignIn } from "../middlewares/auth";

router.post(`/register`, register);
router.post(`/login`, login);
router.get(`/current-user`, requireSignIn, currentUser);

module.exports = router;
