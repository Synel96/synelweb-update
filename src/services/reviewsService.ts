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
};

const API_BASE_URL = "https://synelweb.fly.dev";
const REVIEWS_ENDPOINT = `${API_BASE_URL}/review/reviews/`;

export async function getReviews(): Promise<Review[]> {
  const response = await fetch(REVIEWS_ENDPOINT);

  if (!response.ok) {
    throw new Error("Failed to fetch reviews.");
  }

  const data = (await response.json()) as ReviewApiItem[];

  return data.map((item) => ({
    id: item.id,
    name: item.name,
    rating: item.rating,
    review: item.review ?? item.comment ?? "",
  }));
}

export async function createReview(input: CreateReviewInput): Promise<void> {
  const response = await fetch(REVIEWS_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: input.name,
      email: input.email,
      rating: input.rating,
      comment: input.review,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create review.");
  }
}
