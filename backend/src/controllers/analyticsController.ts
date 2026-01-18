import { Request, Response } from "express";
import * as analyticsService from "../services/analyticsService";
import { ERROR_MESSAGES } from "../constants/errorMessages";

export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const metrics = await analyticsService.getEngagementMetrics();
    res.json(metrics);
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
  }
};
