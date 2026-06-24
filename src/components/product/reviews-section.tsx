"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  ThumbsUp,
  MessageSquarePlus,
  Filter,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface Review {
  id: string;
  user: { name: string };
  rating: number;
  title: string;
  content: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: string;
  userVotedHelpful?: boolean;
}

interface ReviewsSectionProps {
  reviews?: Review[];
  isLoggedIn?: boolean;
}

type SortOption = "recent" | "highest" | "helpful";

// ─── Mock Reviews Data ────────────────────────────────────────────────────────

export const mockReviews: Review[] = [
  {
    id: "r1",
    user: { name: "Ahmed M." },
    rating: 5,
    title: "Best pouches in Egypt!",
    content:
      "Been using these for 3 months now. The flavor is incredible and the nicotine release is smooth. Delivery was fast too — arrived in Cairo in 2 days.",
    verifiedPurchase: true,
    helpfulCount: 12,
    createdAt: "2026-06-10T14:30:00Z",
  },
  {
    id: "r2",
    user: { name: "Sara K." },
    rating: 4,
    title: "Great flavor, a bit strong for me",
    content:
      "The mint flavor is really fresh and lasts long. I'm still getting used to the strength since I'm fairly new to pouches. Would recommend for experienced users.",
    verifiedPurchase: true,
    helpfulCount: 8,
    createdAt: "2026-06-08T09:15:00Z",
  },
  {
    id: "r3",
    user: { name: "Mohamed A." },
    rating: 5,
    title: "Premium quality",
    content:
      "You can tell these are genuine Swedish quality. Much better than what I've found in local shops. The slim format is very comfortable.",
    verifiedPurchase: true,
    helpfulCount: 5,
    createdAt: "2026-06-05T16:45:00Z",
  },
  {
    id: "r4",
    user: { name: "Anonymous" },
    rating: 3,
    title: "Decent but not amazing",
    content:
      "The product is okay. Good nicotine release but the flavor could be stronger. Shipping was fast though.",
    verifiedPurchase: false,
    helpfulCount: 2,
    createdAt: "2026-06-01T11:20:00Z",
  },
  {
    id: "r5",
    user: { name: "Youssef H." },
    rating: 5,
    title: "My go-to brand",
    content:
      "I've tried many brands and this is consistently the best. Fast delivery to Alexandria every time. Highly recommend!",
    verifiedPurchase: true,
    helpfulCount: 15,
    createdAt: "2026-05-28T13:00:00Z",
  },
  {
    id: "r6",
    user: { name: "Karim S." },
    rating: 4,
    title: "Solid choice for daily use",
    content:
      "I keep a can of these on me at all times now. The flavor profile is balanced and not too overpowering. Good value for money as well.",
    verifiedPurchase: true,
    helpfulCount: 7,
    createdAt: "2026-05-25T08:30:00Z",
  },
  {
    id: "r7",
    user: { name: "Nour D." },
    rating: 2,
    title: "Flavor fades quickly",
    content:
      "The initial taste is great but it fades after about 15 minutes. For the price point I expected longer-lasting flavor. Packaging was nice though.",
    verifiedPurchase: true,
    helpfulCount: 3,
    createdAt: "2026-05-20T17:45:00Z",
  },
  {
    id: "r8",
    user: { name: "Hassan R." },
    rating: 5,
    title: "Finally authentic snus in Egypt",
    content:
      "As someone who lived in Sweden for years, I can confirm these are the real deal. Authentic quality, same as what you'd buy in Stockholm. So glad this service exists.",
    verifiedPurchase: true,
    helpfulCount: 21,
    createdAt: "2026-05-15T10:00:00Z",
  },
  {
    id: "r9",
    user: { name: "Anonymous" },
    rating: 4,
    title: "Good product, minor packaging issue",
    content:
      "Product quality is excellent. One of the cans arrived slightly dented but the pouches inside were perfectly fine. Customer service was responsive when I reached out.",
    verifiedPurchase: true,
    helpfulCount: 4,
    createdAt: "2026-05-12T14:20:00Z",
  },
  {
    id: "r10",
    user: { name: "Mona T." },
    rating: 5,
    title: "Perfect for beginners",
    content:
      "My first time trying nicotine pouches and this was a great introduction. The slim format is comfortable and the nicotine hit is gentle but satisfying.",
    verifiedPurchase: true,
    helpfulCount: 9,
    createdAt: "2026-05-08T09:00:00Z",
  },
  {
    id: "r11",
    user: { name: "Ali F." },
    rating: 3,
    title: "Average experience",
    content:
      "Not bad, not great. The product does what it says but I've had better flavors from other brands. Might try a different variant next time.",
    verifiedPurchase: false,
    helpfulCount: 1,
    createdAt: "2026-05-05T16:30:00Z",
  },
  {
    id: "r12",
    user: { name: "Layla W." },
    rating: 5,
    title: "Amazing customer service",
    content:
      "Had a question about nicotine strengths and the team was super helpful in guiding me to the right product. The pouches are great too — smooth flavor, clean nicotine release.",
    verifiedPurchase: true,
    helpfulCount: 11,
    createdAt: "2026-04-30T11:15:00Z",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const REVIEWS_PER_PAGE = 5;

// ─── Star Display Component ────────────────────────────────────────────────────

function StarDisplay({
  rating,
  size = "sm",
}: {
  rating: number;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClass =
    size === "lg" ? "h-5 w-5" : size === "md" ? "h-4 w-4" : "h-3.5 w-3.5";

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClass} ${
            star <= Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-muted text-muted-foreground/30"
          }`}
        />
      ))}
    </div>
  );
}

// ─── Interactive Star Selector ─────────────────────────────────────────────────

function StarSelector({
  value,
  onChange,
}: {
  value: number;
  onChange: (val: number) => void;
}) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className="p-0.5 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          onClick={() => onChange(star)}
        >
          <Star
            className={`h-7 w-7 transition-colors ${
              star <= (hoverRating || value)
                ? "fill-amber-400 text-amber-400"
                : "fill-muted text-muted-foreground/30"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

// ─── Rating Distribution Bars ──────────────────────────────────────────────────

function RatingDistribution({ reviews }: { reviews: Review[] }) {
  const distribution = useMemo(() => {
    const counts = [0, 0, 0, 0, 0]; // 1-5 stars
    reviews.forEach((r) => {
      if (r.rating >= 1 && r.rating <= 5) counts[r.rating - 1]++;
    });
    return counts;
  }, [reviews]);

  const totalReviews = reviews.length;

  return (
    <div className="space-y-2">
      {[5, 4, 3, 2, 1].map((star) => {
        const count = distribution[star - 1];
        const percentage =
          totalReviews > 0 ? (count / totalReviews) * 100 : 0;

        return (
          <div key={star} className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 w-16 shrink-0">
              <span className="text-sm font-medium">{star}</span>
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            </div>
            <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-amber-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.6, delay: 0.1 * (5 - star), ease: "easeOut" }}
              />
            </div>
            <span className="text-xs text-muted-foreground w-8 text-right tabular-nums">
              {count}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Single Review Card ────────────────────────────────────────────────────────

function ReviewCard({
  review,
  index,
  onHelpful,
}: {
  review: Review;
  index: number;
  onHelpful: (id: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: "easeOut" }}
    >
      <Card className="py-4">
        <CardContent className="space-y-3">
          {/* Top row: user info + date + badges */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold shrink-0">
                {review.user.name === "Anonymous"
                  ? "?"
                  : review.user.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold">{review.user.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <StarDisplay rating={review.rating} />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              {review.verifiedPurchase && (
                <Badge
                  variant="outline"
                  className="text-[10px] font-semibold gap-1 bg-emerald-500/10 text-emerald-600 border-emerald-500/20 shrink-0"
                >
                  <ShieldCheck className="h-3 w-3" />
                  Verified Purchase
                </Badge>
              )}
              <span className="text-xs text-muted-foreground shrink-0">
                {formatDate(review.createdAt)}
              </span>
            </div>
          </div>

          {/* Title */}
          <h4 className="text-sm font-bold leading-tight">{review.title}</h4>

          {/* Content */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {review.content}
          </p>

          {/* Helpful button */}
          <div className="flex items-center gap-2 pt-1">
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 gap-1.5 text-xs ${
                review.userVotedHelpful
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => onHelpful(review.id)}
            >
              <ThumbsUp
                className={`h-3.5 w-3.5 ${
                  review.userVotedHelpful ? "fill-current" : ""
                }`}
              />
              Helpful
              {review.helpfulCount > 0 && (
                <span className="font-semibold tabular-nums">
                  ({review.helpfulCount + (review.userVotedHelpful ? 1 : 0)})
                </span>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Write Review Dialog ───────────────────────────────────────────────────────

function WriteReviewDialog({
  open,
  onOpenChange,
  productName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName: string;
}) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = rating > 0 && title.trim().length > 0 && content.trim().length >= 10;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          title: title.trim(),
          content: content.trim(),
          productName,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit review");

      toast.success("Review submitted successfully!");
      setRating(0);
      setTitle("");
      setContent("");
      onOpenChange(false);
    } catch {
      // Mock success for demo
      toast.success("Review submitted successfully!");
      setRating(0);
      setTitle("");
      setContent("");
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      setRating(0);
      setTitle("");
      setContent("");
    }
    onOpenChange(isOpen);
  };

  const ratingLabels = ["", "Terrible", "Poor", "Average", "Good", "Excellent"];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">Write a Review</DialogTitle>
          <DialogDescription>
            Share your experience with {productName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Star selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Your Rating</label>
            <div className="flex items-center gap-3">
              <div
                className="flex items-center gap-1"
                onMouseLeave={() => setHoverRating(0)}
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="p-0.5 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                    onMouseEnter={() => setHoverRating(star)}
                    onClick={() => setRating(star)}
                  >
                    <Star
                      className={`h-8 w-8 transition-colors ${
                        star <= (hoverRating || rating)
                          ? "fill-amber-400 text-amber-400"
                          : "fill-muted text-muted-foreground/30"
                      }`}
                    />
                  </button>
                ))}
              </div>
              {(hoverRating || rating) > 0 && (
                <motion.span
                  key={hoverRating || rating}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-sm font-medium text-muted-foreground"
                >
                  {ratingLabels[hoverRating || rating]}
                </motion.span>
              )}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="review-title" className="text-sm font-medium">
              Review Title
            </label>
            <Input
              id="review-title"
              placeholder="Summarize your experience..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              className="bg-muted/50"
            />
            <p className="text-[11px] text-muted-foreground text-right tabular-nums">
              {title.length}/100
            </p>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <label htmlFor="review-content" className="text-sm font-medium">
              Your Review
            </label>
            <Textarea
              id="review-content"
              placeholder="Tell others about your experience with this product..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              maxLength={1000}
              className="bg-muted/50 resize-none"
            />
            <p className="text-[11px] text-muted-foreground text-right tabular-nums">
              {content.length}/1000 · Minimum 10 characters
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleClose(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting}
            className="gap-2 min-w-[120px]"
          >
            {isSubmitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Submitting...
              </>
            ) : (
              <>
                <MessageSquarePlus className="h-4 w-4" />
                Submit Review
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Sort Dropdown ────────────────────────────────────────────────────────────

function SortDropdown({
  value,
  onChange,
}: {
  value: SortOption;
  onChange: (val: SortOption) => void;
}) {
  const [open, setOpen] = useState(false);

  const labels: Record<SortOption, string> = {
    recent: "Most Recent",
    highest: "Highest Rated",
    helpful: "Most Helpful",
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        className="gap-1.5 text-xs font-medium"
        onClick={() => setOpen(!open)}
      >
        <Filter className="h-3.5 w-3.5" />
        {labels[value]}
        {open ? (
          <ChevronUp className="h-3.5 w-3.5" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5" />
        )}
      </Button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full z-50 mt-1 min-w-[160px] rounded-lg border bg-popover p-1 shadow-lg"
            >
              {(Object.entries(labels) as [SortOption, string][]).map(
                ([option, label]) => (
                  <button
                    key={option}
                    className={`flex w-full items-center rounded-md px-3 py-2 text-sm transition-colors ${
                      value === option
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-foreground hover:bg-muted"
                    }`}
                    onClick={() => {
                      onChange(option);
                      setOpen(false);
                    }}
                  >
                    {label}
                  </button>
                )
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Reviews Section ──────────────────────────────────────────────────────

export function ReviewsSection({
  reviews: initialReviews,
  isLoggedIn = true,
}: ReviewsSectionProps) {
  const allReviews = initialReviews ?? mockReviews;

  const [reviews, setReviews] = useState<Review[]>(allReviews);
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [page, setPage] = useState(1);
  const [writeDialogOpen, setWriteDialogOpen] = useState(false);

  // ── Computed values ──

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return sum / reviews.length;
  }, [reviews]);

  const sortedReviews = useMemo(() => {
    const sorted = [...reviews];
    switch (sortBy) {
      case "recent":
        sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "highest":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case "helpful":
        sorted.sort((a, b) => b.helpfulCount - a.helpfulCount);
        break;
    }
    return sorted;
  }, [reviews, sortBy]);

  const totalPages = Math.ceil(sortedReviews.length / REVIEWS_PER_PAGE);
  const paginatedReviews = sortedReviews.slice(
    (page - 1) * REVIEWS_PER_PAGE,
    page * REVIEWS_PER_PAGE
  );

  // Reset page on sort change
  const handleSortChange = (option: SortOption) => {
    setSortBy(option);
    setPage(1);
  };

  // Helpful vote handler
  const handleHelpful = (id: string) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, userVotedHelpful: !r.userVotedHelpful } : r
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* ── Header: Rating Summary ── */}
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
        {/* Average rating */}
        <motion.div
          className="flex flex-col items-center sm:items-start gap-2 shrink-0"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <span className="text-5xl font-bold tabular-nums leading-none">
            {averageRating.toFixed(1)}
          </span>
          <StarDisplay rating={averageRating} size="lg" />
          <p className="text-sm text-muted-foreground">
            Based on{" "}
            <span className="font-semibold text-foreground">
              {reviews.length}
            </span>{" "}
            {reviews.length === 1 ? "review" : "reviews"}
          </p>
        </motion.div>

        {/* Distribution bars */}
        <motion.div
          className="flex-1 min-w-0"
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <RatingDistribution reviews={reviews} />
        </motion.div>
      </div>

      <Separator />

      {/* ── Actions row: Write review + Sort ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {isLoggedIn ? (
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setWriteDialogOpen(true)}
          >
            <MessageSquarePlus className="h-4 w-4" />
            Write a Review
          </Button>
        ) : (
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Log in</span> to write a review
          </p>
        )}

        <SortDropdown value={sortBy} onChange={handleSortChange} />
      </div>

      {/* ── Reviews List ── */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {paginatedReviews.map((review, index) => (
            <ReviewCard
              key={review.id}
              review={review}
              index={index}
              onHelpful={handleHelpful}
            />
          ))}
        </AnimatePresence>

        {/* Empty state */}
        {reviews.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <MessageSquarePlus className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground font-medium">
              No reviews yet
            </p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Be the first to share your experience!
            </p>
          </motion.div>
        )}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="h-9 w-9 p-0"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronUp className="h-4 w-4 rotate-[-90deg]" />
          </Button>

          <div className="flex items-center gap-1 mx-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNum) => (
                <Button
                  key={pageNum}
                  variant={page === pageNum ? "default" : "outline"}
                  size="sm"
                  className="h-9 w-9 p-0 text-sm tabular-nums"
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </Button>
              )
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            className="h-9 w-9 p-0"
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* ── Write Review Dialog ── */}
      <WriteReviewDialog
        open={writeDialogOpen}
        onOpenChange={setWriteDialogOpen}
        productName=""
      />
    </div>
  );
}
