
import { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, Search as SearchIcon, LogOut, Settings } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/context/AuthContext';
import { signOut } from '@/integrations/supabase/auth';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const { user, isLoading, isAuthenticated } = useAuth();
  const accountMenuRef = useRef(null);
  const accountButtonRef = useRef(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    const checkAdminRole = async () => {
      if (isAuthenticated && user) {
        try {
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (profileData && profileData.role === 'admin') {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        } catch (error) {
          console.error('Error checking admin role:', error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    };

    checkAdminRole();
  }, [isAuthenticated, user]);

  // Add click outside handler to close the account menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        accountMenuRef.current && 
        !accountMenuRef.current.contains(event.target) &&
        accountButtonRef.current &&
        !accountButtonRef.current.contains(event.target)
      ) {
        setShowAccountMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    await signOut();
    // Auth state changes will be handled by the AuthContext
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      try {
        const { data, error } = await supabase
          .from('destinations')
          .select('*')
          .ilike('name', `%${searchQuery}%`)
          .or(`location.ilike.%${searchQuery}%`);

        if (error) throw error;

        if (data && data.length > 0) {
          setSearchResults(data);
          navigate(`/destinasi?q=${encodeURIComponent(searchQuery)}`);
          setIsSearchOpen(false);
          setSearchQuery('');
        } else {
          toast({
            title: "Tidak ditemukan",
            description: `Tidak ada destinasi dengan kata kunci "${searchQuery}"`,
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Error searching destinations:", error);
        toast({
          title: "Error",
          description: "Terjadi kesalahan saat mencari destinasi",
          variant: "destructive"
        });
      }
    }
  };

  const toggleAccountMenu = () => {
    setShowAccountMenu(!showAccountMenu);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container-custom flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center">
          <NavLink to="/" className="flex items-center">
            <span className="text-xl font-poppins font-bold text-primary">Wisata<span className="text-secondary">Jelajah</span></span>
          </NavLink>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <NavLink to="/" className="font-medium text-gray-700 hover:text-primary transition-colors">
            Beranda
          </NavLink>
          <NavLink to="/destinasi" className="font-medium text-gray-700 hover:text-primary transition-colors">
            Destinasi
          </NavLink>
          <NavLink to="/promo" className="font-medium text-gray-700 hover:text-primary transition-colors">
            Promo
          </NavLink>
          <NavLink to="/bantuan" className="font-medium text-gray-700 hover:text-primary transition-colors">
            Bantuan
          </NavLink>
        </div>

        {/* User Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsSearchOpen(true)}
          >
            <SearchIcon className="h-5 w-5 text-gray-600" />
          </Button>
          
          {isAuthenticated ? (
            <div className="relative">
              <Button 
                ref={accountButtonRef}
                variant="outline" 
                className="flex items-center gap-2"
                onClick={toggleAccountMenu}
              >
                <User className="h-4 w-4" />
                <span>Akun Saya</span>
              </Button>
              
              {showAccountMenu && (
                <div 
                  ref={accountMenuRef}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
                >
                  <Link 
                    to="/dashboard" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowAccountMenu(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/profile" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowAccountMenu(false)}
                  >
                    Profil Saya
                  </Link>
                  <Link 
                    to="/bookings" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowAccountMenu(false)}
                  >
                    Pesanan Saya
                  </Link>
                  <Link 
                    to="/saved-destinations" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowAccountMenu(false)}
                  >
                    Destinasi Tersimpan
                  </Link>
                  {isAdmin && (
                    <Link 
                      to="/admin" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowAccountMenu(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <div className="border-t border-gray-100 my-1"></div>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setShowAccountMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Masuk</span>
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-primary hover:bg-primary/90">
                  Daftar
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMenu}
            className="text-gray-700 hover:text-primary focus:outline-none"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg animate-fade-in">
          <div className="px-4 py-2 space-y-3">
            <NavLink to="/" className="block py-2 font-medium text-gray-700 hover:text-primary" onClick={toggleMenu}>
              Beranda
            </NavLink>
            <NavLink to="/destinasi" className="block py-2 font-medium text-gray-700 hover:text-primary" onClick={toggleMenu}>
              Destinasi
            </NavLink>
            <NavLink to="/promo" className="block py-2 font-medium text-gray-700 hover:text-primary" onClick={toggleMenu}>
              Promo
            </NavLink>
            <NavLink to="/bantuan" className="block py-2 font-medium text-gray-700 hover:text-primary" onClick={toggleMenu}>
              Bantuan
            </NavLink>
            <div className="pt-3 border-t border-gray-200">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="block py-2 font-medium text-gray-700 hover:text-primary" onClick={toggleMenu}>
                    Dashboard
                  </Link>
                  <Link to="/profile" className="block py-2 font-medium text-gray-700 hover:text-primary" onClick={toggleMenu}>
                    Profil Saya
                  </Link>
                  <Link to="/bookings" className="block py-2 font-medium text-gray-700 hover:text-primary" onClick={toggleMenu}>
                    Pesanan Saya
                  </Link>
                  <Link to="/saved-destinations" className="block py-2 font-medium text-gray-700 hover:text-primary" onClick={toggleMenu}>
                    Destinasi Tersimpan
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" className="block py-2 font-medium text-gray-700 hover:text-primary bg-gray-100 rounded px-2" onClick={toggleMenu}>
                      <div className="flex items-center">
                        <Settings className="h-4 w-4 mr-2" />
                        Admin Dashboard
                      </div>
                    </Link>
                  )}
                  <button 
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }}
                    className="block w-full text-left py-2 font-medium text-gray-700 hover:text-primary"
                  >
                    <div className="flex items-center">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </div>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block w-full mb-2" onClick={toggleMenu}>
                    <Button variant="outline" className="w-full">
                      <User className="h-4 w-4 mr-2" />
                      Masuk
                    </Button>
                  </Link>
                  <Link to="/register" className="block w-full" onClick={toggleMenu}>
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      Daftar
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Search Dialog */}
      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cari Destinasi</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Cari destinasi wisata..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Button type="submit">Cari</Button>
          </form>
        </DialogContent>
      </Dialog>
    </nav>
  );
};

export default Navbar;
