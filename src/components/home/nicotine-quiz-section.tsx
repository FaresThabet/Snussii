"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ShoppingCart,
  RotateCcw,
  CheckCircle2,
  Cigarette,
  Wind,
  Leaf,
  History,
  Coffee,
  Candy,
  Droplets,
  CircleDot,
  Gauge,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { mockProducts } from "@/lib/mock-data";
import { Product } from "@/types";
import { useCartStore } from "@/stores/cart-store";
import { toast } from "sonner";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type NicotineStatus =
  | "smoker"
  | "vaper"
  | "first_time"
  | "former";

type CigaretteCount =
  | "1-5"
  | "6-10"
  | "11-20"
  | "20+";

type FlavorProfile =
  | "mint"
  | "fruit"
  | "coffee"
  | "natural";

type PouchFormat =
  | "slim"
  | "mini"
  | "regular"
  | "any";

type ExperienceLevel =
  | "beginner"
  | "moderate"
  | "experienced"
  | "expert";

interface QuizAnswers {
  nicotineStatus?: NicotineStatus;
  cigaretteCount?: CigaretteCount;
  flavor?: FlavorProfile;
  format?: PouchFormat;
  experience?: ExperienceLevel;
}

interface Recommendation {
  product: Product;
  matchScore: number;
  matchReasons: string[];
}

// ---------------------------------------------------------------------------
// Quiz step definitions
// ---------------------------------------------------------------------------

const TOTAL_STEPS = 5;

interface QuizStep {
  id: keyof QuizAnswers;
  title: string;
  subtitle: string;
  options: {
    value: string;
    label: string;
    description: string;
    icon: React.ReactNode;
  }[];
}

