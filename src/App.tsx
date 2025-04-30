
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import DestinationsList from "./pages/admin/Destinations";
import DestinationForm from "./pages/admin/DestinationForm";

// New pages
import Destinations from "./pages/Destinations";
import DestinationDetail from "./pages/DestinationDetail";
import Promotions from "./pages/Promotions";
import PromotionDetail from "./pages/PromotionDetail";
import Help from "./pages/Help";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Profile from "./pages/auth/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            
            {/* Website Routes */}
            <Route path="/destinasi" element={<Destinations />} />
            <Route path="/destinasi/:slug" element={<DestinationDetail />} />
            <Route path="/promo" element={<Promotions />} />
            <Route path="/promo/:slug" element={<PromotionDetail />} />
            <Route path="/bantuan" element={<Help />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="destinations" element={<DestinationsList />} />
              <Route path="destinations/new" element={<DestinationForm />} />
            </Route>
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
