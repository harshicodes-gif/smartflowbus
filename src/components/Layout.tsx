import { Link, useRouterState } from "@tanstack/react-router";
import { Bus, MapPin, Shield, Gauge, LayoutDashboard, Home, Globe, Building2, Route as RouteIcon, User as UserIcon, LogIn } from "lucide-react";
import { LANGUAGES, useI18n } from "@/lib/i18n";
import { CITIES } from "@/lib/buses";
import { useAuth } from "@/lib/auth";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function Header() {
  const { t, lang, setLang, city, setCity, cityName } = useI18n();
  const { user, signOut } = useAuth();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const links = [
    { to: "/", label: t("nav_home"), icon: Home },
    { to: "/tracking", label: t("nav_tracking"), icon: Bus },
    { to: "/planner", label: t("nav_planner"), icon: RouteIcon },
    { to: "/stops", label: t("nav_stops"), icon: MapPin },
    { to: "/safety", label: t("nav_safety"), icon: Shield },
    { to: "/driver", label: t("nav_driver"), icon: Gauge },
    { to: "/admin", label: t("nav_admin"), icon: LayoutDashboard },
  ] as const;

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg text-primary-foreground"
            style={{ background: "var(--gradient-hero)" }}
          >
            <Bus className="h-4 w-4" />
          </div>
          <span>{t("brand")}</span>
        </Link>

        <nav className="ml-4 hidden flex-1 items-center gap-1 md:flex">
          {links.map((l) => {
            const Icon = l.icon;
            const active = path === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Building2 className="h-4 w-4" />
                <span className="hidden sm:inline">{cityName(city)}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {CITIES.map((c) => (
                <DropdownMenuItem
                  key={c.id}
                  onClick={() => setCity(c.id)}
                  className={city === c.id ? "bg-accent" : ""}
                >
                  {cityName(c.id)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {LANGUAGES.find((l) => l.code === lang)?.native}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {LANGUAGES.map((l) => (
                <DropdownMenuItem
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  className={lang === l.code ? "bg-accent" : ""}
                >
                  <span className="mr-2">{l.native}</span>
                  <span className="text-xs text-muted-foreground">{l.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* mobile nav */}
      <nav className="flex gap-1 overflow-x-auto border-t px-2 py-2 md:hidden">
        {links.map((l) => {
          const Icon = l.icon;
          const active = path === l.to;
          return (
            <Link
              key={l.to}
              to={l.to}
              className={`flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs ${
                active ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              <Icon className="h-3 w-3" />
              {l.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="border-t bg-muted/30 px-4 py-6 text-center text-xs text-muted-foreground">
      {t("footer")}
    </footer>
  );
}
