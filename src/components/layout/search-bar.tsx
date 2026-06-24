"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SearchBar() {
  const [query, setQuery] = useState("");

  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search pouches..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-9 bg-muted/50 border-muted-foreground/10 focus-visible:ring-primary/30 h-9"
      />
    </div>
  );
}
