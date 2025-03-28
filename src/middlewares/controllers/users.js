import { validationResult, matchedData } from "express-validator";
import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../models/User.js";
import { addJwtToBlacklist } from "../../utils/jwt-blacklist.js";

export async function createUser(req, res, next) {
  const validationData = validationResult(req);

  if (!validationData.isEmpty()) {
    return res.status(400).send({ errors: validationData.array() });
  }

  const { username, password } = matchedData(req);
  const hashedPassword = await hash(password, 10);

  const user = new User({
    username,
    password: hashedPassword
  });
  const createdUser = await user.save();

  res.status(201).send({ msg: "The uer has been created."});
}

export async function loginUser(req, res, next) {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) {
    return res.status(400).send({ msg: "The credentials are invalid." });
  }

  const hashedPassword = user.password;
  const isPasswordValid = await compare(password, hashedPassword);

  if (!isPasswordValid) {
    return res.status(400).send({ msg: "The credentials are invalid." });
  }

  const accessToken = jwt.sign(
    { sub: user._id, name: user.username },
    process.env.JWT_SECRET_KEY,
    { expiresIn: parseInt(process.env.JWT_EXPIRES_IN) }
  );

  res.send({ accessToken });
}

export async function logoutUser(req, res, next) {
  const accessToken = req.headers["authorization"];

  await addJwtToBlacklist(accessToken);

  res.send({ msg: "The user has been logged out." })
}

export async function deleteUser(req, res, next) {
  const accessToken = req.headers["authorization"];
  const payload = jwt.decode(accessToken);

  await User.deleteOne({ _id: payload.sub });

  await addJwtToBlacklist(accessToken);

  res.send({ msg: "The user has been deleted." });
}
