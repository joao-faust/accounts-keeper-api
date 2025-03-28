import { Router } from "express";
import {
  validateUsername,
  validatePassword
} from "../middlewares/validators/accounts.js";
import { createAccount, getAccounts } from "../middlewares/controllers/accounts.js";

const router = Router();

router.get("/", getAccounts);

router.post(
  "/create",
  validateUsername(),
  validatePassword(),
  createAccount,
);

export default router;
