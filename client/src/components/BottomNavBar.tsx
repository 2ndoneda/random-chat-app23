import React from "react";
import {
  Home as HomeIcon,
  Video,
  User,
  Users,
  Bot,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../context/LanguageProvider";

// Updated with beautiful peach colors - Cache bust 2024-07-18

const iconSize = 18; // Base size for mobile, will be responsive

export default function BottomNavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const navItems = [
    { label: t("nav.home"), icon: HomeIcon, path: "/" },
    {
      label: t("nav.chat"),
      icon: Video,
      path: "/chat",
    },
    { label: "AI Chat", icon: Bot, path: "/ai-chatbot" },
    {
      label: t("nav.friends"),
      icon: Users,
      path: "/friends",
    },
    {
      label: t("nav.profile"),
      icon: User,
      path: "/profile",
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-md flex justify-around items-center h-16 sm:h-18 lg:h-20 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-4xl mx-auto bg-gradient-to-r from-flamingo-pink via-blush-peach to-coral-orange border-t-4 border-flamingo-pink rounded-t-3xl shadow-2xl"
    >
      {navItems.map((item) => {
        const IconComponent = item.icon;
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.label}
            className={`relative flex flex-col items-center justify-center flex-1 py-2 sm:py-3 px-2 focus:outline-none transition-all duration-300 transform active:scale-95 ${
              isActive ? "scale-110 sm:scale-115" : "hover:scale-105"
            }`}
            onClick={() => navigate(item.path)}
          >
            {/* Active background glow */}
            {isActive && (
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/40 via-white/30 to-white/20 blur-sm shadow-lg" />
            )}

            {/* Icon container with beautiful styling */}
            <div
              className={`relative p-2 sm:p-2.5 rounded-xl transition-all duration-300 ${
                isActive
                  ? "bg-white/90 shadow-lg"
                  : "bg-white/20 backdrop-blur-sm"
              }`}
            >
              <IconComponent
                size={18}
                className={`sm:w-5 sm:h-5 lg:w-6 lg:h-6 transition-colors duration-300 ${
                  isActive ? "text-flamingo-pink" : "text-white/80"
                }`}
              />
            </div>

            {/* Label with beautiful styling */}
            <span
              className={`text-[10px] sm:text-xs lg:text-sm leading-none mt-1 transition-colors duration-300 ${
                isActive ? "font-extrabold text-white" : "font-medium text-white/80"
              }`}
            >
              {item.label}
            </span>

            {/* Active indicator dot */}
            {isActive && (
              <div className="absolute -top-1 right-1/2 transform translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-md animate-pulse" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
