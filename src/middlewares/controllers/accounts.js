import { validationResult, matchedData } from "express-validator";
import { decrypt, encrypt } from "../../utils/encryption.js";
import jwt from "jsonwebtoken";
import User from "../../models/User.js";

export async function createAccount(req, res, next) {
  const validationData = validationResult(req);

  if (!validationData.isEmpty()) {
    return res.status(400).send({ errors: validationData.array() });
  }

  const { username, password } = matchedData(req);
  const { encrypted: encryptPassword, iv } = encrypt(password);

  const accessToken = req.headers["authorization"];
  const payload = jwt.decode(accessToken);

  const user = await User.findById(payload.sub);
  user.accounts = [
    ...user.accounts,
    {
      username,
      password: encryptPassword,
      iv
    }
  ];
  await user.save();

  res.status(201).send({ msg: "The account has been created." });
}

export async function getAccounts(req, res, next) {
  const accessToken = req.headers["authorization"];
  const payload = jwt.decode(accessToken);

  const user = await User.findById(payload.sub);

  const accounts = user.accounts.map(account => {
    return {
      username: account.username,
      password: decrypt(account.password, account.iv)
    };
  });

  res.send({ accounts });
}
