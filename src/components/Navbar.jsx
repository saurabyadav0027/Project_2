import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Briefcase,
  LayoutDashboard,
  ListChecks,
  PlusCircle,
  BarChart3,
  Menu,
  X,
} from "lucide-react";

const NAV_LINKS = [
  { to: "/dashboard",        label: "Dashboard",    Icon: LayoutDashboard },
  { to: "/applications",     label: "Applications", Icon: ListChecks       },
  { to: "/applications/new", label: "Add Job",      Icon: PlusCircle       },
  { to: "/analytics",        label: "Analytics",    Icon: BarChart3        },
];

function NavItem({ to, label, Icon, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150
        ${isActive
          ? "bg-brand-50 text-brand-700"
          : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
        }`
      }
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      {label}
    </NavLink>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <NavLink to="/dashboard" className="flex items-center gap-2.5 group">
            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-md group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5 text-white" />
            </span>
            <span className="text-lg font-bold text-slate-800 tracking-tight">
              Job<span className="text-brand-600">Tracker</span>
            </span>
          </NavLink>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <NavItem key={link.to} {...link} />
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white animate-fade-in px-4 py-3 space-y-1">
          {NAV_LINKS.map((link) => (
            <NavItem
              key={link.to}
              {...link}
              onClick={() => setMenuOpen(false)}
            />
          ))}
        </div>
      )}
    </header>
  );
}
