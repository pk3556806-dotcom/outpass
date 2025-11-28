import React, { createContext, useContext, useState, ReactNode } from "react";
import { useAuth } from "./AuthContext";

export type PassStatus = "PENDING" | "APPROVED" | "REJECTED" | "USED";

export interface Pass {
  id: string;
  usn: string;
  studentName: string;
  reason: string;
  date: string;
  timeOut: string;
  status: PassStatus;
  createdAt: string;
  rejectionReason?: string;
}

interface PassContextType {
  passes: Pass[];
  applyForPass: (reason: string, date: string, time: string) => void;
  approvePass: (id: string) => void;
  rejectPass: (id: string, reason: string) => void;
  markAsUsed: (id: string) => { success: boolean; message: string };
  getPassesByUsn: (usn: string) => Pass[];
  getPendingPasses: () => Pass[];
  validatePass: (passId: string, usn: string) => { valid: boolean; message: string; pass?: Pass };
}

const PassContext = createContext<PassContextType | undefined>(undefined);

// Initial Mock Data
const INITIAL_PASSES: Pass[] = [
  {
    id: "PASS0001",
    usn: "4CE23CS045",
    studentName: "Rahul Sharma",
    reason: "Medical Emergency",
    date: "2025-11-29",
    timeOut: "10:30",
    status: "APPROVED",
    createdAt: "2025-11-28T10:00:00Z",
  },
  {
    id: "PASS0002",
    usn: "4CE23CS045",
    studentName: "Rahul Sharma",
    reason: "Weekend Outing",
    date: "2025-12-01",
    timeOut: "09:00",
    status: "PENDING",
    createdAt: "2025-11-28T14:00:00Z",
  },
  {
    id: "PASS0003",
    usn: "4CE23CS099",
    studentName: "Amit Verma",
    reason: "Buying Books",
    date: "2025-11-30",
    timeOut: "16:00",
    status: "PENDING",
    createdAt: "2025-11-28T15:30:00Z",
  }
];

export function PassProvider({ children }: { children: ReactNode }) {
  const [passes, setPasses] = useState<Pass[]>(INITIAL_PASSES);
  const { user } = useAuth();

  const applyForPass = (reason: string, date: string, time: string) => {
    if (!user || user.role !== "STUDENT") return;

    const newPass: Pass = {
      id: `PASS${String(passes.length + 1).padStart(4, '0')}`,
      usn: user.usn || "UNKNOWN",
      studentName: user.name,
      reason,
      date,
      timeOut: time,
      status: "PENDING",
      createdAt: new Date().toISOString(),
    };

    setPasses([newPass, ...passes]);
  };

  const approvePass = (id: string) => {
    setPasses(passes.map(p => p.id === id ? { ...p, status: "APPROVED" } : p));
  };

  const rejectPass = (id: string, reason: string) => {
    setPasses(passes.map(p => p.id === id ? { ...p, status: "REJECTED", rejectionReason: reason } : p));
  };

  const markAsUsed = (id: string) => {
    const pass = passes.find(p => p.id === id);
    if (!pass) return { success: false, message: "Pass not found" };
    if (pass.status === "USED") return { success: false, message: "Pass already used" };
    if (pass.status !== "APPROVED") return { success: false, message: "Pass not approved" };

    setPasses(passes.map(p => p.id === id ? { ...p, status: "USED" } : p));
    return { success: true, message: "Entry/Exit Allowed" };
  };

  const getPassesByUsn = (usn: string) => {
    return passes.filter(p => p.usn === usn);
  };

  const getPendingPasses = () => {
    return passes.filter(p => p.status === "PENDING");
  };

  const validatePass = (passId: string, usn: string) => {
    const pass = passes.find(p => p.id === passId);
    
    if (!pass) {
      return { valid: false, message: "Invalid Pass ID" };
    }
    
    if (pass.usn !== usn) {
      return { valid: false, message: "USN Mismatch" };
    }

    if (pass.status === "REJECTED") {
      return { valid: false, message: "Pass was Rejected" };
    }

    if (pass.status === "PENDING") {
      return { valid: false, message: "Pass is still Pending" };
    }

    if (pass.status === "USED") {
      return { valid: false, message: "Pass Already Used" };
    }

    // Check if date is valid (simple check: pass date should be today or future - but for demo we might relax this)
    // For strictness:
    // const today = new Date().toISOString().split('T')[0];
    // if (pass.date < today) return { valid: false, message: "Pass Expired" };

    return { valid: true, message: "Valid Pass", pass };
  };

  return (
    <PassContext.Provider value={{ 
      passes, 
      applyForPass, 
      approvePass, 
      rejectPass, 
      markAsUsed, 
      getPassesByUsn, 
      getPendingPasses,
      validatePass
    }}>
      {children}
    </PassContext.Provider>
  );
}

export function usePass() {
  const context = useContext(PassContext);
  if (context === undefined) {
    throw new Error("usePass must be used within a PassProvider");
  }
  return context;
}