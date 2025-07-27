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

userRouter.get("/report/user", verifyToken, getUser);
userRouter.get("/report/blood-inventory", verifyToken, getBloodInventory);
userRouter.post("/center-request", verifyToken, createBloodRequest);
userRouter.get("/report/blood", verifyToken, getTotalVolumeByBloodType);
userRouter.get("/report/donation-count", verifyToken, getTotalDonationCounts);
userRouter.get("/report/pending-request", verifyToken, getPendingRequest);
userRouter.post("/report/filter-donors", verifyToken, filterDonors);
userRouter.post("/report/filter-blood-inventory", verifyToken, filterBloodInventory);
userRouter.get("/report/search-name", verifyToken, searchName);
