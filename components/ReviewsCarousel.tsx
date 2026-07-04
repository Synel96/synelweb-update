import { useEffect, useState, type FormEvent } from "react";
import { ChevronLeftIcon, ChevronRightIcon, StarIcon, XIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Snackbar } from "@/components/ui/snackbar";
import { createReview, getReviews, type Review } from "@/src/services/reviewsService";

type ToastState = {
  type: "success" | "error";
  message: string;
};

type ReviewsCarouselProps = {
  title: string;
  emptyRatingText: string;
  actionLabel: string;
  actionAriaLabel: string;
};

export function ReviewsCarousel({
  title,
  emptyRatingText,
  actionLabel,
  actionAriaLabel,
}: ReviewsCarouselProps) {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formRating, setFormRating] = useState(0);
  const [formReview, setFormReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchReviews = async () => {
      setIsLoading(true);
      setFetchError(null);

      try {
        const data = await getReviews();
        if (!isMounted) return;
        setReviews(data);
      } catch {
        if (!isMounted) return;
        setFetchError(t("reviewsPage.fetchError"));
      } finally {
        if (!isMounted) return;
        setIsLoading(false);
      }
    };

    void fetchReviews();

    return () => {
      isMounted = false;
    };
  }, [t]);

  const openModal = () => {
    setSubmitError(null);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setSubmitError(null);
    setIsModalOpen(false);
  };

  const setModalRating = (value: number) => {
    setFormRating((current) => (current === value ? 0 : value));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);

    if (formRating < 1) {
      setSubmitError(t("reviewsPage.modal.submitError"));
      setToast({
        type: "error",
        message: t("reviewsPage.modal.submitError"),
      });
      return;
    }

    try {
      setIsSubmitting(true);

      await createReview({
        name: formName,
        email: formEmail,
        rating: formRating,
        review: formReview,
      });

      const updated = await getReviews();
      setReviews(updated);
      closeModal();
      setFormName("");
      setFormEmail("");
      setFormRating(0);
      setFormReview("");
      setToast({
        type: "success",
        message: t("reviewsPage.toast.success"),
      });
    } catch {
      setSubmitError(t("reviewsPage.modal.submitError"));
      setToast({
        type: "error",
        message: t("reviewsPage.toast.error"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderModal = () => {
    if (!isModalOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
        <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-[linear-gradient(155deg,rgba(16,22,42,0.96),rgba(12,18,33,0.98))] p-6 shadow-[0_30px_70px_-36px_rgba(0,0,0,0.75)] sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                {t("reviewsPage.modal.title")}
              </h3>
              <p className="mt-3 text-sm leading-7 text-white/78 sm:text-base">
                {t("reviewsPage.modal.description")}
              </p>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={closeModal}
              aria-label={t("reviewsPage.modal.closeAria")}
              className="rounded-full border border-white/15 bg-white/5 text-white hover:bg-white/12"
            >
              <XIcon className="size-4" />
            </Button>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-xs font-semibold tracking-[0.14em] text-white/72 uppercase">
                {t("reviewsPage.modal.fields.name")}
              </span>
              <input
                type="text"
                required
                value={formName}
                onChange={(event) => setFormName(event.target.value)}
                placeholder={t("reviewsPage.modal.placeholders.name")}
                className="mt-2 w-full rounded-xl border border-white/15 bg-black/25 px-4 py-3 text-sm text-white placeholder:text-white/45 focus:border-(--accent) focus:outline-none"
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold tracking-[0.14em] text-white/72 uppercase">
                {t("reviewsPage.modal.fields.email")}
              </span>
              <input
                type="email"
                required
                value={formEmail}
                onChange={(event) => setFormEmail(event.target.value)}
                placeholder={t("reviewsPage.modal.placeholders.email")}
                className="mt-2 w-full rounded-xl border border-white/15 bg-black/25 px-4 py-3 text-sm text-white placeholder:text-white/45 focus:border-(--accent) focus:outline-none"
              />
            </label>

            <div>
              <span className="text-xs font-semibold tracking-[0.14em] text-white/72 uppercase">
                {t("reviewsPage.modal.fields.rating")}
              </span>
              <div className="mt-2 flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((starValue) => {
                  const isActive = starValue <= formRating;
                  return (
                    <button
                      key={starValue}
                      type="button"
                      onClick={() => setModalRating(starValue)}
                      className="rounded-md p-1.5 text-white/65 transition-colors hover:text-amber-300"
                      aria-label={t("reviewsPage.modal.rateStarAria", { value: starValue })}
                    >
                      <StarIcon
                        className={`size-6 ${isActive ? "fill-amber-400 text-amber-400" : "fill-transparent"}`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            <label className="block">
              <span className="text-xs font-semibold tracking-[0.14em] text-white/72 uppercase">
                {t("reviewsPage.modal.fields.review")}
              </span>
              <textarea
                required
                value={formReview}
                onChange={(event) => setFormReview(event.target.value)}
                placeholder={t("reviewsPage.modal.placeholders.review")}
                rows={5}
                className="mt-2 w-full rounded-xl border border-white/15 bg-black/25 px-4 py-3 text-sm leading-7 text-white placeholder:text-white/45 focus:border-(--accent) focus:outline-none"
              />
            </label>

            {submitError ? <p className="text-sm text-rose-300">{submitError}</p> : null}

            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="ghost"
                onClick={closeModal}
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white hover:bg-white/12"
              >
                {t("reviewsPage.modal.cancel")}
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="btn-cta relative h-12 overflow-hidden rounded-[1.15rem] border border-white/15 px-5 py-3 text-sm font-extrabold tracking-[0.08em] text-[#140814] uppercase shadow-[0_18px_44px_-18px_var(--accent-glow)] ring-1 ring-white/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_54px_-18px_var(--accent-glow)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? t("reviewsPage.modal.submitting") : t("reviewsPage.modal.submit")}
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-[linear-gradient(155deg,rgba(16,22,42,0.9),rgba(12,18,33,0.95))] p-6 sm:p-8">
        <p className="text-sm leading-7 text-white/78">{t("reviewsPage.loading")}</p>
      </div>
    );
  }

  if (fetchError || reviews.length === 0) {
    return (
      <>
        <article className="rounded-3xl border border-white/10 bg-[linear-gradient(155deg,rgba(16,22,42,0.9),rgba(12,18,33,0.95))] p-6 shadow-[0_22px_54px_-32px_var(--accent-glow)] sm:p-8">
          <p className="text-xs font-semibold tracking-[0.16em] text-(--accent) uppercase">{title}</p>

          <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm leading-7 text-white/82 sm:text-base">{emptyRatingText}</p>
            {fetchError ? <p className="mt-3 text-sm leading-7 text-white/60">{fetchError}</p> : null}
          </div>

          <div className="mt-6">
            <Button
              type="button"
              onClick={openModal}
              aria-label={actionAriaLabel}
              className="btn-cta group relative h-12 w-full overflow-hidden rounded-[1.15rem] border border-white/15 px-5 py-3 text-sm font-extrabold tracking-[0.08em] text-[#140814] uppercase shadow-[0_18px_44px_-18px_var(--accent-glow)] ring-1 ring-white/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_54px_-18px_var(--accent-glow)]"
            >
              {actionLabel}
            </Button>
          </div>
        </article>
        {renderModal()}
        <Snackbar
          open={Boolean(toast)}
          message={toast?.message ?? ""}
          type={toast?.type ?? "info"}
          onClose={() => setToast(null)}
          closeAriaLabel={t("reviewsPage.toast.closeAria")}
        />
      </>
    );
  }

  const activeReview = reviews[activeIndex];

  const prev = () =>
    setActiveIndex((prevIndex) => (prevIndex === 0 ? reviews.length - 1 : prevIndex - 1));
  const next = () =>
    setActiveIndex((prevIndex) => (prevIndex === reviews.length - 1 ? 0 : prevIndex + 1));

  return (
    <>
      <article className="rounded-3xl border border-white/10 bg-[linear-gradient(155deg,rgba(16,22,42,0.9),rgba(12,18,33,0.95))] p-6 shadow-[0_22px_54px_-32px_var(--accent-glow)] sm:p-8">
        <p className="text-xs font-semibold tracking-[0.16em] text-(--accent) uppercase">{title}</p>

        <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-5">
          <p className="text-lg font-semibold text-white sm:text-xl">{activeReview.name}</p>
          <p className="mt-3 text-sm leading-7 text-white/82 sm:text-base">{activeReview.review}</p>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            {[1, 2, 3, 4, 5].map((starValue) => {
              const isActive = starValue <= activeReview.rating;
              return (
                <span key={starValue} className="rounded-md p-1.5 text-white/65">
                  <StarIcon
                    className={`size-5 ${isActive ? "fill-amber-400 text-amber-400" : "fill-transparent"}`}
                    aria-hidden="true"
                  />
                </span>
              );
            })}
          </div>

          {activeReview.rating === 0 ? (
            <p className="mt-3 text-sm leading-7 text-white/70">{emptyRatingText}</p>
          ) : null}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={prev}
            className="rounded-full border border-white/20 bg-black/35 text-white hover:bg-black/55"
            aria-label="Previous review"
          >
            <ChevronLeftIcon className="size-4" />
          </Button>

          <div className="flex items-center gap-1.5">
            {reviews.map((review, index) => (
              <button
                key={review.id}
                type="button"
                className={`h-1.5 rounded-full transition-all ${
                  index === activeIndex ? "w-5 bg-(--accent)" : "w-2 bg-white/30 hover:bg-white/55"
                }`}
                onClick={() => setActiveIndex(index)}
                aria-label={`Go to review ${index + 1}`}
              />
            ))}
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={next}
            className="rounded-full border border-white/20 bg-black/35 text-white hover:bg-black/55"
            aria-label="Next review"
          >
            <ChevronRightIcon className="size-4" />
          </Button>
        </div>

        <div className="mt-6">
          <Button
            type="button"
            onClick={openModal}
            aria-label={actionAriaLabel}
            className="btn-cta group relative h-12 w-full overflow-hidden rounded-[1.15rem] border border-white/15 px-5 py-3 text-sm font-extrabold tracking-[0.08em] text-[#140814] uppercase shadow-[0_18px_44px_-18px_var(--accent-glow)] ring-1 ring-white/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_54px_-18px_var(--accent-glow)]"
          >
            {actionLabel}
          </Button>
        </div>
      </article>

      {renderModal()}
      <Snackbar
        open={Boolean(toast)}
        message={toast?.message ?? ""}
        type={toast?.type ?? "info"}
        onClose={() => setToast(null)}
        closeAriaLabel={t("reviewsPage.toast.closeAria")}
      />
    </>
  );
}
