import { useState } from "react";
import { Link, useLocation } from "wouter";
import { TrendingUp, Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchComponent } from "./search";

export function Header() {
  const [location] = useLocation();
  const [showSearch, setShowSearch] = useState(false);

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-bold text-foreground">CryptoBoard</h1>
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link href="/" className={`text-sm font-medium transition-colors duration-200 ${
                location === "/" ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}>
                Dashboard
              </Link>
              <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200">
                Markets
              </a>
              <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200">
                Portfolio
              </a>
              <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200">
                News
              </a>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSearch(!showSearch)}
                className="md:hidden"
              >
                <Search className="h-4 w-4" />
              </Button>
              <div className="hidden md:block">
                <SearchComponent />
              </div>
            </div>
            
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Bell className="h-4 w-4 mr-2" />
              Alerts
            </Button>
          </div>
        </div>
        
        {showSearch && (
          <div className="md:hidden pb-4">
            <SearchComponent />
          </div>
        )}
      </div>
    </nav>
  );
}
