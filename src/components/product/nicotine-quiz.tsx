"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ShoppingCart,
  RotateCcw,
  CheckCircle2,
  Leaf,
  Flame,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useQuizStore } from "@/stores/quiz-store";
import { useCartStore } from "@/stores/cart-store";
import {
  ExperienceLevel,
  FlavorPreference,
  StrengthPreference,
  QuizOption,
} from "@/types/quiz";
import { toast } from "sonner";

// ---------------------------------------------------------------------------
// Quiz option sets for each step
// ---------------------------------------------------------------------------

const experienceOptions: QuizOption<ExperienceLevel>[] = [
  {
    value: "beginner",
    label: "Beginner",
    description: "New to nicotine pouches or just trying them out",
    icon: "Leaf",
  },
  {
    value: "moderate",
    label: "Moderate",
    description: "I use pouches occasionally, familiar with nicotine",
    icon: "Flame",
  },
  {
    value: "experienced",
    label: "Experienced",
    description: "Regular user, I know what I want and need strong effects",
    icon: "Zap",
  },
];

const flavorOptions: QuizOption<FlavorPreference>[] = [
  {
    value: "mint",
    label: "Mint",
    description: "Fresh, cool, and refreshing spearmint or peppermint",
    icon: "Leaf",
  },
  {
    value: "fruit",
    label: "Fruit",
    description: "Sweet berry, citrus, or tropical fruit flavors",
    icon: "Sparkles",
  },
  {
    value: "coffee",
    label: "Coffee",
    description: "Rich, warm coffee or mocha-inspired profiles",
    icon: "Flame",
  },
  {
    value: "unflavored",
    label: "Unflavored",
    description: "Classic tobacco or pure, neutral flavor",
    icon: "Zap",
  },
];

const strengthOptions: QuizOption<StrengthPreference>[] = [
  {
    value: "low",
    label: "Low",
    description: "4 – 6 mg/g",
    icon: "Leaf",
  },
  {
    value: "medium",
    label: "Medium",
    description: "8 – 12 mg/g",
    icon: "Flame",
  },
  {
    value: "high",
    label: "High",
    description: "16 – 20 mg/g",
    icon: "Zap",
  },
  {
    value: "extreme",
    label: "Extreme",
    description: "33 mg/g",
    icon: "Sparkles",
  },
];

// ---------------------------------------------------------------------------
// Icon resolver
// ---------------------------------------------------------------------------

function getIcon(name: string) {
  switch (name) {
    case "Leaf":
      return <Leaf className="h-5 w-5" />;
    case "Flame":
      return <Flame className="h-5 w-5" />;
    case "Zap":
      return <Zap className="h-5 w-5" />;
    case "Sparkles":
      return <Sparkles className="h-5 w-5" />;
    default:
      return <Sparkles className="h-5 w-5" />;
  }
}

// ---------------------------------------------------------------------------
// Slide transition variants
// ---------------------------------------------------------------------------

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

// ---------------------------------------------------------------------------
// Main NicotineQuiz Component
// ---------------------------------------------------------------------------