const quizSteps: QuizStep[] = [
  {
    id: "nicotineStatus",
    title: "Do you currently use nicotine products?",
    subtitle: "This helps us understand your nicotine background.",
    options: [
      {
        value: "smoker",
        label: "Yes, I smoke cigarettes",
        description: "Regular cigarette smoker",
        icon: <Cigarette className="h-5 w-5" />,
      },
      {
        value: "vaper",
        label: "Yes, I vape",
        description: "E-cigarette or vape user",
        icon: <Wind className="h-5 w-5" />,
      },
      {
        value: "first_time",
        label: "No, I'm a first-time user",
        description: "New to nicotine products",
        icon: <Leaf className="h-5 w-5" />,
      },
      {
        value: "former",
        label: "I used to smoke/vape",
        description: "Previously used nicotine",
        icon: <History className="h-5 w-5" />,
      },
    ],
  },
  {
    id: "cigaretteCount",
    title: "How many cigarettes per day?",
    subtitle: "If you don't smoke, pick based on your nicotine intake level.",
    options: [
      {
        value: "1-5",
        label: "1-5 cigarettes",
        description: "Light user",
        icon: <Gauge className="h-5 w-5" />,
      },
      {
        value: "6-10",
        label: "6-10 cigarettes",
        description: "Moderate user",
        icon: <Gauge className="h-5 w-5" />,
      },
      {
        value: "11-20",
        label: "11-20 cigarettes",
        description: "Regular user",
        icon: <Zap className="h-5 w-5" />,
      },
      {
        value: "20+",
        label: "20+ cigarettes",
        description: "Heavy user",
        icon: <Zap className="h-5 w-5" />,
      },
    ],
  },
  {
    id: "flavor",
    title: "Preferred flavor profile?",
    subtitle: "Choose the flavor that appeals to you most.",
    options: [
      {
        value: "mint",
        label: "Mint / Menthol",
        description: "Fresh, cool, and refreshing",
        icon: <Droplets className="h-5 w-5" />,
      },
      {
        value: "fruit",
        label: "Fruit / Berry",
        description: "Sweet berries and tropical notes",
        icon: <Candy className="h-5 w-5" />,
      },
      {
        value: "coffee",
        label: "Coffee / Tobacco",
        description: "Rich, warm classic profiles",
        icon: <Coffee className="h-5 w-5" />,
      },
      {
        value: "natural",
        label: "Unflavored / Natural",
        description: "Pure, neutral taste",
        icon: <CircleDot className="h-5 w-5" />,
      },
    ],
  },
  {
    id: "format",
    title: "Desired pouch format?",
    subtitle: "Each format offers a different experience under the lip.",
    options: [
      {
        value: "slim",
        label: "Slim (discreet)",
        description: "Thin and barely noticeable",
        icon: <Leaf className="h-5 w-5" />,
      },
      {
        value: "mini",
        label: "Mini (comfortable)",
        description: "Smallest size, great comfort",
        icon: <Leaf className="h-5 w-5" />,
      },
      {
        value: "regular",
        label: "Regular (standard)",
        description: "Standard size, full experience",
        icon: <CircleDot className="h-5 w-5" />,
      },
      {
        value: "any",
        label: "No preference",
        description: "Show me all formats",
        icon: <Sparkles className="h-5 w-5" />,
      },
    ],
  },
  {
    id: "experience",
    title: "Experience level with nicotine pouches?",
    subtitle: "Tell us how familiar you are with pouches specifically.",
    options: [
      {
        value: "beginner",
        label: "Beginner (0-6 mg)",
        description: "New to pouches, starting out",
        icon: <Leaf className="h-5 w-5" />,
      },
      {
        value: "moderate",
        label: "Moderate (8-12 mg)",
        description: "Some pouch experience",
        icon: <Gauge className="h-5 w-5" />,
      },
      {
        value: "experienced",
        label: "Experienced (16-20 mg)",
        description: "Regular pouch user",
        icon: <Zap className="h-5 w-5" />,
      },
      {
        value: "expert",
        label: "Expert (33 mg)",
        description: "Siberia-level only",
        icon: <Zap className="h-5 w-5" />,
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Recommendation engine
// ---------------------------------------------------------------------------

const FLAVOR_KEYWORDS: Record<string, string[]> = {
  mint: ["mint", "spearmint", "peppermint", "menthol"],
  fruit: ["berry", "fruit", "blueberry", "strawberry", "mango", "peach", "pink berry", "bubblegum", "citrus"],
  coffee: ["coffee", "mocha", "espresso", "caramel", "classic tobacco"],
  natural: ["unflavored", "original", "natural"],
};

const STRENGTH_MAP: Record<string, { min: number; max: number }> = {
  "1-5":     { min: 0,  max: 8  },
  "6-10":    { min: 6,  max: 14 },
  "11-20":   { min: 12, max: 22 },
  "20+":     { min: 24, max: 50 },
};

function scoreProduct(product: Product, answers: QuizAnswers): { score: number; reasons: string[] } {
  const reasons: string[] = [];
  let score = 0;

  // --- Strength matching (40 pts) ---
  const count = answers.cigaretteCount || "1-5";
  const range = STRENGTH_MAP[count];
  const inRange = product.strength >= range.min && product.strength <= range.max;
  if (inRange) {
    const mid = (range.min + range.max) / 2;
    const dist = Math.abs(product.strength - mid);
    const maxDist = (range.max - range.min) / 2 || 1;
    score += Math.round(40 * (1 - dist / maxDist));
    reasons.push(`${product.strength} mg/g strength`);
  } else {
    const diff = count === "1-5"
      ? Math.abs(product.strength - range.max)
      : count === "20+"
        ? Math.abs(product.strength - range.min)
        : Math.min(Math.abs(product.strength - range.min), Math.abs(product.strength - range.max));
    if (diff <= 4) {
      score += 15;
      reasons.push(`Close to preferred strength`);
    }
  }

  // --- Flavor matching (35 pts) ---
  const flavorPref = answers.flavor || "mint";
  const keywords = FLAVOR_KEYWORDS[flavorPref] || [];
  const productFlavorLower = product.flavor.toLowerCase();
  if (keywords.some((kw) => productFlavorLower.includes(kw))) {
    score += 35;
    reasons.push(`${product.flavor} flavor`);
  } else {
    // Fallback: category match
    if (flavorPref === "mint" && product.category_name === "Mint") {
      score += 20;
      reasons.push("Mint category");
    } else if (flavorPref === "fruit" && (product.category_name === "Fruit" || product.category_name === "Citrus")) {
      score += 20;
      reasons.push("Fruit category");
    } else if (flavorPref === "coffee" && (product.category_name === "Classic" || product.category_name === "Strong")) {
      score += 20;
      reasons.push("Classic profile");
    }
  }

  // --- Experience matching (25 pts) ---
  const exp = answers.experience || "moderate";
  const expRanges: Record<string, number[]> = {
    beginner: [4, 6, 8, 12],
    moderate: [8, 12, 14, 16],
    experienced: [16, 20, 24, 33],
    expert: [33],
  };
  const preferred = expRanges[exp] || [];
  if (preferred.some((s) => Math.abs(product.strength - s) <= 3)) {
    score += 25;
    reasons.push(`Great for ${exp} users`);
  } else if (preferred.some((s) => Math.abs(product.strength - s) <= 6)) {
    score += 12;
    reasons.push(`Suitable for ${exp} users`);
  }

  // --- Bonus for popular products ---
  if (product.bestseller) score += 3;
  if (product.featured) score += 2;

  if (reasons.length === 0) {
    reasons.push("Popular choice");
  }

  return { score: Math.min(score, 100), reasons };
}

function getRecommendations(answers: QuizAnswers): Recommendation[] {
  return mockProducts
    .map((product) => {
      const { score, reasons } = scoreProduct(product, answers);
      return { product, matchScore: score, matchReasons: reasons };
    })
    .filter((r) => r.matchScore >= 30)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 4);
}

// ---------------------------------------------------------------------------
// Slide animation variants
// ---------------------------------------------------------------------------

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 200 : -200,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction < 0 ? 200 : -200,
    opacity: 0,
  }),
};

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function NicotineQuizInline() {
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  const [currentStep, setCurrentStep] = useState(0); // 0=landing, 1-5=steps, 6=results
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [direction, setDirection] = useState(1);

  const progress = currentStep >= 1 && currentStep <= TOTAL_STEPS
    ? (currentStep / TOTAL_STEPS) * 100
    : 0;

  const currentQuizStep = quizSteps[currentStep - 1];
  const currentAnswer = currentQuizStep ? answers[currentQuizStep.id] : undefined;
  const isLastStep = currentStep === TOTAL_STEPS;
  const isResults = currentStep === TOTAL_STEPS + 1;

  const canProceed = (): boolean => {
    if (currentStep === 0 || isResults) return true;
    return !!currentAnswer;
  };

  const handleNext = useCallback(() => {
    if (currentStep === 0) {
      setDirection(1);
      setCurrentStep(1);
      return;
    }
    if (isLastStep) {
      const recs = getRecommendations(answers);
      setRecommendations(recs);
      setDirection(1);
      setCurrentStep(TOTAL_STEPS + 1);
      return;
    }
    setDirection(1);
    setCurrentStep((s) => s + 1);
  }, [currentStep, isLastStep, isResults, answers]);

  const handleBack = useCallback(() => {
    setDirection(-1);
    setCurrentStep((s) => Math.max(0, s - 1));
  }, []);

  const handleSelect = useCallback((stepId: keyof QuizAnswers, value: string) => {
    setAnswers((prev) => ({ ...prev, [stepId]: value }));
  }, []);

  const handleReset = useCallback(() => {
    setCurrentStep(0);
    setAnswers({});
    setRecommendations([]);
  }, []);

  const handleAddToCart = useCallback(
    (product: Product) => {
      addItem(product);
      toast.success(`${product.name} added to cart`);
    },
    [addItem]
  );

  const handleAddAllToCart = useCallback(() => {
    recommendations.forEach((rec) => addItem(rec.product));
    openCart();
    toast.success(`${recommendations.length} products added to cart`);
  }, [recommendations, addItem, openCart]);

  // Confetti-like particles on results
  const [showConfetti, setShowConfetti] = useState(false);
  useEffect(() => {
    if (isResults) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isResults]);

  return (
    <section id="nicotine-quiz" className="scroll-mt-16 py-16 sm:py-20 bg-neutral-50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="secondary" className="mb-4 gap-1.5">
            <Sparkles className="h-3 w-3" />
            AI-Powered Finder
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
            Not Sure Which Pouch is Right for You?
          </h2>
          <p className="mt-3 text-muted-foreground leading-relaxed max-w-xl mx-auto">
            Take our quick quiz and get personalized recommendations based on
            your habits, flavor preferences, and experience level.
          </p>
        </motion.div>

        {/* Quiz Card */}
        <Card className="border-0 shadow-lg overflow-hidden">
          <CardContent className="p-0">
            {/* Landing screen */}
            {currentStep === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 px-8"
              >
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 mb-6">
                  <Sparkles className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900">
                  Find Your Perfect Pouch in 30 Seconds
                </h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto leading-relaxed">
                  Answer 5 quick questions about your nicotine habits and
                  preferences. Our algorithm will match you with the best
                  products from our catalog.
                </p>
                <div className="mt-8">
                  <Button
                    size="lg"
                    className="gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-8"
                    onClick={handleNext}
                  >
                    Start Quiz
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-6 flex items-center justify-center gap-6 text-xs text-muted-foreground">
                  <span>5 questions</span>
                  <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                  <span>Takes 30 seconds</span>
                  <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                  <span>Personalized results</span>
                </div>
              </motion.div>
            )}

            {/* Steps 1-5 */}
            {currentStep >= 1 && currentStep <= TOTAL_STEPS && (
              <div className="p-6 sm:p-8">
                {/* Progress bar */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-muted-foreground">
                      Question {currentStep} of {TOTAL_STEPS}
                    </span>
                    <span className="text-sm font-semibold text-emerald-600">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                {/* Question content with slide animation */}
                <div className="relative overflow-hidden min-h-[280px]">
                  <AnimatePresence initial={false} custom={direction} mode="wait">
                    {currentQuizStep && (
                      <motion.div
                        key={currentStep}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="space-y-6"
                      >
                        <div>
                          <h3 className="text-xl font-semibold text-neutral-900">
                            {currentQuizStep.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {currentQuizStep.subtitle}
                          </p>
                        </div>

                        <div className="grid gap-3">
                          {currentQuizStep.options.map((option) => {
                            const isSelected =
                              currentAnswer === option.value;
                            return (
                              <motion.button
                                key={option.value}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                onClick={() =>
                                  handleSelect(currentQuizStep.id, option.value)
                                }
                                className={`flex items-start gap-4 rounded-xl border-2 p-4 text-left transition-all ${
                                  isSelected
                                    ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/20"
                                    : "border-neutral-200 hover:border-emerald-300 hover:bg-neutral-50"
                                }`}
                              >
                                <div
                                  className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${
                                    isSelected
                                      ? "bg-emerald-600 text-white"
                                      : "bg-neutral-100 text-neutral-500"
                                  }`}
                                >
                                  {option.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <span className="block text-sm font-semibold text-neutral-900">
                                    {option.label}
                                  </span>
                                  <span className="block text-xs text-muted-foreground mt-0.5">
                                    {option.description}
                                  </span>
                                </div>
                                {isSelected && (
                                  <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-1" />
                                )}
                              </motion.button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Navigation */}
                <div className="flex justify-between mt-8 pt-4 border-t border-neutral-200">
                  <Button
                    variant="ghost"
                    onClick={handleBack}
                    className="gap-1"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="gap-2 bg-emerald-600 hover:bg-emerald-500 text-white"
                  >
                    {isLastStep ? "See Results" : "Next"}
                    {isLastStep ? (
                      <Sparkles className="h-4 w-4" />
                    ) : (
                      <ArrowRight className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Results */}
            {isResults && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 sm:p-8"
              >
                {/* Confetti particles */}
                {showConfetti && (
                  <div className="fixed inset-0 pointer-events-none z-50">
                    {[...Array(30)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: ["#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#8b5cf6"][i % 5],
                          left: `${Math.random() * 100}%`,
                          top: "-10px",
                        }}
                        animate={{
                          y: [0, window.innerHeight + 100],
                          x: [0, (Math.random() - 0.5) * 200],
                          rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
                          opacity: [1, 0],
                        }}
                        transition={{
                          duration: 2 + Math.random() * 2,
                          delay: Math.random() * 0.5,
                          ease: "easeOut",
                        }}
                      />
                    ))}
                  </div>
                )}

                <div className="text-center mb-8">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900">
                    Your Recommended Products
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Based on your quiz answers, here are your best matches
                  </p>
                </div>

                {recommendations.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {recommendations.map((rec, index) => (
                      <motion.div
                        key={rec.product.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex gap-4 rounded-xl border border-neutral-200 p-4 hover:shadow-md transition-shadow">
                          {/* Product image */}
                          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                            <img
                              src={rec.product.image}
                              alt={rec.product.name}
                              className="h-full w-full object-cover"
                            />
                            <Badge className="absolute top-1 left-1 bg-emerald-600 text-white text-[9px] px-1.5 py-0 border-0">
                              {rec.matchScore}%
                            </Badge>
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                              {rec.product.brand_name}
                            </p>
                            <h4 className="text-sm font-semibold text-neutral-900 truncate">
                              {rec.product.name}
                            </h4>
                            <div className="flex items-center gap-1.5 mt-1">
                              <Badge variant="outline" className="text-[10px]">
                                {rec.product.strength} mg/g
                              </Badge>
                              <Badge variant="outline" className="text-[10px]">
                                {rec.product.flavor}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {rec.matchReasons.slice(0, 2).map((reason) => (
                                <span
                                  key={reason}
                                  className="inline-flex items-center gap-0.5 text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full"
                                >
                                  <CheckCircle2 className="h-2.5 w-2.5" />
                                  {reason}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Price + add */}
                          <div className="flex flex-col items-end justify-between flex-shrink-0">
                            <span className="text-sm font-bold text-neutral-900">
                              {rec.product.price} EGP
                            </span>
                            <Button
                              size="sm"
                              className="gap-1 text-xs bg-emerald-600 hover:bg-emerald-500 text-white"
                              onClick={() => handleAddToCart(rec.product)}
                            >
                              <ShoppingCart className="h-3 w-3" />
                              Add
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground text-sm">
                      No exact matches found. Try broadening your preferences!
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 mt-8">
                  <Button
                    className="flex-1 gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                    size="lg"
                    onClick={handleAddAllToCart}
                    disabled={recommendations.length === 0}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Add Recommended to Cart
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="gap-2"
                    onClick={handleReset}
                  >
                    <RotateCcw className="h-4 w-4" />
                    Retake Quiz
                  </Button>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
