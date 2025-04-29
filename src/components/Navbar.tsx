
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, User, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
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
          <Button variant="outline" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Masuk</span>
          </Button>
          <Button className="bg-primary hover:bg-primary/90">Daftar</Button>
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
              <Button variant="outline" className="w-full mb-2">
                <User className="h-4 w-4 mr-2" />
                Masuk
              </Button>
              <Button className="w-full bg-primary hover:bg-primary/90">
                Daftar
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
