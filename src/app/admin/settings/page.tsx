"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldAlert, Store, Truck, Award, CreditCard, Bell, Loader2, Save } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

type SettingsSection = "store" | "shipping" | "loyalty" | "payments" | "notifications";

interface StoreSettings {
  storeName: string;
  tagline: string;
  supportEmail: string;
  supportPhone: string;
  currency: string;
  defaultLocale: string;
  taxRate: number;
}

interface ShippingSettings {
  freeShippingThreshold: number;
  defaultShippingCost: number;
  defaultDeliveryDays: number;
}

interface LoyaltySettings {
  programEnabled: boolean;
  pointsPer100EGP: number;
  pointValueInEGP: number;
}

interface PaymentSettings {
  cashOnDelivery: boolean;
  paymob: boolean;
  fawry: boolean;
  vodafoneCash: boolean;
  instaPay: boolean;
}

interface NotificationSettings {
  orderConfirmation: boolean;
  shippingUpdate: boolean;
  deliveryConfirmation: boolean;
  promotionalEmails: boolean;
}

interface AllSettings {
  store: StoreSettings;
  shipping: ShippingSettings;
  loyalty: LoyaltySettings;
  payments: PaymentSettings;
  notifications: NotificationSettings;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const SECTIONS: {
  id: SettingsSection;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    id: "store",
    label: "Store",
    description: "Store name, contact info, and regional preferences",
    icon: Store,
  },
  {
    id: "shipping",
    label: "Shipping",
    description: "Shipping costs, free delivery thresholds, and delivery times",
    icon: Truck,
  },
  {
    id: "loyalty",
    label: "Loyalty",
    description: "Loyalty program configuration and points value",
    icon: Award,
  },
  {
    id: "payments",
    label: "Payments",
    description: "Enable or disable payment methods for customers",
    icon: CreditCard,
  },
  {
    id: "notifications",
    label: "Notifications",
    description: "Email and notification preferences for orders & promos",
    icon: Bell,
  },
];

const DEFAULT_SETTINGS: AllSettings = {
  store: {
    storeName: "",
    tagline: "",
    supportEmail: "",
    supportPhone: "",
    currency: "EGP",
    defaultLocale: "en",
    taxRate: 14,
  },
  shipping: {
    freeShippingThreshold: 500,
    defaultShippingCost: 50,
    defaultDeliveryDays: 3,
  },
  loyalty: {
    programEnabled: true,
    pointsPer100EGP: 10,
    pointValueInEGP: 1,
  },
  payments: {
    cashOnDelivery: true,
    paymob: true,
    fawry: false,
    vodafoneCash: false,
    instaPay: false,
  },
  notifications: {
    orderConfirmation: true,
    shippingUpdate: true,
    deliveryConfirmation: true,
    promotionalEmails: false,
  },
};

const PAYMENT_LABELS: { key: keyof PaymentSettings; label: string }[] = [
  { key: "cashOnDelivery", label: "Cash on Delivery" },
  { key: "paymob", label: "Paymob / Card" },
  { key: "fawry", label: "Fawry" },
  { key: "vodafoneCash", label: "Vodafone Cash" },
  { key: "instaPay", label: "InstaPay" },
];

const NOTIFICATION_LABELS: { key: keyof NotificationSettings; label: string; desc: string }[] = [
  { key: "orderConfirmation", label: "Order Confirmation", desc: "Send email when a new order is placed" },
  { key: "shippingUpdate", label: "Shipping Update", desc: "Notify customers when order status changes" },
  { key: "deliveryConfirmation", label: "Delivery Confirmation", desc: "Send confirmation when order is delivered" },
  { key: "promotionalEmails", label: "Promotional Emails", desc: "Send marketing and promotional emails" },
];

// ─── Animation Variants ─────────────────────────────────────────────────────

const fadeInUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.25, ease: "easeOut" },
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function AdminSettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>("store");
  const [settings, setSettings] = useState<AllSettings>(DEFAULT_SETTINGS);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null); // null = loading
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // ─── Fetch session for auth check ──────────────────────────────────────
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/session");
        if (!res.ok) {
          setIsAuthorized(false);
          return;
        }
        const session = await res.json();
        const role = session?.user?.role;
        setIsAuthorized(role === "SUPER_ADMIN");
      } catch {
        setIsAuthorized(false);
      }
    };
    checkAuth();
  }, []);

  // ─── Fetch settings ────────────────────────────────────────────────────
  const fetchSettings = useCallback(async () => {
    setIsLoadingSettings(true);
    try {
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const data = await res.json();
        setSettings({
          store: { ...DEFAULT_SETTINGS.store, ...data.settings?.store },
          shipping: { ...DEFAULT_SETTINGS.shipping, ...data.settings?.shipping },
          loyalty: { ...DEFAULT_SETTINGS.loyalty, ...data.settings?.loyalty },
          payments: { ...DEFAULT_SETTINGS.payments, ...data.settings?.payments },
          notifications: { ...DEFAULT_SETTINGS.notifications, ...data.settings?.notifications },
        });
      }
    } catch {
      // Use defaults on error
    } finally {
      setIsLoadingSettings(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthorized) {
      fetchSettings();
    }
  }, [isAuthorized, fetchSettings]);

  // ─── Update local state ────────────────────────────────────────────────
  const updateStore = <K extends keyof StoreSettings>(key: K, value: StoreSettings[K]) => {
    setSettings((prev) => ({
      ...prev,
      store: { ...prev.store, [key]: value },
    }));
  };

  const updateShipping = <K extends keyof ShippingSettings>(key: K, value: ShippingSettings[K]) => {
    setSettings((prev) => ({
      ...prev,
      shipping: { ...prev.shipping, [key]: value },
    }));
  };

  const updateLoyalty = <K extends keyof LoyaltySettings>(key: K, value: LoyaltySettings[K]) => {
    setSettings((prev) => ({
      ...prev,
      loyalty: { ...prev.loyalty, [key]: value },
    }));
  };

  const updatePayments = <K extends keyof PaymentSettings>(key: K, value: PaymentSettings[K]) => {
    setSettings((prev) => ({
      ...prev,
      payments: { ...prev.payments, [key]: value },
    }));
  };

  const updateNotifications = <K extends keyof NotificationSettings>(key: K, value: NotificationSettings[K]) => {
    setSettings((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value },
    }));
  };

  // ─── Save handler ─────────────────────────────────────────────────────
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const sectionData = settings[activeSection];
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: activeSection, values: sectionData }),
      });

      if (!res.ok) {
        throw new Error("Failed to save settings");
      }

      const data = await res.json();
      toast.success("Settings saved", {
        description: `${SECTIONS.find((s) => s.id === activeSection)?.label} settings have been updated.`,
      });

      // Merge returned data
      if (data.settings) {
        setSettings((prev) => ({
          ...prev,
          [activeSection]: { ...prev[activeSection], ...data.settings },
        }));
      }
    } catch {
      toast.error("Save failed", {
        description: "Could not save settings. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // ─── Access Denied ────────────────────────────────────────────────────
  if (isAuthorized === false) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          {...fadeInUp}
          className="text-center space-y-4"
        >
          <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <ShieldAlert className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="text-xl font-semibold">Access Denied</h2>
          <p className="text-sm text-muted-foreground max-w-sm">
            You don&apos;t have permission to access this page. SUPER_ADMIN role is required to manage store settings.
          </p>
        </motion.div>
      </div>
    );
  }

  // ─── Loading State ────────────────────────────────────────────────────
  if (isAuthorized === null || isLoadingSettings) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-40 mb-2" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-56 flex-shrink-0">
            <Skeleton className="h-[340px] w-full rounded-lg" />
          </div>
          <div className="flex-1">
            <Skeleton className="h-[420px] w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  // ─── Helpers ──────────────────────────────────────────────────────────
  const currentSectionMeta = SECTIONS.find((s) => s.id === activeSection)!;

  // ─── Render: Store Section ────────────────────────────────────────────
  const renderStoreSection = () => (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="storeName">Store Name</Label>
          <Input
            id="storeName"
            value={settings.store.storeName}
            onChange={(e) => updateStore("storeName", e.target.value)}
            placeholder="Snusii"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tagline">Tagline</Label>
          <Input
            id="tagline"
            value={settings.store.tagline}
            onChange={(e) => updateStore("tagline", e.target.value)}
            placeholder="Premium nicotine pouches"
          />
        </div>
      </div>

      <Separator />

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="supportEmail">Support Email</Label>
          <Input
            id="supportEmail"
            type="email"
            value={settings.store.supportEmail}
            onChange={(e) => updateStore("supportEmail", e.target.value)}
            placeholder="support@snusii.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="supportPhone">Support Phone</Label>
          <Input
            id="supportPhone"
            type="tel"
            value={settings.store.supportPhone}
            onChange={(e) => updateStore("supportPhone", e.target.value)}
            placeholder="+20 100 123 4567"
          />
        </div>
      </div>

      <Separator />

      <div className="grid gap-5 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <Select value={settings.store.currency} disabled>
            <SelectTrigger id="currency" className="bg-muted/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EGP">EGP — Egyptian Pound</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">Fixed to EGP</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="locale">Default Locale</Label>
          <Select
            value={settings.store.defaultLocale}
            onValueChange={(val) => updateStore("defaultLocale", val)}
          >
            <SelectTrigger id="locale">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="ar">العربية (Arabic)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="taxRate">Tax Rate (%)</Label>
          <Input
            id="taxRate"
            type="number"
            min={0}
            max={100}
            step={0.5}
            value={settings.store.taxRate}
            onChange={(e) => updateStore("taxRate", parseFloat(e.target.value) || 0)}
          />
        </div>
      </div>
    </div>
  );

  // ─── Render: Shipping Section ─────────────────────────────────────────
  const renderShippingSection = () => (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="freeThreshold">Free Shipping Threshold (EGP)</Label>
          <Input
            id="freeThreshold"
            type="number"
            min={0}
            step={10}
            value={settings.shipping.freeShippingThreshold}
            onChange={(e) => updateShipping("freeShippingThreshold", parseFloat(e.target.value) || 0)}
          />
          <p className="text-xs text-muted-foreground">
            Orders above this amount get free shipping
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="shippingCost">Default Shipping Cost (EGP)</Label>
          <Input
            id="shippingCost"
            type="number"
            min={0}
            step={5}
            value={settings.shipping.defaultShippingCost}
            onChange={(e) => updateShipping("defaultShippingCost", parseFloat(e.target.value) || 0)}
          />
          <p className="text-xs text-muted-foreground">
            Applied when below free threshold
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="deliveryDays">Default Delivery Days</Label>
          <Input
            id="deliveryDays"
            type="number"
            min={1}
            max={30}
            step={1}
            value={settings.shipping.defaultDeliveryDays}
            onChange={(e) => updateShipping("defaultDeliveryDays", parseInt(e.target.value) || 1)}
          />
          <p className="text-xs text-muted-foreground">
            Estimated working days for delivery
          </p>
        </div>
      </div>
    </div>
  );

  // ─── Render: Loyalty Section ──────────────────────────────────────────
  const renderLoyaltySection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 p-4">
        <div className="space-y-0.5">
          <Label htmlFor="loyaltyToggle" className="text-sm font-medium">
            Loyalty Program
          </Label>
          <p className="text-xs text-muted-foreground">
            Enable or disable the customer loyalty points system
          </p>
        </div>
        <Switch
          id="loyaltyToggle"
          checked={settings.loyalty.programEnabled}
          onCheckedChange={(checked) => updateLoyalty("programEnabled", checked)}
        />
      </div>

      <Separator />

      <div
        className={cn(
          "grid gap-5 sm:grid-cols-2 transition-opacity duration-200",
          !settings.loyalty.programEnabled && "pointer-events-none opacity-50"
        )}
      >
        <div className="space-y-2">
          <Label htmlFor="pointsPer100">Points per 100 EGP</Label>
          <Input
            id="pointsPer100"
            type="number"
            min={0}
            step={1}
            value={settings.loyalty.pointsPer100EGP}
            onChange={(e) => updateLoyalty("pointsPer100EGP", parseInt(e.target.value) || 0)}
          />
          <p className="text-xs text-muted-foreground">
            How many points a customer earns per 100 EGP spent
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="pointValue">Point Value (EGP)</Label>
          <Input
            id="pointValue"
            type="number"
            min={0}
            step={0.5}
            value={settings.loyalty.pointValueInEGP}
            onChange={(e) => updateLoyalty("pointValueInEGP", parseFloat(e.target.value) || 0)}
          />
          <p className="text-xs text-muted-foreground">
            Monetary value of 1 loyalty point at redemption
          </p>
        </div>
      </div>
    </div>
  );

  // ─── Render: Payments Section ─────────────────────────────────────────
  const renderPaymentsSection = () => (
    <div className="space-y-3">
      {PAYMENT_LABELS.map(({ key, label }) => (
        <div
          key={key}
          className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 px-4 py-3.5"
        >
          <div>
            <Label className="text-sm font-medium">{label}</Label>
          </div>
          <Switch
            checked={settings.payments[key]}
            onCheckedChange={(checked) => updatePayments(key, checked)}
          />
        </div>
      ))}
      <p className="text-xs text-muted-foreground pt-1">
        Disabled payment methods won&apos;t be shown to customers at checkout.
      </p>
    </div>
  );

  // ─── Render: Notifications Section ────────────────────────────────────
  const renderNotificationsSection = () => (
    <div className="space-y-3">
      {NOTIFICATION_LABELS.map(({ key, label, desc }) => (
        <div
          key={key}
          className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 px-4 py-3.5"
        >
          <div className="space-y-0.5 pr-4">
            <Label className="text-sm font-medium">{label}</Label>
            <p className="text-xs text-muted-foreground">{desc}</p>
          </div>
          <Switch
            checked={settings.notifications[key]}
            onCheckedChange={(checked) => updateNotifications(key, checked)}
            className="flex-shrink-0"
          />
        </div>
      ))}
    </div>
  );

  // ─── Section Renderer Map ─────────────────────────────────────────────
  const SECTION_RENDERERS: Record<SettingsSection, () => React.ReactNode> = {
    store: renderStoreSection,
    shipping: renderShippingSection,
    loyalty: renderLoyaltySection,
    payments: renderPaymentsSection,
    notifications: renderNotificationsSection,
  };

  // ─── Main Render ──────────────────────────────────────────────────────
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Page Header */}
      <div className="mb-2">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          System configuration and preferences
        </p>
      </div>

      {/* Layout: Sidebar Nav + Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Section Navigation (vertical tabs) */}
        <nav className="lg:w-56 flex-shrink-0">
          <Card>
            <CardContent className="p-2">
              <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
                {SECTIONS.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;

                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-150 whitespace-nowrap text-left w-full",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                      )}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <span>{section.label}</span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </nav>

        {/* Active Section Form */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2.5">
                    {(() => {
                      const Icon = currentSectionMeta.icon;
                      return <Icon className="h-5 w-5 text-primary" />;
                    })()}
                    {currentSectionMeta.label} Settings
                  </CardTitle>
                  <CardDescription>
                    {currentSectionMeta.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {SECTION_RENDERERS[activeSection]()}
                  <Separator className="my-6" />
                  <div className="flex justify-end">
                    <Button onClick={handleSave} disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving…
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}