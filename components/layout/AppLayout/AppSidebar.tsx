"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight, User } from "lucide-react";
import { categories } from "@/src/data/categories";
import { features } from "@/src/data/features";
import { DynamicIcon } from "../DynamicIcon";
import { ThemeToggle } from "../../shared/ThemeToggle";
import { AdPlaceholder } from "../../shared/AdPlaceholder";
import { useSidebar } from "../../providers/SidebarProvider";

export default function AppSidebar() {
  const { sidebarOpen, setSidebarOpen } = useSidebar();
  const pathname = usePathname();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const activeCategories = React.useMemo(() => {
    return categories
      .filter((c) => c.isActive)
      .map((cat) => ({
        ...cat,
        link: `/${cat.slug}`,
        features: features.filter((f) => f.categorySlug === cat.slug && f.isActive),
      }))
      .filter((cat) => cat.features.length > 0);
  }, []);

  useEffect(() => {
    const currentCategory = activeCategories.find((cat) => pathname.startsWith(cat.link));
    if (currentCategory) {
      setExpandedCategory(currentCategory.id);
    }
  }, [pathname]);

  const toggleCategory = (id: string) => {
    setExpandedCategory((prev) => (prev === id ? null : id));
  };

  return (
    <>
      {/* Sidebar Scrim (Overlay) */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
        ></div>
      )}

      {/* Responsive Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 w-80 h-screen flex flex-col bg-sidebar/95 backdrop-blur-xl border-r border-border transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
          }`}
      >
        <div className="flex h-16 items-center justify-between px-6 flex-shrink-0 border-b border-border">
          <div className="flex items-center gap-2 mr-2">
            <div className="h-8 shrink-0 flex items-center justify-center">
              <img src="/logo-light-mode.png" alt="Parvion Logo" className="h-full w-auto object-contain dark:hidden" />
              <img src="/logo-dark-mode.png" alt="Parvion Logo" className="h-full w-auto object-contain hidden dark:block" />
            </div>
            <span className="font-bold text-lg tracking-tight text-foreground leading-tight">
              Image Converter
            </span>
          </div>
          {/* Close button for the drawer */}
          <button 
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-full hover:bg-foreground/5 transition-colors text-muted-foreground hover:text-foreground"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pt-6 lg:pt-4 pb-4 space-y-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div>
            <h3 className="px-4 text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
              Main Tools
            </h3>
            <nav className="space-y-1">
              <Link
                href="/"
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-all ${pathname === "/"
                    ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_-3px_rgba(6,182,212,0.15)]"
                    : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                  }`}
              >
                <DynamicIcon icon="lucide:home" className="w-5 h-5" />
                Home
              </Link>

              {activeCategories.map((item) => (
                <div key={item.id} className="flex flex-col">
                  <div
                    className={`flex items-center justify-between px-4 py-2.5 rounded-lg font-medium transition-all group ${pathname.startsWith(item.link)
                        ? "bg-foreground/5 text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                      }`}
                  >
                    <Link
                      href={item.link}
                      className="flex items-center gap-3 flex-1"
                    >
                      <DynamicIcon
                        icon={item.icon}
                        className={`w-5 h-5 transition-colors ${pathname.startsWith(item.link)
                            ? "text-cyan-600 dark:text-cyan-400"
                            : "group-hover:text-cyan-500 dark:group-hover:text-cyan-400"
                          }`}
                      />
                      {item.title}
                    </Link>
                    <button
                      onClick={() => toggleCategory(item.id)}
                      className="p-1 hover:bg-foreground/10 rounded-md transition-colors focus:outline-none"
                    >
                      {expandedCategory === item.id ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {expandedCategory === item.id && (
                    <div className="pl-12 pr-4 py-1 space-y-1">
                      {item.features.map((feature) => (
                        <Link
                          key={feature.slug}
                          href={`${item.link}/${feature.slug}`}
                          className={`block py-1.5 text-sm transition-colors ${pathname === `${item.link}/${feature.slug}`
                              ? "text-cyan-600 dark:text-cyan-400 font-medium"
                              : "text-muted-foreground hover:text-cyan-500 dark:hover:text-cyan-400"
                            }`}
                        >
                          {feature.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>

        <div className="p-6 flex-shrink-0 border-t border-border">
          <AdPlaceholder />
        </div>
      </aside>
    </>
  );
}
