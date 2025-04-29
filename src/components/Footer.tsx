
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Wisata<span className="text-secondary">Jelajah</span></h3>
            <p className="mb-4 text-sm">
              Platform pemesanan tiket wisata online terpercaya di Indonesia. Nikmati kemudahan pemesanan dan cetak tiket digital maupun fisik.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Link Cepat</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Tentang Kami</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Syarat & Ketentuan</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Kebijakan Privasi</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Hubungi Kami</a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Kategori</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Wisata Alam</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Wisata Budaya</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Wisata Sejarah</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Wisata Hiburan</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Promo Wisata</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Kontak</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-primary mr-2 mt-0.5" />
                <span>Jl. Wisata Indonesia No. 123, Jakarta Pusat, Indonesia</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-primary mr-2" />
                <span>+62 123-4567-8910</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-primary mr-2" />
                <span>info@wisatajelajah.id</span>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-white text-sm font-medium mb-2">Newsletter</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Email Anda"
                  className="bg-gray-800 text-white px-3 py-2 rounded-l-md focus:outline-none flex-1 text-sm"
                />
                <Button className="bg-primary hover:bg-primary/90 rounded-l-none text-white">
                  Daftar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-gray-950 py-4">
        <div className="container-custom text-center text-sm">
          <p>© 2023 WisataJelajah. Hak Cipta Dilindungi.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
