"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  FileQuestionMark,
  FileSearch,
  LogOut,
  User,
} from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function Navigation() {
  const router = useRouter();
  const [isSignedIn, setIsSignedIn] = React.useState(false);
  const [showMenu, setShowMenu] = React.useState(false);

  React.useEffect(() => {
    const checkAuth = () => setIsSignedIn(!!localStorage.getItem("token"));
    checkAuth();
    window.addEventListener("auth-change", checkAuth);
    return () => window.removeEventListener("auth-change", checkAuth);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setIsSignedIn(false);
    window.dispatchEvent(new Event("auth-change"));
    router.push("/");
  };

  return (
    <div className="sticky top-0 z-50 dark text-white text-sm bg-slate-950 border-b border-zinc-800/50">
      <div className="mx-24 px-0 p-3 flex justify-between">
        <Link href={"/dashboard"}>
          <div className="flex justify-center items-center gap-2">
            <img
              className="w-8"
              src="https://cdn.prod.website-files.com/5e9dc792e1210c5325f7ebbc/64354680f3f50b5758e2cb0d_1642608434799.webp"
              alt=""
            />
            <span className="font-medium text-base">BetterUpTime</span>
          </div>
        </Link>
        <div>
          <NavigationMenu>
            <NavigationMenuList className="flex-wrap">
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-slate-950">
                  Home
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full flex-col justify-end rounded-lg bg-gradient-to-br from-indigo-600/20 via-slate-800/50 to-slate-900/80 p-6 no-underline outline-none transition-all duration-300 select-none hover:shadow-lg hover:shadow-indigo-500/10 border border-slate-700/30 hover:border-indigo-500/30 group"
                          href="/dashboard"
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <img
                              className="w-6 h-6"
                              src="https://cdn.prod.website-files.com/5e9dc792e1210c5325f7ebbc/64354680f3f50b5758e2cb0d_1642608434799.webp"
                              alt="BetterUptime"
                            />
                            <div className="text-lg font-semibold text-white group-hover:text-indigo-200 transition-colors">
                              BetterUptime
                            </div>
                          </div>
                          <p className="text-slate-300 text-sm leading-relaxed group-hover:text-slate-200 transition-colors">
                            Complete website monitoring solution with real-time alerts, uptime tracking, and performance analytics.
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <ListItem href="/dashboard" title="📊 Dashboard">
                      View recent monitors, response times overview, and uptime statistics in one place.
                    </ListItem>
                    <ListItem href="/dashboard/monitors" title="🔍 Website Monitoring">
                      Monitor your websites every 3 minutes with detailed response time tracking.
                    </ListItem>
                    <ListItem href="/dashboard/integrations" title="🔔 Integrations">
                      Get notified via Email, Slack, Discord, Telegram, or custom webhooks.
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link href="/docs" className="bg-slate-950">
                    Documentation
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link href="/pricing " className="bg-slate-950">
                    Pricing
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem className="hidden md:block">
                <NavigationMenuTrigger className="bg-slate-950">
                  Community
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-4">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link href="#" className="flex-row items-center gap-2">
                          <Calendar />
                          Guides
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link href="#" className="flex-row items-center gap-2">
                          <FileQuestionMark />
                          Questions
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link href="#" className="flex-row items-center gap-2">
                          <FileSearch />
                          Comparisons
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem className="hidden md:block">
                <NavigationMenuTrigger className="bg-slate-950">
                  Company
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-4">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link href="#" className="flex-row items-center gap-2">
                          <Calendar />
                          Guides
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link href="#" className="flex-row items-center gap-2">
                          <FileQuestionMark />
                          Questions
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link href="#" className="flex-row items-center gap-2">
                          <FileSearch />
                          Comparisons
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex gap-2 items-center">
          {isSignedIn ? (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="focus:outline-none"
              >
                <Avatar>
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-indigo-600 text-white">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-zinc-800 rounded-md shadow-lg py-1">
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 text-sm hover:bg-slate-800 transition-colors"
                    onClick={() => setShowMenu(false)}
                  >
                    <User className="inline h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-slate-800 transition-colors"
                  >
                    <LogOut className="inline h-4 w-4 mr-2" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href={"/signin"}>
                <Button variant={"ghost"} size={"sm"} className="text-xs">
                  Sign in
                </Button>
              </Link>
              <Link href={"signup"}>
                <Button
                  size={"sm"}
                  className="text-white hover:opacity-90 text-xs"
                >
                  Sign up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link 
          href={href}
          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-800/50 hover:text-white focus:bg-slate-800/50 focus:text-white group"
        >
          <div className="text-sm font-medium leading-none text-white group-hover:text-indigo-200 transition-colors">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-slate-400 group-hover:text-slate-300 transition-colors">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
