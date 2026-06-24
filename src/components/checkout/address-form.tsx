"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCheckoutStore } from "@/stores/checkout-store";
import { EGYPT_GOVERNORATES } from "@/lib/shipping";
import { MapPin, Phone, User, Building, Navigation } from "lucide-react";

export function AddressForm() {
  const { form, setField } = useCheckoutStore();

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold flex items-center gap-2">
        <MapPin className="h-4 w-4 text-primary" />
        Delivery Address
      </h3>

      {/* Full Name */}
      <div className="space-y-1.5">
        <Label htmlFor="fullName" className="flex items-center gap-1.5 text-sm">
          <User className="h-3.5 w-3.5 text-muted-foreground" />
          Full Name
        </Label>
        <Input
          id="fullName"
          placeholder="e.g., Ahmed Mohamed"
          value={form.fullName}
          onChange={(e) => setField("fullName", e.target.value)}
          className="h-10"
        />
      </div>

      {/* Phone */}
      <div className="space-y-1.5">
        <Label htmlFor="phone" className="flex items-center gap-1.5 text-sm">
          <Phone className="h-3.5 w-3.5 text-muted-foreground" />
          Phone Number
        </Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            +20
          </span>
          <Input
            id="phone"
            type="tel"
            placeholder="10XXXXXXXX"
            value={form.phone}
            onChange={(e) => setField("phone", e.target.value)}
            maxLength={11}
            className="h-10 pl-12"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Egyptian mobile number starting with 01
        </p>
      </div>

      {/* Governorate */}
      <div className="space-y-1.5">
        <Label htmlFor="governorate" className="flex items-center gap-1.5 text-sm">
          <Navigation className="h-3.5 w-3.5 text-muted-foreground" />
          Governorate
        </Label>
        <Select
          value={form.governorate}
          onValueChange={(value) => setField("governorate", value)}
        >
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Select your governorate" />
          </SelectTrigger>
          <SelectContent>
            {EGYPT_GOVERNORATES.map((gov) => (
              <SelectItem key={gov} value={gov}>
                {gov}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* City */}
      <div className="space-y-1.5">
        <Label htmlFor="city" className="text-sm">
          City / Area
        </Label>
        <Input
          id="city"
          placeholder="e.g., Maadi, Zamalek, Heliopolis"
          value={form.city}
          onChange={(e) => setField("city", e.target.value)}
          className="h-10"
        />
      </div>

      {/* Street */}
      <div className="space-y-1.5">
        <Label htmlFor="street" className="text-sm">
          Street Address
        </Label>
        <Input
          id="street"
          placeholder="e.g., 26th July St., Building 12"
          value={form.street}
          onChange={(e) => setField("street", e.target.value)}
          className="h-10"
        />
      </div>

      {/* Building + Landmark (side by side) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="building" className="flex items-center gap-1.5 text-sm">
            <Building className="h-3.5 w-3.5 text-muted-foreground" />
            Floor / Apt
          </Label>
          <Input
            id="building"
            placeholder="e.g., 3rd floor, Apt 5"
            value={form.building}
            onChange={(e) => setField("building", e.target.value)}
            className="h-10"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="landmark" className="text-sm">
            Nearest Landmark
          </Label>
          <Input
            id="landmark"
            placeholder="e.g., Near City Stars Mall"
            value={form.landmark}
            onChange={(e) => setField("landmark", e.target.value)}
            className="h-10"
          />
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-1.5">
        <Label htmlFor="notes" className="text-sm">
          Delivery Notes{" "}
          <span className="text-muted-foreground font-normal">(optional)</span>
        </Label>
        <Input
          id="notes"
          placeholder="Any special instructions for the courier"
          value={form.notes}
          onChange={(e) => setField("notes", e.target.value)}
          className="h-10"
        />
      </div>
    </div>
  );
}
