export type ReviewableSession = {
  sessionReview: string | null;
  finalScore: number | null;
};

export function isSessionReviewed(
  session: ReviewableSession
) {
  const hasReview =
    typeof session.sessionReview === "string" &&
    session.sessionReview.trim().length > 0;
  const hasFinalScore =
    typeof session.finalScore === "number" &&
    Number.isInteger(session.finalScore) &&
    session.finalScore >= 1 &&
    session.finalScore <= 10;

  return hasReview && hasFinalScore;
}
