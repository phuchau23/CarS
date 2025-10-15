"use client";

import { getCurrentUser, setCurrentUser, loginAsGuest } from "@/app/lib/db";
import { User } from "@/app/lib/types";
import type React from "react";

import { createContext, useContext, useEffect, useState } from "react";

interface AppContextType {
  currentUser: User | null;
  setUser: (user: User | null) => void;
  loginGuest: () => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const user = getCurrentUser();
    setCurrentUserState(user);
  }, []);

  const setUser = (user: User | null) => {
    setCurrentUserState(user);
    setCurrentUser(user?.id || null);
  };

  const loginGuest = () => {
    const guest = loginAsGuest();
    setCurrentUserState(guest);
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentUserState(null);
  };

  if (!mounted) {
    return null;
  }

  return (
    <AppContext.Provider value={{ currentUser, setUser, loginGuest, logout }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
