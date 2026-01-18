import { render, screen } from "@testing-library/react";
import { EngagementMetrics } from "../../../../../components/organisms/EngagementMetrics/EngagementMetrics";
import { vi, Mock } from "vitest";
import { useModel } from "../../../../../components/organisms/EngagementMetrics/useModel";

// Mock the model hook
vi.mock("../../../../../components/organisms/EngagementMetrics/useModel");

describe("EngagementMetrics", () => {
  const mockUseModel = useModel as Mock;

  const defaultMockData = {
    models: {
      activityModel: {
        label: "Daily Activity",
        value: 2.5,
        subLabel: "Avg Comments/Day",
      },
      articlesModel: {
        label: "Top Articles",
        items: [
          { articleId: "1", commentCount: 5, title: "SpaceX Launch" },
          { articleId: "2", commentCount: 3, title: "Mars Rover" },
        ],
      },
      contributorsModel: {
        label: "Top Contributors",
        items: [
          { username: "user1", commentCount: 10 },
          { username: "user2", commentCount: 8 },
        ],
      },
    },
    isLoading: false,
    error: null,
    title: "Community Pulse",
  };

  beforeEach(() => {
    mockUseModel.mockReturnValue(defaultMockData);
  });

  it("renders loading state", () => {
    mockUseModel.mockReturnValue({ ...defaultMockData, isLoading: true });
    render(<EngagementMetrics />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("renders metrics correctly", () => {
    render(<EngagementMetrics />);

    expect(screen.getByText("Community Pulse")).toBeInTheDocument();

    // Check analytics content
    expect(screen.getByText("2.5")).toBeInTheDocument();
    expect(screen.getByText("user1")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText(/SpaceX Launch/)).toBeInTheDocument();
  });

  it("renders nothing when error occurs", () => {
    mockUseModel.mockReturnValue({
      ...defaultMockData,
      error: true,
      models: null,
    });
    const { container } = render(<EngagementMetrics />);
    expect(container).toBeEmptyDOMElement();
  });
});
