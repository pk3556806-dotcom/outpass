import React from "react";
import { usePass } from "@/context/PassContext";
import { useAuth } from "@/context/AuthContext";
import { PassCard } from "@/components/PassCard";
import { Button } from "@/components/ui/button";
import { PlusCircle, History } from "lucide-react";
import { Link } from "wouter";

export default function StudentDashboard() {
  const { user } = useAuth();
  const { getPassesByUsn } = usePass();
  
  if (!user) return null;

  const myPasses = getPassesByUsn(user.usn || "");
  const activePass = myPasses.find(p => p.status === "APPROVED" || p.status === "PENDING");
  const pastPasses = myPasses.filter(p => p.status !== "APPROVED" && p.status !== "PENDING");

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-3xl font-display font-bold text-primary tracking-tight">Student Dashboard</h2>
           <p className="text-muted-foreground">Manage your out-pass requests and view status.</p>
        </div>
        <Link href="/student/apply">
          <Button className="shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
            <PlusCircle className="mr-2 h-4 w-4" />
            Apply for Out-Pass
          </Button>
        </Link>
      </div>

      <div className="grid gap-6">
         {/* Active Pass Section */}
         <section>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
               <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
               Current Status
            </h3>
            {activePass ? (
               <div className="max-w-md">
                 <PassCard pass={activePass} showQR={true} className="border-primary/20 shadow-md" />
               </div>
            ) : (
               <div className="bg-white p-8 rounded-xl border border-dashed border-slate-300 text-center">
                  <div className="h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
                     <PlusCircle size={24} />
                  </div>
                  <h4 className="font-medium text-slate-900">No Active Pass</h4>
                  <p className="text-sm text-slate-500 mb-4">You don't have any pending or approved passes.</p>
                  <Link href="/student/apply">
                    <Button variant="outline" size="sm">Apply Now</Button>
                  </Link>
               </div>
            )}
         </section>

         {/* History Section */}
         {pastPasses.length > 0 && (
           <section className="pt-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-muted-foreground">
                 <History size={18} />
                 History
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 {pastPasses.map(pass => (
                    <PassCard key={pass.id} pass={pass} />
                 ))}
              </div>
           </section>
         )}
      </div>
    </div>
  );
}