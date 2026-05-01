"use client";

import { useState, useEffect, useReducer } from "react";
import { Star, ThumbsUp, MessageSquare, ChevronDown } from "lucide-react";
import { useAuth, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FadeIn, StaggerContainer, StaggerItem } from "@/lib/motion";
import type { Review, ReviewStats } from "@/types";

interface ProductReviewsProps {
  productId: string;
}

interface ReviewsState {
  reviews: Review[];
  stats: ReviewStats | null;
  loading: boolean;
  page: number;
  hasMore: boolean;
}

type ReviewsAction =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; reviews: Review[]; stats: ReviewStats; hasMore: boolean }
  | { type: "LOAD_MORE"; reviews: Review[]; hasMore: boolean }
  | { type: "ADD_REVIEW"; review: Review }
  | { type: "FETCH_ERROR" };

function reviewsReducer(state: ReviewsState, action: ReviewsAction): ReviewsState {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, reviews: action.reviews, stats: action.stats, loading: false, hasMore: action.hasMore, page: 1 };
    case "LOAD_MORE":
      return { ...state, reviews: [...state.reviews, ...action.reviews], hasMore: action.hasMore, loading: false, page: state.page + 1 };
    case "ADD_REVIEW":
      return { ...state, reviews: [action.review, ...state.reviews], stats: state.stats ? { ...state.stats, total_reviews: state.stats.total_reviews + 1 } : null };
    case "FETCH_ERROR":
      return { ...state, loading: false };
    default:
      return state;
  }
}

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" | "lg" }) {
  const sizeClass = size === "lg" ? "h-6 w-6" : size === "md" ? "h-4 w-4" : "h-3.5 w-3.5";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClass} ${
            star <= rating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"
          }`}
        />
      ))}
    </div>
  );
}

function InteractiveStarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="transition-transform hover:scale-110"
        >
          <Star
            className={`h-7 w-7 ${
              star <= (hover || value) ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"
            } transition-colors`}
          />
        </button>
      ))}
    </div>
  );
}

function RatingBar({ rating, count, total }: { rating: number; count: number; total: number }) {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-3 text-right text-muted-foreground">{rating}</span>
      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-400 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="w-8 text-right text-muted-foreground text-xs">{count}</span>
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const date = new Date(review.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="py-6 border-b last:border-b-0">
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm">{review.author_name}</span>
            {review.is_verified_purchase && (
              <span className="inline-flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                <ThumbsUp className="h-3 w-3" />
                Verified
              </span>
            )}
          </div>
          <StarRating rating={review.rating} />
        </div>
        <span className="text-xs text-muted-foreground">{date}</span>
      </div>
      {review.title && (
        <h4 className="font-medium text-sm mt-2">{review.title}</h4>
      )}
      {review.content && (
        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{review.content}</p>
      )}
    </div>
  );
}

function ReviewForm({ productId, onReviewAdded }: { productId: string; onReviewAdded: (review: Review) => void }) {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isSignedIn) {
    return (
      <div className="glass-panel rounded-xl p-6 text-center">
        <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm text-muted-foreground mb-3">Sign in to write a review</p>
        <Button variant="outline" size="sm" asChild>
          <a href="/sign-in">Sign In</a>
        </Button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          title: title || undefined,
          content: content || undefined,
          authorName: user?.fullName || user?.firstName || "Anonymous",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to submit review");
        return;
      }

      setSuccess(true);
      onReviewAdded(data.data);
      setRating(0);
      setTitle("");
      setContent("");
    } catch {
      setError("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="glass-panel rounded-xl p-6 text-center">
        <p className="text-sm text-emerald-600 font-medium mb-2">Review submitted!</p>
        <p className="text-xs text-muted-foreground">Thank you for your feedback.</p>
        <Button variant="ghost" size="sm" className="mt-3" onClick={() => setSuccess(false)}>
          Write another review
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-panel rounded-xl p-6 space-y-4">
      <h3 className="font-heading text-lg font-medium">Write a Review</h3>

      <div>
        <Label className="text-sm mb-2 block">Rating *</Label>
        <InteractiveStarRating value={rating} onChange={setRating} />
      </div>

      <div>
        <Label htmlFor="review-title" className="text-sm">Title</Label>
        <Input
          id="review-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Summarize your experience"
          maxLength={255}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="review-content" className="text-sm">Review</Label>
        <Textarea
          id="review-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your thoughts about this product..."
          maxLength={2000}
          rows={4}
          className="mt-1"
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" disabled={submitting || rating === 0} className="accent-gradient text-white">
        {submitting ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const [state, dispatch] = useReducer(reviewsReducer, {
    reviews: [],
    stats: null,
    loading: true,
    page: 1,
    hasMore: false,
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchReviews(1);
  }, [productId]);

  const fetchReviews = async (page: number) => {
    dispatch({ type: "FETCH_START" });
    try {
      const res = await fetch(`/api/products/${productId}/reviews?page=${page}&limit=10`);
      const data = await res.json();
      if (res.ok) {
        if (page === 1) {
          dispatch({ type: "FETCH_SUCCESS", reviews: data.data.reviews, stats: data.data.stats, hasMore: data.data.has_more });
        } else {
          dispatch({ type: "LOAD_MORE", reviews: data.data.reviews, hasMore: data.data.has_more });
        }
      } else {
        dispatch({ type: "FETCH_ERROR" });
      }
    } catch {
      dispatch({ type: "FETCH_ERROR" });
    }
  };

  const handleReviewAdded = (review: Review) => {
    dispatch({ type: "ADD_REVIEW", review });
  };

  const { reviews, stats, loading, hasMore } = state;

  if (loading && reviews.length === 0) {
    return (
      <div className="pt-12 border-t">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 skeleton-shimmer rounded-lg" />
          <div className="h-24 skeleton-shimmer rounded-xl" />
          <div className="h-32 skeleton-shimmer rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="pt-12 border-t">
      <FadeIn>
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-heading text-2xl sm:text-3xl font-light tracking-wide">
            Reviews
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowForm(!showForm)}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Write a Review
          </Button>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Rating Summary */}
        <div className="lg:col-span-1">
          {stats && (
            <FadeIn>
              <div className="glass-panel rounded-xl p-6 space-y-4 sticky top-24">
                <div className="text-center">
                  <div className="text-4xl font-light mb-1">
                    {stats.average_rating.toFixed(1)}
                  </div>
                  <StarRating rating={Math.round(stats.average_rating)} size="md" />
                  <p className="text-sm text-muted-foreground mt-1">
                    Based on {stats.total_reviews} {stats.total_reviews === 1 ? "review" : "reviews"}
                  </p>
                </div>

                <div className="space-y-1.5">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <RatingBar
                      key={rating}
                      rating={rating}
                      count={stats.rating_distribution[rating] || 0}
                      total={stats.total_reviews}
                    />
                  ))}
                </div>
              </div>
            </FadeIn>
          )}
        </div>

        {/* Reviews List + Form */}
        <div className="lg:col-span-2 space-y-6">
          {showForm && (
            <FadeIn>
              <ReviewForm productId={productId} onReviewAdded={handleReviewAdded} />
            </FadeIn>
          )}

          {reviews.length === 0 ? (
            <div className="text-center py-12 glass-panel rounded-xl">
              <MessageSquare className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
            </div>
          ) : (
            <StaggerContainer>
              {reviews.map((review) => (
                <StaggerItem key={review.id}>
                  <ReviewCard review={review} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}

          {hasMore && (
            <div className="text-center pt-4">
              <Button
                variant="outline"
                onClick={() => fetchReviews(state.page + 1)}
                disabled={loading}
              >
                <ChevronDown className="h-4 w-4 mr-2" />
                Load More Reviews
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
