import { Router } from "express";
import {
  getUser,
  getBloodInventory,
  createBloodRequest,
  getTotalVolumeByBloodType,
  getTotalDonationCounts,
  getPendingRequest,
  filterDonors,
  filterBloodInventory,
  searchName,
} from "../controller/ReportController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

export const userRouter = new Router();

userRouter.get("/user", verifyToken, getUser);
userRouter.get("/blood-inventory", verifyToken, getBloodInventory);
userRouter.get("/blood", verifyToken, getTotalVolumeByBloodType);
userRouter.get("/donation-count", verifyToken, getTotalDonationCounts);
userRouter.get("/pending-request", verifyToken, getPendingRequest);
userRouter.post("/filter-donors", verifyToken, filterDonors);
userRouter.post("/filter-blood-inventory", verifyToken, filterBloodInventory);
userRouter.get("/search-name", verifyToken, searchName);


export const centerRequestRouter = new Router();
centerRequestRouter.post("/center-request", verifyToken, createBloodRequest);