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
  editProfile,
} = require("../controller/auth.controller");
const authValidatorMiddleware = require("../middleware/auth.validator.middleware");
const authorizationMiddleware = require("../middleware/authorization.middleware");
const super_adminCheskerMiddleware = require("../middleware/super_admin.chesker.middleware");
const refreshTokenMiddleware = require("../middleware/refresh.token.middleware");

const router = Router();

// Auth endpoints
router.post("/auth/register", authValidatorMiddleware("register"), register);
router.post("/auth/verify", verify);
router.post("/auth/login", authValidatorMiddleware("login"), login);
router.post(
  "/auth/forget_password",
  authValidatorMiddleware("forget"),
  forgetPassword
);
router.post(
  "/auth/reset_password",
  authValidatorMiddleware("reset"),
  resetPassword
);
router.put(
  "/auth/to_admin",
  authorizationMiddleware,
  super_adminCheskerMiddleware,
  toAdmin
);
router.get("/auth/refresh", refreshTokenMiddleware, handleRefreshToken );
router.get("/auth/logout", logout);
router.put(
  "/auth/edit_profile",
  authorizationMiddleware,
  authValidatorMiddleware("editProfile"),
  editProfile
);

module.exports = router;
