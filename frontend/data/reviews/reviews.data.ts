import { HostReview } from "../../types/review.types";

export const hostReviewsData: HostReview[] = [
  {
    id: "rev-1",
    hostId: "host-1",
    reviewerName: "James M.",
    rating: 5,
    message: "Incredible communication and fast delivery. The MWS arrived perfectly packaged.",
    competitionTitle: "Tokyo Marui MWS GBB Rifle",
    createdAt: "2026-06-25",
    status: "approved",
    canBeFlagged: true,
  },
  {
    id: "rev-2",
    hostId: "host-1",
    reviewerName: "Daniel K.",
    rating: 4,
    message: "Great draw. Took a couple of days to dispatch but otherwise perfect.",
    competitionTitle: "Novritsch SSG10 Sniper",
    createdAt: "2026-06-20",
    status: "approved",
    canBeFlagged: true,
  },
  {
    id: "rev-3",
    hostId: "host-1",
    reviewerName: "Anonymous",
    rating: 1,
    message: "This is a fake review test for flagging.",
    competitionTitle: "VFC HK418 Bundle",
    createdAt: "2026-06-26",
    status: "flagged",
    canBeFlagged: false,
  }
];
