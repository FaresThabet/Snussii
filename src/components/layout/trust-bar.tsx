"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Truck, CreditCard, UserCheck } from "lucide-react";

const trustItems = [
  {
    icon: ShieldCheck,
    title: "Authentic Products",
    description: "100% genuine brands sourced directly from manufacturers",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Ships to all 27 governorates within 1-6 business days",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description: "Fawry, Vodafone Cash, InstaPay, Visa & COD accepted",
  },
  {
    icon: UserCheck,
    title: "21+ Verified",
    description: "Strict age verification at checkout and delivery",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function TrustBar() {
  return (
    <section className="border-b border-border/40 bg-muted/30">
      <motion.div
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {trustItems.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                variants={itemVariants}
                className="flex flex-col items-center text-center gap-3 group"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary/15 transition-colors">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">{item.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
