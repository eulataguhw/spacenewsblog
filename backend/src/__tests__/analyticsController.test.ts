import { describe, it, expect, vi, beforeEach } from "vitest";
import { Request, Response } from "express";
import * as analyticsController from "../controllers/analyticsController";
import * as analyticsService from "../services/analyticsService";
import { ERROR_MESSAGES } from "../constants/errorMessages";

// Mock analyticsService
vi.mock("../services/analyticsService");

describe("AnalyticsController", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: any;
  let statusMock: any;

  beforeEach(() => {
    vi.clearAllMocks();
    jsonMock = vi.fn();
    statusMock = vi.fn().mockReturnValue({ json: jsonMock });
    mockResponse = {
      status: statusMock,
      json: jsonMock,
    };
  });

  describe("getAnalytics", () => {
    it("should return analytics data with 200 status", async () => {
      const mockMetrics = {
        topArticles: [],
        topCommenters: [],
        averageCommentsPerDay: 5,
      };

      vi.mocked(analyticsService.getEngagementMetrics).mockResolvedValueOnce(
        mockMetrics,
      );

      await analyticsController.getAnalytics(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(analyticsService.getEngagementMetrics).toHaveBeenCalled();
      expect(jsonMock).toHaveBeenCalledWith(mockMetrics);
    });

    it("should handle errors gracefully", async () => {
      vi.mocked(analyticsService.getEngagementMetrics).mockRejectedValueOnce(
        new Error("Database error"),
      );

      await analyticsController.getAnalytics(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      });
    });
  });
});
