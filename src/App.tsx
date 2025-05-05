
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from "@/components/ui/sonner";

// Pages
import Index from './pages/Index';
import Destinations from './pages/Destinations';
import DestinationDetail from './pages/DestinationDetail';
import Promotions from './pages/Promotions';
import PromotionDetail from './pages/PromotionDetail';
import Help from './pages/Help';
import NotFound from './pages/NotFound';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Profile from './pages/auth/Profile';

// Admin Pages
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminDestinations from './pages/admin/Destinations';
import DestinationForm from './pages/admin/DestinationForm';

// New Pages
import SavedDestinations from './pages/SavedDestinations';
import Bookings from './pages/Bookings';
import Payment from './pages/Payment';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/destinasi" element={<Destinations />} />
          <Route path="/destinasi/:slug" element={<DestinationDetail />} />
          <Route path="/promo" element={<Promotions />} />
          <Route path="/promo/:slug" element={<PromotionDetail />} />
          <Route path="/bantuan" element={<Help />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/saved" element={<SavedDestinations />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/payment" element={<Payment />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="destinations" element={<AdminDestinations />} />
            <Route path="destinations/new" element={<DestinationForm />} />
            <Route path="destinations/edit/:id" element={<DestinationForm />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
        <Sonner position="top-center" />
      </AuthProvider>
    </Router>
  );
}

export default App;
