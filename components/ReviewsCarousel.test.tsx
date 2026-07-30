import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithI18n } from "../test/render";

const { getReviews, createReview } = vi.hoisted(() => ({
  getReviews: vi.fn(),
  createReview: vi.fn(),
}));
vi.mock("@/src/services/reviewsService", () => ({ getReviews, createReview }));

import { ReviewsCarousel } from "./ReviewsCarousel";

const baseProps = {
  title: "Reviews",
  emptyRatingText: "No reviews yet.",
  actionLabel: "Leave a review",
  actionAriaLabel: "Leave a review",
};

const sampleReviews = [
  { id: 1, name: "Anna", rating: 5, review: "Great work!" },
  { id: 2, name: "Bence", rating: 4, review: "Very solid." },
];

afterEach(() => {
  vi.clearAllMocks();
});

async function openModal(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: "Leave a review" }));
}

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("Name"), "Test User");
  await user.type(screen.getByLabelText("Email"), "test@example.com");
  await user.click(screen.getByRole("button", { name: "Rate 5 star" }));
  await user.type(screen.getByLabelText("Review"), "Amazing!");
  await user.click(screen.getByRole("checkbox"));
}

describe("ReviewsCarousel", () => {
  it("shows a loading state before the initial fetch resolves", async () => {
    let resolveFetch: (value: typeof sampleReviews) => void = () => {};
    getReviews.mockReturnValue(new Promise((resolve) => (resolveFetch = resolve)));

    await renderWithI18n(<ReviewsCarousel {...baseProps} />, "en");
    expect(screen.getByText("Loading reviews...")).toBeInTheDocument();

    resolveFetch(sampleReviews);
    await waitFor(() => expect(screen.getByText("Anna")).toBeInTheDocument());
  });

  it("renders approved reviews once loaded", async () => {
    getReviews.mockResolvedValue(sampleReviews);
    await renderWithI18n(<ReviewsCarousel {...baseProps} />, "en");

    expect(await screen.findByText("Anna")).toBeInTheDocument();
    expect(screen.getByText("Bence")).toBeInTheDocument();
  });

  it("shows the empty state and CTA when there are no reviews", async () => {
    getReviews.mockResolvedValue([]);
    await renderWithI18n(<ReviewsCarousel {...baseProps} />, "en");

    expect(await screen.findByText("No reviews yet.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Leave a review" })).toBeInTheDocument();
  });

  it("shows a fetch error message alongside the empty state when loading fails", async () => {
    getReviews.mockRejectedValue(new Error("network down"));
    await renderWithI18n(<ReviewsCarousel {...baseProps} />, "en");

    expect(
      await screen.findByText("Could not load reviews right now. Please try again later.")
    ).toBeInTheDocument();
  });

  it("opens the review modal from the CTA button", async () => {
    getReviews.mockResolvedValue([]);
    await renderWithI18n(<ReviewsCarousel {...baseProps} />, "en");
    await screen.findByText("No reviews yet.");
    const user = userEvent.setup();

    await openModal(user);
    expect(screen.getByRole("heading", { name: "Write your review" })).toBeInTheDocument();
  });

  it("closes the modal via the X button", async () => {
    getReviews.mockResolvedValue([]);
    await renderWithI18n(<ReviewsCarousel {...baseProps} />, "en");
    await screen.findByText("No reviews yet.");
    const user = userEvent.setup();

    await openModal(user);
    await user.click(screen.getByRole("button", { name: "Close modal" }));
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });

  it("closes the modal via the Cancel button", async () => {
    getReviews.mockResolvedValue([]);
    await renderWithI18n(<ReviewsCarousel {...baseProps} />, "en");
    await screen.findByText("No reviews yet.");
    const user = userEvent.setup();

    await openModal(user);
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });

  it("disables the submit button until the consent checkbox is checked", async () => {
    getReviews.mockResolvedValue([]);
    await renderWithI18n(<ReviewsCarousel {...baseProps} />, "en");
    await screen.findByText("No reviews yet.");
    const user = userEvent.setup();
    await openModal(user);

    const submitButton = screen.getByRole("button", { name: "Submit review" });
    expect(submitButton).toBeDisabled();

    await user.click(screen.getByRole("checkbox"));
    expect(submitButton).toBeEnabled();
  });

  it("shows a validation error and does not submit when no rating is selected", async () => {
    getReviews.mockResolvedValue([]);
    await renderWithI18n(<ReviewsCarousel {...baseProps} />, "en");
    await screen.findByText("No reviews yet.");
    const user = userEvent.setup();
    await openModal(user);

    await user.click(screen.getByRole("checkbox"));
    const form = screen.getByRole("checkbox").closest("form") as HTMLFormElement;
    fireEvent.submit(form);

    expect(createReview).not.toHaveBeenCalled();
    await waitFor(() => expect(screen.getByRole("status")).toBeInTheDocument());
    expect(
      screen.getAllByText("Could not submit your review right now. Please try again.").length
    ).toBeGreaterThan(0);
  });

  it("blocks submission via the consent guard when the form is submitted without consent (bypassing the disabled button)", async () => {
    getReviews.mockResolvedValue([]);
    await renderWithI18n(<ReviewsCarousel {...baseProps} />, "en");
    await screen.findByText("No reviews yet.");
    const user = userEvent.setup();
    await openModal(user);

    await user.click(screen.getByRole("button", { name: "Rate 5 star" }));
    const form = screen.getByRole("checkbox").closest("form") as HTMLFormElement;
    fireEvent.submit(form);

    expect(createReview).not.toHaveBeenCalled();
    await waitFor(() =>
      expect(
        screen.getAllByText("Please accept the Privacy Notice to submit your review.").length
      ).toBeGreaterThan(0)
    );
  });

  it("toggles a star rating off when the same star is clicked twice", async () => {
    getReviews.mockResolvedValue([]);
    await renderWithI18n(<ReviewsCarousel {...baseProps} />, "en");
    await screen.findByText("No reviews yet.");
    const user = userEvent.setup();
    await openModal(user);

    const fifthStar = screen.getByRole("button", { name: "Rate 5 star" });
    await user.click(fifthStar);
    await user.click(fifthStar);
    await user.click(screen.getByRole("checkbox"));

    const form = screen.getByRole("checkbox").closest("form") as HTMLFormElement;
    fireEvent.submit(form);

    // Rating was toggled back to 0, so the rating-required validation should fire.
    await waitFor(() => expect(createReview).not.toHaveBeenCalled());
    expect(
      screen.getAllByText("Could not submit your review right now. Please try again.").length
    ).toBeGreaterThan(0);
  });

  it("submits a valid review, refetches, resets the form, and shows a success toast", async () => {
    getReviews.mockResolvedValueOnce([]).mockResolvedValueOnce(sampleReviews);
    createReview.mockResolvedValue(undefined);
    await renderWithI18n(<ReviewsCarousel {...baseProps} />, "en");
    await screen.findByText("No reviews yet.");
    const user = userEvent.setup();
    await openModal(user);
    await fillValidForm(user);

    await user.click(screen.getByRole("button", { name: "Submit review" }));

    await waitFor(() =>
      expect(createReview).toHaveBeenCalledWith(
        {
          name: "Test User",
          email: "test@example.com",
          rating: 5,
          review: "Amazing!",
        },
        "en"
      )
    );
    await waitFor(() => expect(screen.getByText("Anna")).toBeInTheDocument());
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
    expect(
      screen.getByText("We received your review and it is waiting for approval!")
    ).toBeInTheDocument();
  });

  it("shows an error toast and keeps the modal open when submission fails", async () => {
    getReviews.mockResolvedValue([]);
    createReview.mockRejectedValue(new Error("boom"));
    await renderWithI18n(<ReviewsCarousel {...baseProps} />, "en");
    await screen.findByText("No reviews yet.");
    const user = userEvent.setup();
    await openModal(user);
    await fillValidForm(user);

    await user.click(screen.getByRole("button", { name: "Submit review" }));

    await waitFor(() => expect(screen.getByRole("status")).toBeInTheDocument());
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("navigates between reviews using the prev/next/dot controls without throwing", async () => {
    getReviews.mockResolvedValue(sampleReviews);
    await renderWithI18n(<ReviewsCarousel {...baseProps} />, "en");
    await screen.findByText("Anna");

    // Actual scroll-position math is covered by the useSnapCarousel unit tests;
    // this just confirms the controls are wired up and don't throw when clicked.
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Next review" }));
    await user.click(screen.getByRole("button", { name: "Previous review" }));
    await user.click(screen.getByRole("button", { name: "Go to review 2" }));
  });
});
