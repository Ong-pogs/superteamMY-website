"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Users, Calendar, Building2, FileText, LayoutDashboard, LogOut } from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Members", href: "/admin/members", icon: Users },
  { label: "Events", href: "/admin/events", icon: Calendar },
  { label: "Partners", href: "/admin/partners", icon: Building2 },
  { label: "Content", href: "/admin/content", icon: FileText },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // TODO: Replace with real Supabase auth check
    // For now, simulate auth
    const isAuth = typeof window !== "undefined" && sessionStorage.getItem("admin_auth") === "true";
    setAuthenticated(isAuth);
    setLoading(false);
  }, []);

  const handleLogin = () => {
    // TODO: Replace with Supabase magic link auth
    sessionStorage.setItem("admin_auth", "true");
    setAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth");
    setAuthenticated(false);
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-terminal flex items-center justify-center">
        <div className="font-mono text-sm text-text-secondary">Loading...</div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-bg-terminal flex items-center justify-center px-6">
        <div className="w-full max-w-sm space-y-6 border border-border-dim bg-bg-panel p-8">
          <div className="text-center">
            <h1 className="font-display text-xl font-bold text-text-primary">Admin Login</h1>
            <p className="mt-2 font-mono text-xs text-text-secondary">
              // TERMINAL.MY ADMIN PANEL
            </p>
          </div>
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full bg-bg-terminal border border-border-dim px-4 py-3 font-mono text-sm text-text-primary placeholder:text-text-secondary/40 outline-none focus:border-border-active"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-bg-terminal border border-border-dim px-4 py-3 font-mono text-sm text-text-primary placeholder:text-text-secondary/40 outline-none focus:border-border-active"
            />
            <button
              onClick={handleLogin}
              className="w-full bg-sol-green text-bg-terminal py-3 font-mono text-xs uppercase tracking-[0.1em] hover:bg-sol-green/90 transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-terminal flex">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-border-dim bg-bg-panel p-4 flex flex-col">
        <div className="mb-8">
          <Link href="/" className="font-mono text-xs tracking-[0.15em] text-text-primary">
            TERMINAL<span className="text-sol-green">//</span>MY
          </Link>
          <p className="mt-1 font-mono text-[0.55rem] text-text-secondary">ADMIN PANEL</p>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded text-sm text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors"
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 text-sm text-text-secondary hover:text-red-400 transition-colors"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
