
import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, User, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // This would come from your auth context in a real app
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Toggle this for testing login/logout state
  const toggleLoginState = () => {
    setIsLoggedIn(!isLoggedIn);
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
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5 text-gray-600" />
          </Button>
          
          {isLoggedIn ? (
            <div className="relative group">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => toggleLoginState()} // In a real app, this would open a dropdown menu
              >
                <User className="h-4 w-4" />
                <span>Akun Saya</span>
              </Button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                <Link 
                  to="/profile" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profil Saya
                </Link>
                <Link 
                  to="/bookings" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Pesanan Saya
                </Link>
                <Link 
                  to="/saved" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Destinasi Tersimpan
                </Link>
                <div className="border-t border-gray-100 my-1"></div>
                <button 
                  onClick={toggleLoginState}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
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
              {isLoggedIn ? (
                <>
                  <Link to="/profile" className="block py-2 font-medium text-gray-700 hover:text-primary" onClick={toggleMenu}>
                    Profil Saya
                  </Link>
                  <Link to="/bookings" className="block py-2 font-medium text-gray-700 hover:text-primary" onClick={toggleMenu}>
                    Pesanan Saya
                  </Link>
                  <Link to="/saved" className="block py-2 font-medium text-gray-700 hover:text-primary" onClick={toggleMenu}>
                    Destinasi Tersimpan
                  </Link>
                  <button 
                    onClick={() => {
                      toggleLoginState();
                      toggleMenu();
                    }}
                    className="block w-full text-left py-2 font-medium text-gray-700 hover:text-primary"
                  >
                    Logout
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
    </nav>
  );
};

export default Navbar;
