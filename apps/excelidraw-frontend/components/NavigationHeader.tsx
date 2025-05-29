"use client";

import { Button } from "@repo/ui/button";
import { Home, Users, Plus, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export function NavigationHeader() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                E
              </span>
            </div>
            <span className="text-xl font-bold">Excelidraw</span>
          </Link>{" "}
          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Home
              </div>
            </Link>

            <Link
              href="/discover"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Discover
              </div>
            </Link>

            {isLoggedIn && (
              <Link
                href="/rooms"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  My Rooms
                </div>
              </Link>
            )}
          </div>{" "}
          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {" "}
            {isLoggedIn ? (
              <>
                <Link href="/create-room">
                  <Button
                    variant="outline"
                    size="sm"
                    className="hidden sm:flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    New Room
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Link href="/signin">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
