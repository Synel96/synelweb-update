import { afterEach, describe, expect, it, vi } from "vitest";
import { createReview, getReviews } from "./reviewsService";

function mockFetchOnce(status: number, body: unknown, contentType = "application/json") {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: status >= 200 && status < 300,
      status,
      headers: { get: () => contentType },
      json: async () => body,
      text: async () => (typeof body === "string" ? body : JSON.stringify(body)),
    })
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("getReviews", () => {
  it("only returns approved reviews (either casing of the flag)", async () => {
    mockFetchOnce(200, [
      { id: 1, name: "A", rating: 5, review: "great", is_approved: true },
      { id: 2, name: "B", rating: 4, review: "ok", isApproved: true },
      { id: 3, name: "C", rating: 1, review: "nope", is_approved: false },
    ]);

    const reviews = await getReviews("hu");
    expect(reviews.map((r) => r.id)).toEqual([1, 2]);
  });

  it("falls back from review to comment when review is missing", async () => {
    mockFetchOnce(200, [
      { id: 1, name: "A", rating: 5, comment: "from comment", is_approved: true },
    ]);
    const [review] = await getReviews("hu");
    expect(review.review).toBe("from comment");
  });

  it("throws when the response is not ok", async () => {
    mockFetchOnce(500, []);
    await expect(getReviews("hu")).rejects.toThrow("Failed to fetch reviews.");
  });
});

describe("createReview", () => {
  it("posts the review payload with the language header", async () => {
    mockFetchOnce(201, {});
    await createReview({ name: "A", email: "a@a.com", rating: 5, review: "great" }, "en");

    const fetchMock = fetch as unknown as ReturnType<typeof vi.fn>;
    const [, options] = fetchMock.mock.calls[0];
    expect(options.method).toBe("POST");
    expect(options.headers["Accept-Language"]).toBe("en");
    expect(JSON.parse(options.body)).toEqual({
      name: "A",
      email: "a@a.com",
      rating: 5,
      review: "great",
      comment: "great",
    });
  });

  it("resolves without throwing on success", async () => {
    mockFetchOnce(201, {});
    await expect(
      createReview({ name: "A", email: "a@a.com", rating: 5, review: "great" }, "en")
    ).resolves.toBeUndefined();
  });

  it("surfaces the `detail` field from a JSON error response", async () => {
    mockFetchOnce(400, { detail: "Bad request." });
    await expect(
      createReview({ name: "", email: "", rating: 0, review: "" }, "en")
    ).rejects.toThrow("Bad request.");
  });

  it("surfaces the first string value from a JSON error response without `detail`", async () => {
    mockFetchOnce(400, { email: ["Enter a valid email address."] });
    await expect(
      createReview({ name: "A", email: "bad", rating: 5, review: "x" }, "en")
    ).rejects.toThrow("Enter a valid email address.");
  });

  it("falls back to the raw response text for a non-JSON error", async () => {
    mockFetchOnce(500, "Internal Server Error", "text/plain");
    await expect(
      createReview({ name: "A", email: "a@a.com", rating: 5, review: "x" }, "en")
    ).rejects.toThrow("Internal Server Error");
  });

  it("falls back to a generic message when the error body is empty", async () => {
    mockFetchOnce(500, "", "text/plain");
    await expect(
      createReview({ name: "A", email: "a@a.com", rating: 5, review: "x" }, "en")
    ).rejects.toThrow("Failed to create review.");
  });
});
