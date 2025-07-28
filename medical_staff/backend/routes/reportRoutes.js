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

export const reportRouter = new Router();

reportRouter.get("/user", getUser);
reportRouter.get("/blood-inventory", getBloodInventory);
reportRouter.get("/blood", getTotalVolumeByBloodType);
reportRouter.get("/donation-count", getTotalDonationCounts);
reportRouter.get("/pending-request", getPendingRequest);
reportRouter.post("/filter-donors", filterDonors);
reportRouter.post("/filter-blood-inventory", filterBloodInventory);
reportRouter.get("/search-name", searchName);


export const centerRequestRouter = new Router();
centerRequestRouter.post("/center-request", createBloodRequest);