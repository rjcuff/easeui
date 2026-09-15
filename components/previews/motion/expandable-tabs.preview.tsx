"use client";

import { Bell, Home, Search, Settings, User } from "lucide-react";
import { useState } from "react";
import { ExpandableTabs, type ExpandableTab } from "@/components/motion/expandable-tabs";

const TABS: ExpandableTab[] = [
  { id: "home", label: "Home", icon: <Home className="h-4 w-4" /> },
  { id: "search", label: "Search", icon: <Search className="h-4 w-4" /> },
  { id: "alerts", label: "Alerts", icon: <Bell className="h-4 w-4" /> },
  { id: "profile", label: "Profile", icon: <User className="h-4 w-4" /> },
  { id: "settings", label: "Settings", icon: <Settings className="h-4 w-4" /> },
];

export function ExpandableTabsPreview() {
  const [value, setValue] = useState("home");
  return <ExpandableTabs tabs={TABS} value={value} onChange={setValue} />;
}
