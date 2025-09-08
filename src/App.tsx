
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'sonner';

// Public pages
import Home from './pages/Index';
import Register from './pages/auth/Register';
import AdminRegister from './pages/auth/AdminRegister';
import Login from './pages/auth/Login';
import CustomerDashboard from './pages/CustomerDashboard';
import Destinations from './pages/Destinations';
import DestinationDetail from './pages/DestinationDetail';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';
import Bookings from './pages/Bookings';
import SavedDestinations from './pages/SavedDestinations';
import Profile from './pages/auth/Profile';

// Admin pages
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import DestinationsList from './pages/admin/Destinations';
import DestinationForm from './pages/admin/DestinationForm';
import AdminTransactions from './pages/admin/Transactions';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route index element={<Home />} />
          <Route path="register" element={<Register />} />
          <Route path="admin/register" element={<AdminRegister />} />
          <Route path="login" element={<Login />} />
          <Route path="dashboard" element={<CustomerDashboard />} />
          <Route path="destinasi" element={<Destinations />} />
          <Route path="destinasi/:id" element={<DestinationDetail />} />
          <Route path="payment-success" element={<PaymentSuccess />} />
          <Route path="payment-cancel" element={<PaymentCancel />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="saved-destinations" element={<SavedDestinations />} />
          <Route path="profile" element={<Profile />} />

          {/* Admin routes */}
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="destinations" element={<DestinationsList />} />
            <Route path="destinations/new" element={<DestinationForm />} />
            <Route path="transactions" element={<AdminTransactions />} />
          </Route>
        </Routes>
        <Toaster position="top-right" />
      </AuthProvider>
    </Router>
  );
}

export default App;
