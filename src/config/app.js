import "express-async-errors";
import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import usersRouter from "../routers/users.js";
import accountsRouter from "../routers/accounts.js";
import { handleErrors } from "../middlewares/controllers/errors.js";
import { protect } from "../middlewares/controllers/jwt.js";

const app = express();

app.use(express.json());

app.use(morgan('combined'));

app.use(helmet());
app.use(cors());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again later"
}));

app.use("/users", usersRouter);
app.use("/accounts", protect, accountsRouter);

app.use(handleErrors);

export default app;
