import React from "react";
import { Pass } from "@/context/PassContext";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QRCodeSVG } from "qrcode.react";
import { format } from "date-fns";
import { Clock, Calendar, MapPin, AlertCircle, CheckCircle2, XCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PassCardProps {
  pass: Pass;
  showQR?: boolean;
  className?: string;
}

export function PassCard({ pass, showQR = false, className }: PassCardProps) {
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED": return "bg-success text-success-foreground hover:bg-success/90";
      case "PENDING": return "bg-warning text-warning-foreground hover:bg-warning/90";
      case "REJECTED": return "bg-destructive text-destructive-foreground hover:bg-destructive/90";
      case "USED": return "bg-muted text-muted-foreground hover:bg-muted/90";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "APPROVED": return <CheckCircle2 size={14} className="mr-1" />;
      case "PENDING": return <Clock size={14} className="mr-1" />;
      case "REJECTED": return <XCircle size={14} className="mr-1" />;
      case "USED": return <CheckCircle2 size={14} className="mr-1" />;
      default: return null;
    }
  };

  // Data to encode in QR
  const qrData = JSON.stringify({
    passId: pass.id,
    usn: pass.usn
  });

  return (
    <Card className={`overflow-hidden transition-all hover:shadow-md ${className} ${pass.status === 'APPROVED' && showQR ? 'border-l-4 border-l-success' : ''}`}>
      <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {pass.id}
            </Badge>
            <Badge className={`${getStatusColor(pass.status)} border-0 flex items-center px-2 py-0.5 text-xs font-medium`}>
              {getStatusIcon(pass.status)}
              {pass.status}
            </Badge>
          </div>
          <CardTitle className="text-lg font-bold leading-tight mt-2">
            {pass.reason}
          </CardTitle>
        </div>
        {showQR && pass.status === "APPROVED" && (
           <div className="hidden sm:block">
              <QRCodeSVG value={qrData} size={60} level="M" />
           </div>
        )}
      </CardHeader>
      
      <CardContent className="pb-3 grid gap-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center text-muted-foreground">
            <Calendar className="mr-2 h-4 w-4 text-primary/70" />
            <span className="font-medium text-foreground">{format(new Date(pass.date), "MMM dd, yyyy")}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Clock className="mr-2 h-4 w-4 text-primary/70" />
            <span className="font-medium text-foreground">{pass.timeOut}</span>
          </div>
          <div className="col-span-2 flex items-center text-muted-foreground">
            <User className="mr-2 h-4 w-4 text-primary/70" />
            <span className="truncate">{pass.studentName} ({pass.usn})</span>
          </div>
        </div>

        {pass.status === "REJECTED" && pass.rejectionReason && (
          <div className="bg-destructive/10 p-3 rounded-md flex items-start gap-3 text-sm text-destructive mt-2">
             <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
             <p>Reason: {pass.rejectionReason}</p>
          </div>
        )}
        
        {/* Mobile QR display (prominent if approved) */}
        {showQR && pass.status === "APPROVED" && (
          <div className="sm:hidden mt-4 flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg border border-dashed border-slate-200">
             <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-widest">Show to Security</p>
             <QRCodeSVG value={qrData} size={150} level="H" className="bg-white p-2 rounded-md shadow-sm" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}