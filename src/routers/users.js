import { Router } from "express";
import {
  createUser,
  loginUser,
  deleteUser,
  logoutUser
} from "../middlewares/controllers/users.js";
import {
  validateUsername,
  validatePassword
} from "../middlewares/validators/users.js";
import { protect } from "../middlewares/controllers/jwt.js";

const router = Router();

router.post(
  "/create",
  validateUsername(),
  validatePassword(),
  createUser
);

router.post("/login", loginUser);

router.post("/logout", protect, logoutUser);

router.delete("/delete", protect, deleteUser);

export default router;