export function NicotineQuiz() {
  const {
    currentStep,
    isOpen,
    answers,
    recommendations,
    setAnswer,
    nextStep,
    prevStep,
    reset,
    openQuiz,
    closeQuiz,
    generateRecommendations,
  } = useQuizStore();

  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  const [direction, setDirection] = useState(1);

  const progress = currentStep <= 3 ? (currentStep / 3) * 100 : 100;

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1:
        return !!answers.experience;
      case 2:
        return !!answers.flavor;
      case 3:
        return !!answers.strength;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep === 3) {
      generateRecommendations();
    } else {
      setDirection(1);
      nextStep();
    }
  };

  const handleBack = () => {
    setDirection(-1);
    prevStep();
  };

  const handleSelect = <T,>(key: string, value: T) => {
    setAnswer(key as "experience" | "flavor" | "strength", value as never);
  };

  const handleAddAllToCart = () => {
    recommendations.forEach((rec) => addItem(rec.product));
    openCart();
    toast.success(`${recommendations.length} products added to your cart`);
  };

  const stepLabels = ["", "Experience", "Flavor", "Strength", "Your Matches"];

  return (
    <>
      {/* Inline quiz section on homepage */}
      <section id="quiz" className="scroll-mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          {/* Section header */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <Badge variant="secondary" className="mb-4 gap-1.5">
              <Sparkles className="h-3 w-3" />
              AI-Powered
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Not Sure Which Pouch is Right for You?
            </h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Take our 30-second quiz and get personalized recommendations
              based on your experience, flavor preference, and desired strength.
            </p>
          </div>

          {/* Quiz launcher card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <Card className="border-dashed border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent hover:border-primary/40 transition-colors cursor-pointer group"
              onClick={openQuiz}
            >
              <CardContent className="flex flex-col sm:flex-row items-center justify-center gap-6 p-8 sm:p-12">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                  <Sparkles className="h-8 w-8" />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-lg font-semibold">Find Your Perfect Pouch</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    3 quick questions &middot; Personalized picks &middot; Takes 30 seconds
                  </p>
                </div>
                <Button size="lg" className="gap-2 mt-2 sm:mt-0">
                  Start Quiz
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Full-screen quiz Sheet */}
      <Sheet open={isOpen} onOpenChange={(open) => !open && closeQuiz()}>
        <SheetContent className="flex flex-col w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader className="space-y-1">
            <SheetTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Find Your Perfect Pouch
            </SheetTitle>
            {currentStep > 0 && currentStep <= 3 && (
              <SheetDescription>
                Step {currentStep} of 3 — {stepLabels[currentStep]}
              </SheetDescription>
            )}
          </SheetHeader>

          {/* Progress bar (steps 1-3) */}
          {currentStep >= 1 && currentStep <= 3 && (
            <div className="mt-4 space-y-2">
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                {stepLabels.slice(1, 4).map((label, i) => (
                  <span
                    key={label}
                    className={i + 1 <= currentStep ? "text-primary font-medium" : ""}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Step content with animated transitions */}
          <div className="flex-1 mt-6 relative overflow-hidden min-h-[320px]">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              {/* Step 1: Experience Level */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-xl font-semibold">
                      What&apos;s your experience level?
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      This helps us recommend the right nicotine strength.
                    </p>
                  </div>
                  <div className="grid gap-3">
                    {experienceOptions.map((option) => {
                      const isSelected = answers.experience === option.value;
                      return (
                        <motion.button
                          key={option.value}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => handleSelect("experience", option.value)}
                          className={`flex items-start gap-4 rounded-xl border-2 p-4 text-left transition-all ${
                            isSelected
                              ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                              : "border-border hover:border-primary/30 hover:bg-muted/50"
                          }`}
                        >
                          <div
                            className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${
                              isSelected
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {getIcon(option.icon)}
                          </div>
                          <div>
                            <span className="block text-sm font-semibold">
                              {option.label}
                            </span>
                            <span className="block text-xs text-muted-foreground mt-0.5">
                              {option.description}
                            </span>
                          </div>
                          {isSelected && (
                            <CheckCircle2 className="h-5 w-5 text-primary ml-auto flex-shrink-0 mt-1" />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Flavor Preference */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-xl font-semibold">
                      What flavor do you prefer?
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Choose the flavor profile that appeals to you most.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {flavorOptions.map((option) => {
                      const isSelected = answers.flavor === option.value;
                      return (
                        <motion.button
                          key={option.value}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSelect("flavor", option.value)}
                          className={`flex flex-col items-center gap-3 rounded-xl border-2 p-5 text-center transition-all ${
                            isSelected
                              ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                              : "border-border hover:border-primary/30 hover:bg-muted/50"
                          }`}
                        >
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                              isSelected
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {getIcon(option.icon)}
                          </div>
                          <div>
                            <span className="block text-sm font-semibold">
                              {option.label}
                            </span>
                            <span className="block text-xs text-muted-foreground mt-0.5">
                              {option.description}
                            </span>
                          </div>
                          {isSelected && (
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Desired Strength */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-xl font-semibold">
                      What strength are you looking for?
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Nicotine content is measured in milligrams per gram (mg/g).
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {strengthOptions.map((option) => {
                      const isSelected = answers.strength === option.value;
                      return (
                        <motion.button
                          key={option.value}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSelect("strength", option.value)}
                          className={`flex flex-col items-center gap-3 rounded-xl border-2 p-5 text-center transition-all ${
                            isSelected
                              ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                              : "border-border hover:border-primary/30 hover:bg-muted/50"
                          }`}
                        >
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                              isSelected
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {getIcon(option.icon)}
                          </div>
                          <div>
                            <span className="block text-sm font-semibold">
                              {option.label}
                            </span>
                            <span className="block text-lg font-bold text-primary mt-0.5">
                              {option.description}
                            </span>
                          </div>
                          {isSelected && (
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Step 4: Results */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 mb-3">
                      <CheckCircle2 className="h-7 w-7" />
                    </div>
                    <h3 className="text-xl font-semibold">Your Perfect Matches</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Based on your preferences, we recommend these pouches
                    </p>
                  </div>

                  {recommendations.length > 0 ? (
                    <div className="space-y-3">
                      {recommendations.map((rec, index) => (
                        <motion.div
                          key={rec.product.id}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.12 }}
                        >
                          <Card className="overflow-hidden">
                            <div className="flex gap-4 p-4">
                              {/* Product image */}
                              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                                <img
                                  src={rec.product.image}
                                  alt={rec.product.name}
                                  className="h-full w-full object-cover"
                                />
                                {/* Match score badge */}
                                <Badge className="absolute top-1 left-1 bg-primary text-primary-foreground text-[9px] px-1.5 py-0">
                                  {rec.matchScore}% match
                                </Badge>
                              </div>

                              {/* Product info */}
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                  {rec.product.brand_name}
                                </p>
                                <h4 className="text-sm font-semibold mt-0.5 truncate">
                                  {rec.product.name}
                                </h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className="text-[10px]">
                                    {rec.product.strength} mg/g
                                  </Badge>
                                  <Badge variant="outline" className="text-[10px]">
                                    {rec.product.flavor}
                                  </Badge>
                                </div>
                                {/* Match reasons */}
                                <div className="flex flex-wrap gap-1 mt-1.5">
                                  {rec.matchReasons.map((reason) => (
                                    <span
                                      key={reason}
                                      className="inline-flex items-center gap-0.5 text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full"
                                    >
                                      <CheckCircle2 className="h-2.5 w-2.5" />
                                      {reason}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* Price + add */}
                              <div className="flex flex-col items-end justify-between flex-shrink-0">
                                <span className="text-sm font-bold">
                                  {rec.product.price} EGP
                                </span>
                                <Button
                                  size="sm"
                                  className="gap-1 text-xs mt-1"
                                  onClick={() => {
                                    addItem(rec.product);
                                    toast.success(`${rec.product.name} added to cart`);
                                  }}
                                >
                                  <ShoppingCart className="h-3 w-3" />
                                  Add
                                </Button>
                              </div>
                            </div>
                          </Card>
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

                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button
                      className="flex-1 gap-2"
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
                      onClick={reset}
                    >
                      <RotateCcw className="h-4 w-4" />
                      Retake Quiz
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation buttons (steps 1-3) */}
          {currentStep >= 1 && currentStep <= 3 && (
            <div className="flex justify-between mt-6 pt-4 border-t border-border/40">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={currentStep <= 1}
                className="gap-1"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="gap-2"
              >
                {currentStep === 3 ? "See Results" : "Next"}
                {currentStep < 3 && <ArrowRight className="h-4 w-4" />}
                {currentStep === 3 && <Sparkles className="h-4 w-4" />}
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
