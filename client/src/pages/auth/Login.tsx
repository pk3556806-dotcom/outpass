import React, { useState } from "react";
import { useAuth, Role } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldCheck, GraduationCap, UserCog } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const [usn, setUsn] = useState("4CE23CS045");
  const [password, setPassword] = useState("password");
  const [loading, setLoading] = useState(false);

  const handleLogin = (role: Role) => {
    setLoading(true);
    // Simulate network delay
    setTimeout(() => {
      login(role, role === "STUDENT" ? usn : "");
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
         <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]"></div>
         <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl mix-blend-multiply animate-blob"></div>
         <div className="absolute top-20 right-20 w-72 h-72 bg-purple-200/40 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-2000"></div>
         <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-200/40 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-bold text-primary mb-2 tracking-tight">CampusPass</h1>
          <p className="text-muted-foreground text-lg">Secure Out-Pass Management System</p>
        </div>

        <Card className="shadow-xl border-white/50 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">Select your role to login</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="student" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="student" className="flex gap-2">
                  <GraduationCap size={16} /> Student
                </TabsTrigger>
                <TabsTrigger value="warden" className="flex gap-2">
                  <UserCog size={16} /> Warden
                </TabsTrigger>
                <TabsTrigger value="security" className="flex gap-2">
                  <ShieldCheck size={16} /> Security
                </TabsTrigger>
              </TabsList>

              <TabsContent value="student">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="usn">USN</Label>
                    <Input 
                      id="usn" 
                      placeholder="4CE23CS..." 
                      value={usn} 
                      onChange={(e) => setUsn(e.target.value)} 
                      className="bg-white/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-student">Password</Label>
                    <Input 
                      id="password-student" 
                      type="password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-white/50" 
                    />
                  </div>
                  <Button className="w-full" onClick={() => handleLogin("STUDENT")} disabled={loading}>
                    {loading ? "Logging in..." : "Student Login"}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground mt-2">
                    Demo USN: 4CE23CS045
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="warden">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username-warden">Username</Label>
                    <Input id="username-warden" defaultValue="warden_admin" className="bg-white/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-warden">Password</Label>
                    <Input id="password-warden" type="password" defaultValue="admin123" className="bg-white/50" />
                  </div>
                  <Button className="w-full" onClick={() => handleLogin("WARDEN")} disabled={loading}>
                    {loading ? "Logging in..." : "Warden Login"}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="security">
                 <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username-security">Guard ID</Label>
                    <Input id="username-security" defaultValue="SEC001" className="bg-white/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-security">Password</Label>
                    <Input id="password-security" type="password" defaultValue="secure123" className="bg-white/50" />
                  </div>
                  <Button className="w-full" onClick={() => handleLogin("SECURITY")} disabled={loading}>
                    {loading ? "Logging in..." : "Security Login"}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center pb-6">
            <p className="text-xs text-muted-foreground">System v1.0 • Campus Safety Initiative</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}