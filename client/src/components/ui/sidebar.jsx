import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarItems = [
  { name: "Dashboard", path: "/" },
  { name: "Footprint Log", path: "/footprint" },
  { name: "Marketplace", path: "/marketplace" },
  { name: "Projects", path: "/projects" },
  { name: "Community", path: "/community" },
  { name: "Settings", path: "/settings" },
];

const Sidebar = () => {
  const pathname = usePathname();
  return (
    <aside className="w-72 bg-card/95 border-r border-border/30">
      <div className="h-full px-6 py-8 space-y-3">
        {sidebarItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`block px-5 py-4 rounded-2xl hover:bg-primary/10 ${
              pathname === item.path ? "bg-primary text-white" : ""
            }`}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
