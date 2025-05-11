
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'sonner';

// Public pages
import Home from './pages/Home';
import Register from './pages/auth/Register';
import AdminRegister from './pages/auth/AdminRegister';
import Login from './pages/auth/Login';
import Destinations from './pages/Destinations';
import DestinationDetail from './pages/DestinationDetail';

// Admin pages
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import DestinationsList from './pages/admin/Destinations';
import DestinationForm from './pages/admin/DestinationForm';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route index element={<Home />} />
          <Route path="register" element={<Register />} />
          <Route path="admin/register" element={<AdminRegister />} />
          <Route path="login" element={<Login />} />
          <Route path="destinasi" element={<Destinations />} />
          <Route path="destinasi/:id" element={<DestinationDetail />} />

          {/* Admin routes */}
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="destinations" element={<DestinationsList />} />
            <Route path="destinations/new" element={<DestinationForm />} />
          </Route>
        </Routes>
        <Toaster position="top-right" />
      </Router>
    </AuthProvider>
  );
}

export default App;
