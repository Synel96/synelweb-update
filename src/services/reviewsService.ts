import type { AppLang } from "./serviceCardsService";

export type Review = {
  id: number;
  name: string;
  rating: number;
  review: string;
};

export type CreateReviewInput = {
  name: string;
  email: string;
  rating: number;
  review: string;
};

type ReviewApiItem = {
  id: number;
  name: string;
  rating: number;
  review?: string;
  comment?: string;
  is_approved?: boolean;
  isApproved?: boolean;
};

const API_BASE_URL = "https://synelweb.fly.dev";
const API_REVIEWS_ENDPOINT = `${API_BASE_URL}/api/reviews/`;

function languageHeaders(lang: AppLang) {
  return {
    "Accept-Language": lang,
  };
}

export async function getReviews(lang: AppLang): Promise<Review[]> {
  const response = await fetch(API_REVIEWS_ENDPOINT, {
    headers: languageHeaders(lang),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch reviews.");
  }

  const data = (await response.json()) as ReviewApiItem[];

  return data
    .filter((item) => item.is_approved === true || item.isApproved === true)
    .map((item) => ({
      id: item.id,
      name: item.name,
      rating: item.rating,
      review: item.review ?? item.comment ?? "",
    }));
}

export async function createReview(input: CreateReviewInput, lang: AppLang): Promise<void> {
  const response = await fetch(API_REVIEWS_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...languageHeaders(lang),
    },
    body: JSON.stringify({
      name: input.name,
      email: input.email,
      rating: input.rating,
      review: input.review,
      comment: input.review,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create review.");
  }
}
