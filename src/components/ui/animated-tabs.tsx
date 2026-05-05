"use client";

import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

interface AnimatedTabsProps {
  tabs: string[];
  containerClassName?: string;
  activeTabClassName?: string;
  tabClassName?: string;
}

const TAB_ROUTES: Record<string, string> = {
  Todos: "/",
  Aventura: "/Aventura",
  Marketplace: "/Marketplace",
  Senderismo: "/Senderismo",
  Cultura: "/Cultura",
  Gastronomía: "/Gastronomía",
  Login: "/Login",
};

export const AnimatedTabs = ({
  tabs,
  containerClassName,
  activeTabClassName,
  tabClassName,
}: AnimatedTabsProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const active = tabs.find((tab) => TAB_ROUTES[tab] === pathname) ?? tabs[0];

  const handleTabClick = (tab: string) => {
    const route = TAB_ROUTES[tab] ?? "/";
    router.push(route);
  };

  return (
    <div
      className={cn(
        "flex flex-row items-center justify-start [perspective:1000px] relative overflow-auto sm:overflow-visible no-scrollbar max-w-full w-full",
        containerClassName
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => handleTabClick(tab)}
          className={cn(
            "relative px-4 py-2 rounded-full transition-colors duration-300",
            tabClassName
          )}
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {active === tab && (
            <motion.div
              layoutId="clickedbutton"
              transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
              className={cn(
                "absolute inset-0 bg-[#d4e9c7] rounded-full",
                activeTabClassName
              )}
            />
          )}

          <span
            className={cn(
              "relative block text-sm font-bold tracking-tight font-sans",
              active === tab ? "text-[#1b3022]" : "text-[#434843] hover:text-[#1b3022]"
            )}
          >
            {tab}
          </span>
        </button>
      ))}
    </div>
  );
};