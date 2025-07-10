import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";

export function SearchComponent() {
  const [query, setQuery] = useState("");
  const [, setLocation] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Navigate to crypto detail page if query matches a crypto ID
      setLocation(`/crypto/${query.toLowerCase().replace(/\s+/g, "-")}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search cryptocurrencies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-10 w-full md:w-64"
      />
    </form>
  );
}
