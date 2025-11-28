import React from "react";
import { usePass } from "@/context/PassContext";
import { PassCard } from "@/components/PassCard";
import { Button } from "@/components/ui/button";
import { Check, X, Clock, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function WardenDashboard() {
  const { passes, approvePass, rejectPass } = usePass();
  const { toast } = useToast();

  const pendingPasses = passes.filter(p => p.status === "PENDING");
  const historyPasses = passes.filter(p => p.status !== "PENDING");

  const handleApprove = (id: string) => {
    approvePass(id);
    toast({
      title: "Pass Approved",
      description: `Pass ${id} has been approved successfully.`,
      variant: "default",
      className: "bg-green-600 text-white border-none"
    });
  };

  const handleReject = (id: string) => {
    // In a real app, we'd ask for a reason via a modal
    rejectPass(id, "Administrative decision");
    toast({
      title: "Pass Rejected",
      description: `Pass ${id} has been rejected.`,
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-display font-bold text-primary tracking-tight">Warden Dashboard</h2>
        <p className="text-muted-foreground">Review and manage student out-pass requests.</p>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
          <TabsTrigger value="pending">Pending Requests ({pendingPasses.length})</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-6">
          {pendingPasses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg border border-dashed">
               <CheckCircle2 size={48} className="text-green-500 mb-4" />
               <h3 className="text-lg font-medium">All Caught Up!</h3>
               <p className="text-muted-foreground">There are no pending pass requests to review.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {pendingPasses.map(pass => (
                <div key={pass.id} className="relative group">
                  <PassCard pass={pass} className="h-full pb-16 border-l-4 border-l-amber-400" />
                  <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-100 transition-opacity">
                    <Button 
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg transition-all" 
                      onClick={() => handleApprove(pass.id)}
                    >
                      <Check className="mr-2 h-4 w-4" /> Approve
                    </Button>
                    <Button 
                      variant="destructive" 
                      className="flex-1 shadow-md hover:shadow-lg transition-all"
                      onClick={() => handleReject(pass.id)}
                    >
                      <X className="mr-2 h-4 w-4" /> Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {historyPasses.map(pass => (
               <PassCard key={pass.id} pass={pass} />
             ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}