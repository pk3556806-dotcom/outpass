import React, { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface QRCodeScannerProps {
  onScanSuccess: (decodedText: string, decodedResult: any) => void;
  onScanFailure?: (error: any) => void;
}

export const QRCodeScanner: React.FC<QRCodeScannerProps> = ({
  onScanSuccess,
  onScanFailure,
}) => {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Clean up previous instance if any
    if (scannerRef.current) {
      scannerRef.current.clear().catch(console.error);
    }

    const scannerId = "reader";

    // Only initialize if element exists
    if (document.getElementById(scannerId)) {
        try {
            const scanner = new Html5QrcodeScanner(
                scannerId,
                {
                  fps: 10,
                  qrbox: { width: 250, height: 250 },
                  aspectRatio: 1.0,
                  showTorchButtonIfSupported: true,
                  formatsToSupport: [ Html5QrcodeSupportedFormats.QR_CODE ]
                },
                /* verbose= */ false
              );
          
              scanner.render(
                  (decodedText, decodedResult) => {
                      // console.log("Scan success:", decodedText);
                      onScanSuccess(decodedText, decodedResult);
                      // Optional: pause scanning after success?
                      // scanner.pause(); 
                  }, 
                  (errorMessage) => {
                      // console.log("Scan failure:", errorMessage);
                      if (onScanFailure) onScanFailure(errorMessage);
                  }
              );
              
              scannerRef.current = scanner;
        } catch (e) {
            console.error("Error initializing scanner", e);
            setError("Camera access denied or not supported.");
        }
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
      }
    };
  }, []);

  return (
    <div className="w-full max-w-md mx-auto">
      {error && (
          <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded-md flex items-center gap-2">
              <AlertCircle size={18} />
              <span>{error}</span>
          </div>
      )}
      <Card className="overflow-hidden bg-black border-0 shadow-xl">
        <div id="reader" className="w-full h-full min-h-[300px] bg-black text-white"></div>
      </Card>
      <p className="text-center text-sm text-muted-foreground mt-4">
        Place the QR code within the frame to scan.
      </p>
    </div>
  );
};
