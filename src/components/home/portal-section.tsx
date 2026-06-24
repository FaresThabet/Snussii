"use client";

import { useI18n } from "@/lib/i18n";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Building2,
  Briefcase,
  ArrowRight,
  ArrowLeft,
  Package,
  Users,
  BarChart3,
  Shield,
  MapPin,
  CreditCard,
  Headset,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function PortalSection() {
  const { t, isRTL } = useI18n();

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const b2bFeatures = [
    { icon: Package, label: isRTL ? "طلبات جملة" : "Bulk Orders" },
    { icon: BarChart3, label: isRTL ? "المخزون" : "Inventory" },
    { icon: CreditCard, label: isRTL ? "الفواتير" : "Invoices" },
    { icon: Shield, label: isRTL ? "المدفوعات" : "Payments" },
  ];

  const corpFeatures = [
    { icon: Users, label: isRTL ? "الموظفين" : "Employees" },
    { icon: Building2, label: isRTL ? "الأقسام" : "Departments" },
    { icon: BarChart3, label: isRTL ? "التقارير" : "Reports" },
    { icon: Shield, label: isRTL ? "الموافقات" : "Approvals" },
  ];

  const stats = [
    { icon: MapPin, label: t("portal.stat1") },
    { icon: CreditCard, label: t("portal.stat2") },
    { icon: Headset, label: t("portal.stat3") },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
            {t("portal.title")}
          </h2>
          <p className="mt-3 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {t("portal.subtitle")}
          </p>
        </motion.div>

        {/* Portal Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* B2B Portal Card */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 60 : -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 p-8 sm:p-10 h-full flex flex-col">
              {/* Decorative background circle */}
              <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-emerald-500/20 blur-2xl" />
              <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-emerald-400/10 blur-2xl" />

              <div className="relative z-10 flex flex-col h-full">
                {/* Icon */}
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
                  <Briefcase className="h-8 w-8 text-white" />
                </div>

                {/* Title & Description */}
                <h3 className="text-2xl font-bold text-white mb-3">
                  {t("portal.b2bTitle")}
                </h3>
                <p className="text-emerald-100 text-base leading-relaxed mb-6">
                  {t("portal.b2bDesc")}
                </p>

                {/* Feature Pills */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {b2bFeatures.map((feature) => (
                    <span
                      key={feature.label}
                      className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 text-sm font-medium text-white backdrop-blur-sm"
                    >
                      <feature.icon className="h-3.5 w-3.5" />
                      {feature.label}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <div className="mt-auto">
                  <Button
                    asChild
                    size="lg"
                    className="w-full sm:w-auto bg-white text-emerald-700 hover:bg-emerald-50 font-semibold rounded-xl px-6 h-12 text-base transition-colors"
                  >
                    <Link href="/b2b">
                      {t("portal.b2bCta")}
                      <ArrowIcon className="ms-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Corporate Portal Card */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? -60 : 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-700 p-8 sm:p-10 h-full flex flex-col">
              {/* Decorative background circle */}
              <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full bg-blue-400/20 blur-2xl" />
              <div className="absolute -bottom-12 -right-12 w-40 h-40 rounded-full bg-indigo-400/10 blur-2xl" />

              <div className="relative z-10 flex flex-col h-full">
                {/* Icon */}
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
                  <Building2 className="h-8 w-8 text-white" />
                </div>

                {/* Title & Description */}
                <h3 className="text-2xl font-bold text-white mb-3">
                  {t("portal.corpTitle")}
                </h3>
                <p className="text-blue-100 text-base leading-relaxed mb-6">
                  {t("portal.corpDesc")}
                </p>

                {/* Feature Pills */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {corpFeatures.map((feature) => (
                    <span
                      key={feature.label}
                      className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 text-sm font-medium text-white backdrop-blur-sm"
                    >
                      <feature.icon className="h-3.5 w-3.5" />
                      {feature.label}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <div className="mt-auto">
                  <Button
                    asChild
                    size="lg"
                    className="w-full sm:w-auto bg-white text-blue-700 hover:bg-blue-50 font-semibold rounded-xl px-6 h-12 text-base transition-colors"
                  >
                    <Link href="/corporate">
                      {t("portal.corpCta")}
                      <ArrowIcon className="ms-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center justify-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-4"
            >
              <stat.icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}