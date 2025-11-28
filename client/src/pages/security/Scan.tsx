import React, { useState } from "react";
import { usePass } from "@/context/PassContext";
import { QRCodeScanner } from "@/components/QRCodeScanner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PassCard } from "@/components/PassCard";

export default function SecurityScan() {
  const { validatePass, markAsUsed } = usePass();
  const { toast } = useToast();
  const [scanResult, setScanResult] = useState<{ valid: boolean; message: string; pass?: any } | null>(null);
  const [scanning, setScanning] = useState(true);

  const handleScan = (decodedText: string) => {
    if (!scanning) return;
    
    try {
      const data = JSON.parse(decodedText);
      if (!data.passId || !data.usn) {
        throw new Error("Invalid QR Data");
      }

      const result = validatePass(data.passId, data.usn);
      setScanResult(result);
      setScanning(false);
      
      if (result.valid) {
         // Auto mark as used if valid? Or let guard click? Prompt says "Security can mark the pass as Used after scanning"
         // Let's give them a button to confirm entry/exit
      }

    } catch (e) {
      setScanResult({ valid: false, message: "Invalid QR Code Format" });
      setScanning(false);
    }
  };

  const handleMarkUsed = () => {
    if (scanResult?.pass) {
        const res = markAsUsed(scanResult.pass.id);
        if (res.success) {
            toast({
                title: "Entry/Exit Recorded",
                description: "Student movement has been logged.",
                className: "bg-green-600 text-white border-none"
            });
            setScanResult(prev => prev ? { ...prev, pass: { ...prev.pass, status: "USED" } } : null);
        } else {
            toast({
                title: "Error",
                description: res.message,
                variant: "destructive"
            });
        }
    }
  };

  const resetScan = () => {
    setScanResult(null);
    setScanning(true);
  };

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-display font-bold text-primary tracking-tight">Security Checkpoint</h2>
        <p className="text-muted-foreground">Scan student QR codes for entry/exit validation.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Scanner Section */}
        <div className="flex flex-col gap-4">
           <Card className={`border-2 ${scanning ? 'border-primary/50 shadow-lg shadow-primary/10' : 'border-border'}`}>
              <CardHeader className="pb-2">
                 <CardTitle className="text-lg flex items-center gap-2">
                    <span className={`h-3 w-3 rounded-full ${scanning ? 'bg-red-500 animate-pulse' : 'bg-slate-300'}`}></span>
                    Live Scanner
                 </CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                 {scanning ? (
                    <QRCodeScanner onScanSuccess={handleScan} />
                 ) : (
                    <div className="h-[300px] bg-slate-100 rounded-lg flex flex-col items-center justify-center text-muted-foreground">
                       <p>Scanning Paused</p>
                       <Button variant="outline" className="mt-4" onClick={resetScan}>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Scan New Code
                       </Button>
                    </div>
                 )}
              </CardContent>
           </Card>
        </div>

        {/* Result Section */}
        <div className="flex flex-col gap-4">
           {scanResult ? (
              <Card className={`border-t-4 shadow-xl h-full ${scanResult.valid ? 'border-t-green-500' : 'border-t-red-500'}`}>
                 <CardHeader>
                    <CardTitle className={`text-2xl flex items-center gap-2 ${scanResult.valid ? 'text-green-600' : 'text-red-600'}`}>
                       {scanResult.valid ? <CheckCircle size={32} /> : <XCircle size={32} />}
                       {scanResult.valid ? "ALLOWED" : "DENIED"}
                    </CardTitle>
                    <CardDescription className="text-lg font-medium text-foreground">
                       {scanResult.message}
                    </CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-6">
                    {scanResult.pass && (
                        <div className="space-y-4">
                           <PassCard pass={scanResult.pass} showQR={false} className="border-0 shadow-none bg-slate-50" />
                           
                           {scanResult.valid && scanResult.pass.status === "APPROVED" && (
                               <Button className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-lg" onClick={handleMarkUsed}>
                                  Confirm Entry/Exit
                               </Button>
                           )}
                           
                           {scanResult.pass.status === "USED" && (
                               <div className="p-3 bg-muted text-muted-foreground rounded text-center font-medium">
                                   Already Processed
                               </div>
                           )}
                        </div>
                    )}
                    
                    {!scanResult.pass && (
                        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground bg-slate-50 rounded-lg border border-dashed">
                           <AlertTriangle size={32} className="mb-2 text-amber-500" />
                           <p>No pass data found.</p>
                        </div>
                    )}
                 </CardContent>
              </Card>
           ) : (
              <Card className="h-full border-dashed bg-slate-50/50 flex items-center justify-center text-center p-8">
                 <div className="max-w-[200px]">
                    <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                       <CheckCircle size={32} />
                    </div>
                    <h3 className="font-medium text-lg mb-2">Ready to Scan</h3>
                    <p className="text-sm text-muted-foreground">Scan a student's QR code to see details and validate their pass.</p>
                 </div>
              </Card>
           )}
        </div>
      </div>
    </div>
  );
}