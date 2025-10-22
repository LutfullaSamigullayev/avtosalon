const { Router } = require("express");
const {
  register,
  login,
  toAdmin,
  verify,
  logout,
  forgetPassword,
  resetPassword,
  handleRefreshToken,
} = require("../controller/auth.controller");
const {
  getProfile,
  editProfile,
  editPassword,
} = require("../controller/profile.controller");
const authValidatorMiddleware = require("../middleware/auth.validator.middleware");
const profileValidatorMiddleware = require("../middleware/profile.validator.middleware");
const authorizationMiddleware = require("../middleware/authorization.middleware");
const super_adminCheskerMiddleware = require("../middleware/super_admin.chesker.middleware");
const refreshTokenMiddleware = require("../middleware/refresh.token.middleware");
const adminLogger = require("../utils/adminLogger");

const AuthRouter = Router();

// Auth endpoints
AuthRouter.post("/register", authValidatorMiddleware("register"), register);
AuthRouter.post("/verify", verify);
AuthRouter.post("/login", authValidatorMiddleware("login"), login);
AuthRouter.post(
  "/forget_password",
  authValidatorMiddleware("forget"),
  forgetPassword
);
AuthRouter.post(
  "/reset_password",
  authValidatorMiddleware("reset"),
  resetPassword
);
AuthRouter.put(
  "/to_admin",
  authorizationMiddleware,
  super_adminCheskerMiddleware,
  toAdmin
);
AuthRouter.get("/refresh", refreshTokenMiddleware, handleRefreshToken );
AuthRouter.get("/logout", logout);

// Profile endpoints
AuthRouter.get("/profile", authorizationMiddleware, getProfile);
AuthRouter.put(
  "/profile",
  profileValidatorMiddleware("profile"),
  authorizationMiddleware,
  adminLogger,
  editProfile
);
AuthRouter.put(
  "/profile/password",
  profileValidatorMiddleware("password"),
  authorizationMiddleware,
  adminLogger,
  editPassword
);

module.exports = AuthRouter;
