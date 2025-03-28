import { body } from "express-validator";

export function validateUsername() {
  return body("username", "Username is invalid.")
    .notEmpty().withMessage("Username is required")
    .escape();
}

export function validatePassword() {
  return [
    body("password", "Password is invalid.")
      .notEmpty().withMessage("Password is required.")
      .escape(),

    body("passwordConfirmation", "Password confirmation is invalid.")
      .custom((value, { req }) => value === req.body.password)
        .withMessage("Password confirmation does not match password")
  ];
}
