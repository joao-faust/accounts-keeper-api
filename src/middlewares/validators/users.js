import { body } from "express-validator";
import PasswordValidator from "password-validator";
import { isDev } from "../../utils/runtime-environment.js";
import User from "../../models/User.js";

export function validatePassword() {
  const passwordSchema = new PasswordValidator();
  let invalidPasswordMsg;

  if (isDev()) {
    invalidPasswordMsg = "Password must be at least 3 characters long";
    passwordSchema.is().min(3);
  }
  else {
    invalidPasswordMsg = "Password must be at least 12 characters long,";
    invalidPasswordMsg += "contain uppercase and lowercase letters,";
    invalidPasswordMsg += "include digits, and have at least one symbol.";
    passwordSchema
      .is().min(12)
      .has().uppercase()
      .has().lowercase()
      .has().digits()
      .has().symbols();
  }

  return [
    body("password", "Password is invalid.")
      .notEmpty().withMessage("Password is required.")
      .custom(value => passwordSchema.validate(value))
        .withMessage(invalidPasswordMsg)
      .escape(),

    body("passwordConfirmation", "Password confirmation is invalid.")
      .notEmpty().withMessage("Password confirmation is required.")
      .custom((value, { req }) => value === req.body.password)
        .withMessage("Password confirmation does not match password")
      .escape()
  ];
}

export function validateUsername() {
  return body("username", " username is invalid.")
    .notEmpty().withMessage(" username is required.")
    .isLength({ min: 5, max: 50 })
      .withMessage("The length must be between 5 and 50 characters.")
    .custom(async value => {
      const existingUser = await User.findOne({ username: value });
      if (existingUser) {
        throw new Error(" username is already taken.");
      }
      return true;
    })
    .escape();
}
