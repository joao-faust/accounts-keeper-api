import { isDev } from "../../utils/runtime-environment.js";

export function handleErrors(error, req, res, next) {
  if (isDev()) {
    console.log(error)
  };
  res.status(500).send({ message: "Internal error." });
}
