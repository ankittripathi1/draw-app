"use client";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { X, Menu } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navItems = [
    {
      label: "Home",
      href: "#",
    },
    {
      label: "Features",
      href: "#",
    },
    {
      label: "Discover",
      href: "/discover",
    },
  ];

  const handleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <header
      className={cn(
        "flex items-center h-14 fixed top-0 z-50 w-full px-4 md:px-20 transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-sm shadow-sm"
          : "bg-transparent",
      )}
    >
      <nav className="flex items-center justify-between w-full">
        {/* logo */}
        <h1 className="text-2xl font-bold cursor-pointer">Sketch Forge</h1>
        {/* Desktop Navigation */}
        <div className="gap-x-10 hidden md:flex ">
          <ul className="flex gap-x-8 items-center text-base font-semibold ">
            {navItems.map((item, idx) => {
              return (
                <Link className="cursor-pointer" href={item.href} key={idx}>
                  {item.label}
                </Link>
              );
            })}
          </ul>
          <Button className="">Login</Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-accent transition-colors"
          onClick={handleMenu}
          aria-label="toggle-menu"
        >
          {isOpen ? <X /> : <Menu />}
        </button>
        {/* Mobile Menu Overlay */}
        <div
          className={cn(
            "fixed top-14 right-0 w-full max-w-xs h-[calc(100vh-3.5rem)] bg-background shadow-lg md:hidden z-50",
            "transform transition-transform duration-300 ease-in-out",
            isOpen ? "translate-x-0" : "translate-x-full",
          )}
        >
          <ul className="flex flex-col p-4 space-y-4">
            {navItems.map((item, idx) => (
              <Link
                className="block px-4 py-2 rounded-md hove:bg-accent transition-colors"
                href={item.href}
                key={idx}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <li className="mt-4">
              <Button className="w-full">Login</Button>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

