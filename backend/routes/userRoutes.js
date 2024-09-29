import express from "express";
import {
  loginUser,
  logoutUser, 
  signupUser,
  followUnFollowUser, 
  updateUser,
  getUserProfile,
  getSuggestedUsers,
  freezeAccount,
  getExploreUsersPage,
} from "../controllers/userController.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.get("/profile/:query", getUserProfile);
router.get("/suggested", protectRoute, getSuggestedUsers);
router.get("/explore", protectRoute, getExploreUsersPage);
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/follow/:id", protectRoute, followUnFollowUser);
router.put("/update/:id", protectRoute, updateUser);
router.put("/freeze", protectRoute, freezeAccount);

export default router;
