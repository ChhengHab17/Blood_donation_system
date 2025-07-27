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

export const userRouter = new Router();

userRouter.get("/report/user", getUser);
userRouter.get("/report/blood-inventory", getBloodInventory);
userRouter.post("/center-request", createBloodRequest);
userRouter.get("/report/blood", getTotalVolumeByBloodType);
userRouter.get("/report/donation-count", getTotalDonationCounts);
userRouter.get("/report/pending-request", getPendingRequest);
userRouter.post("/report/filter-donors", filterDonors);
userRouter.post("/report/filter-blood-inventory", filterBloodInventory);
userRouter.get("/report/search-name", searchName);
userRouter.get("/test", (req, res) => {
  res.json({ message: "API is working!" });
});
