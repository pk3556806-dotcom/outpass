import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { AuthProvider } from "@/context/AuthContext";
import { PassProvider } from "@/context/PassContext";
import { Layout } from "@/components/Layout";

import Login from "@/pages/auth/Login";
import StudentDashboard from "@/pages/student/Dashboard";
import ApplyPass from "@/pages/student/ApplyPass";
import WardenDashboard from "@/pages/warden/Dashboard";
import SecurityScan from "@/pages/security/Scan";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Login} />
        <Route path="/student/dashboard" component={StudentDashboard} />
        <Route path="/student/apply" component={ApplyPass} />
        <Route path="/warden/dashboard" component={WardenDashboard} />
        <Route path="/security/scan" component={SecurityScan} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PassProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </PassProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
