import jwt from "jsonwebtoken";
import { isDev } from "../../utils/runtime-environment.js";
import { isJwtInBlacklist } from "../../utils/jwt-blacklist.js";

export async function protect(req, res, next) {
  const accessToken = req.headers['authorization'];

  if (!accessToken) {
    return res.status(401).send({ msg: "Access denied." });
  }

  try {
    const isJwtInvalid = await isJwtInBlacklist(accessToken);

    if (isJwtInvalid) {
      return res.status(401).send({ msg: "The access token is in blacklist." });
    }

    jwt.verify(accessToken, process.env.JWT_SECRET_KEY);

    next();
  }
  catch (error) {
    if (isDev()) {
      console.log(error);
    }
    return res.status(401).send({ msg: "Access denied." });
  }
}
