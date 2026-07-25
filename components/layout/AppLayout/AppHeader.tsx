"use client";

import { Menu, X, Search, ChevronDown } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "../../shared/ThemeToggle";
import { useSidebar } from "../../providers/SidebarProvider";
import { categories } from "@/src/data/categories";
import { features } from "@/src/data/features";
import { DynamicIcon } from "../DynamicIcon";

export default function AppHeader() {
  const { sidebarOpen, toggleSidebar } = useSidebar();
  
  const activeCategories = categories.filter(c => c.isActive);

  return (
    <header className="fixed top-0 w-full z-40 bg-background/95 backdrop-blur-xl border-b border-border h-16 flex items-center justify-between px-4 lg:px-8">
      
      {/* Left: Logo */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 -ml-2 rounded-full hover:bg-foreground/5 transition-colors lg:hidden relative z-[60]"
          aria-label="Menu"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <Link href="/" className="font-black text-xl tracking-tight text-foreground flex items-center gap-2">
          <div className="h-8 sm:h-10 shrink-0 flex items-center justify-center">
            {/* Light Mode Logo (Dark Text) */}
            <img src="/logo-light-mode.png" alt="Parvion Logo" className="h-full w-auto object-contain dark:hidden" />
            {/* Dark Mode Logo (Light Text) */}
            <img src="/logo-dark-mode.png" alt="Parvion Logo" className="h-full w-auto object-contain hidden dark:block" />
          </div>
          <span className="hidden sm:block">Image Converter</span>
        </Link>
      </div>

      {/* Center: Desktop Navigation */}
      <nav className="hidden lg:flex items-center justify-center absolute left-1/2 -translate-x-1/2 h-full">
        {activeCategories.map((cat) => (
          <div key={cat.id} className="group h-full flex items-center relative">
            <Link 
              href={`/${cat.slug}`}
              className="px-4 py-2 text-sm font-bold text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors h-full"
            >
              {cat.title}
              <ChevronDown className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:-rotate-180 transition-all duration-300" />
            </Link>
            
            {/* Dropdown Menu */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0 pt-4 w-[460px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="bg-muted/95 backdrop-blur-xl border border-border rounded-xl shadow-xl p-3 grid grid-cols-2 gap-2">
                {features.filter(f => f.categorySlug === cat.slug && f.isActive).map(feat => (
                  <Link
                    key={feat.id}
                    href={`/${cat.slug}/${feat.slug}`}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-foreground/5 transition-colors group/item"
                  >
                    <div className="w-8 h-8 rounded-md bg-primary/10 text-primary flex items-center justify-center group-hover/item:bg-primary group-hover/item:text-primary-foreground transition-colors">
                      <DynamicIcon icon={feat.icon} className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-foreground leading-none mb-1">{feat.name}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}
        
      </nav>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        <ThemeToggle />
      </div>
    </header>
  );
}
