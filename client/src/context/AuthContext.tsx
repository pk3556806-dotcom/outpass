import React, { createContext, useContext, useState, ReactNode } from "react";
import { useLocation } from "wouter";

export type Role = "STUDENT" | "WARDEN" | "SECURITY" | null;

interface User {
  id: string;
  name: string;
  role: Role;
  usn?: string; // Only for students
}

interface AuthContextType {
  user: User | null;
  login: (role: Role, username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock Users
const MOCK_STUDENT = { id: "S1", name: "Rahul Sharma", role: "STUDENT" as const, usn: "4CE23CS045" };
const MOCK_WARDEN = { id: "W1", name: "Dr. Patil", role: "WARDEN" as const };
const MOCK_SECURITY = { id: "G1", name: "Guard Officer", role: "SECURITY" as const };

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [_, setLocation] = useLocation();

  const login = (role: Role, username: string) => {
    // Simple mock login logic
    if (role === "STUDENT") {
      setUser({ ...MOCK_STUDENT, usn: username || MOCK_STUDENT.usn });
      setLocation("/student/dashboard");
    } else if (role === "WARDEN") {
      setUser(MOCK_WARDEN);
      setLocation("/warden/dashboard");
    } else if (role === "SECURITY") {
      setUser(MOCK_SECURITY);
      setLocation("/security/scan");
    }
  };

  const logout = () => {
    setUser(null);
    setLocation("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}