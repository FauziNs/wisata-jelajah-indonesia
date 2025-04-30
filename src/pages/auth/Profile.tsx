
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Edit, 
  Lock, 
  Ticket, 
  Heart, 
  Calendar,
  LogOut,
  Trash,
  Star,
  Upload
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: 'Andi Wijaya',
    email: 'andi.wijaya@email.com',
    phone: '+62 812 3456 7890',
    address: 'Jl. Sudirman No. 123, Jakarta Pusat, DKI Jakarta',
    profileImage: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
  });
  
  const [tempProfileData, setTempProfileData] = useState(profileData);
  const [newProfileImage, setNewProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const bookingHistory = [
    {
      id: 'TRX1234567',
      destinationName: 'Pantai Kuta',
      destinationImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      date: '2024-05-15',
      ticketType: 'Dewasa',
      quantity: 2,
      totalPrice: 'Rp 100.000',
      status: 'completed',
      rating: 5
    },
    {
      id: 'TRX7654321',
      destinationName: 'Candi Borobudur',
      destinationImage: 'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      date: '2024-06-20',
      ticketType: 'Domestik',
      quantity: 3,
      totalPrice: 'Rp 150.000',
      status: 'upcoming'
    }
  ];
  
  const savedDestinations = [
    {
      id: 1,
      name: 'Raja Ampat',
      image: 'https://images.unsplash.com/photo-1573790387438-4da905039392?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      location: 'Papua Barat',
      price: 'Rp 500.000'
    },
    {
      id: 2,
      name: 'Gunung Bromo',
      image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      location: 'Jawa Timur',
      price: 'Rp 120.000'
    }
  ];

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTempProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = () => {
    setProfileData(tempProfileData);
    if (profileImagePreview) {
      setProfileData(prev => ({
        ...prev,
        profileImage: profileImagePreview
      }));
    }
    setIsEditing(false);
    toast({
      title: "Profil berhasil diperbarui",
      description: "Data profil Anda telah disimpan"
    });
  };

  const handleCancelEdit = () => {
    setTempProfileData(profileData);
    setNewProfileImage(null);
    setProfileImagePreview(null);
    setIsEditing(false);
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Konfirmasi password tidak cocok",
        description: "Password baru dan konfirmasi password harus sama",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, you would make an API call to update the password
    console.log('Updating password:', passwordData);
    
    toast({
      title: "Password berhasil diperbarui",
      description: "Password Anda telah diperbarui"
    });
    
    // Reset form
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="bg-primary/10 py-8 md:py-12">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md">
                <img 
                  src={profileData.profileImage} 
                  alt={profileData.fullName} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{profileData.fullName}</h1>
              <div className="flex items-center mt-2 text-gray-600">
                <Mail className="h-4 w-4 mr-2" />
                <span>{profileData.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container-custom py-8 md:py-12">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <Ticket className="h-4 w-4" />
              Riwayat Pesanan
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Tersimpan
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold">Informasi Profil</h2>
                      {!isEditing && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setIsEditing(true)}
                          className="flex items-center gap-2"
                        >
                          <Edit className="h-4 w-4" />
                          Edit Profil
                        </Button>
                      )}
                    </div>
                    
                    {isEditing ? (
                      <div className="space-y-6">
                        {/* Profile Image Upload */}
                        <div className="flex flex-col items-center">
                          <div className="relative mb-2">
                            <div className="w-24 h-24 rounded-full overflow-hidden border border-gray-200">
                              <img 
                                src={profileImagePreview || profileData.profileImage} 
                                alt={tempProfileData.fullName} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <label 
                              htmlFor="profileImage"
                              className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 cursor-pointer"
                            >
                              <Upload size={14} />
                            </label>
                            <input
                              id="profileImage"
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              className="hidden"
                              onChange={handleImageChange}
                            />
                          </div>
                          <p className="text-xs text-gray-500">
                            Klik untuk mengganti foto profil
                          </p>
                        </div>
                        
                        {/* Form Fields */}
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label htmlFor="fullName" className="text-sm font-medium">
                              Nama Lengkap
                            </label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                              <Input
                                id="fullName"
                                name="fullName"
                                placeholder="Nama lengkap Anda"
                                className="pl-10"
                                value={tempProfileData.fullName}
                                onChange={handleProfileChange}
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium">
                              Email
                            </label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                              <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="email@example.com"
                                className="pl-10"
                                value={tempProfileData.email}
                                onChange={handleProfileChange}
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <label htmlFor="phone" className="text-sm font-medium">
                              Nomor Telepon
                            </label>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                              <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                placeholder="+62 812 3456 7890"
                                className="pl-10"
                                value={tempProfileData.phone}
                                onChange={handleProfileChange}
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <label htmlFor="address" className="text-sm font-medium">
                              Alamat
                            </label>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-3 text-gray-500 h-4 w-4" />
                              <textarea
                                id="address"
                                name="address"
                                placeholder="Masukkan alamat Anda"
                                className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={tempProfileData.address}
                                onChange={handleProfileChange}
                              ></textarea>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 justify-end">
                            <Button variant="outline" onClick={handleCancelEdit}>
                              Batal
                            </Button>
                            <Button onClick={handleSaveProfile}>
                              Simpan Perubahan
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex border-b pb-4">
                          <div className="w-40 text-gray-500">
                            <User className="inline-block h-4 w-4 mr-2" />
                            Nama
                          </div>
                          <div className="flex-1 font-medium">{profileData.fullName}</div>
                        </div>
                        
                        <div className="flex border-b pb-4">
                          <div className="w-40 text-gray-500">
                            <Mail className="inline-block h-4 w-4 mr-2" />
                            Email
                          </div>
                          <div className="flex-1 font-medium">{profileData.email}</div>
                        </div>
                        
                        <div className="flex border-b pb-4">
                          <div className="w-40 text-gray-500">
                            <Phone className="inline-block h-4 w-4 mr-2" />
                            Telepon
                          </div>
                          <div className="flex-1 font-medium">{profileData.phone}</div>
                        </div>
                        
                        <div className="flex">
                          <div className="w-40 text-gray-500">
                            <MapPin className="inline-block h-4 w-4 mr-2" />
                            Alamat
                          </div>
                          <div className="flex-1 font-medium">{profileData.address}</div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card className="mt-8">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-6">Ubah Password</h2>
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="currentPassword" className="text-sm font-medium">
                          Password Saat Ini
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                          <Input
                            id="currentPassword"
                            name="currentPassword"
                            type="password"
                            placeholder="••••••••"
                            className="pl-10"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="newPassword" className="text-sm font-medium">
                          Password Baru
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                          <Input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            placeholder="••••••••"
                            className="pl-10"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="confirmPassword" className="text-sm font-medium">
                          Konfirmasi Password Baru
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            className="pl-10"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            required
                          />
                        </div>
                      </div>
                      
                      <Button type="submit" className="w-full">
                        Simpan Password Baru
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card>
                  <CardContent className="p-6 space-y-6">
                    <div className="flex items-center gap-3">
                      <Button variant="outline" className="w-full flex items-center gap-2">
                        <LogOut className="h-4 w-4" />
                        Logout
                      </Button>
                    </div>
                    
                    <div className="border-t pt-6">
                      <h3 className="font-medium text-red-600 mb-3">Zona Berbahaya</h3>
                      <Button 
                        variant="outline" 
                        className="w-full border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center gap-2"
                      >
                        <Trash className="h-4 w-4" />
                        Hapus Akun
                      </Button>
                      <p className="text-xs text-gray-500 mt-2">
                        Tindakan ini akan menghapus akun Anda secara permanen dan tidak dapat dibatalkan.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="bookings">
            <h2 className="text-xl font-semibold mb-6">Riwayat Pemesanan</h2>
            
            {bookingHistory.length > 0 ? (
              <div className="space-y-4">
                {bookingHistory.map((booking) => (
                  <Card key={booking.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col sm:flex-row">
                        <div className="sm:w-[200px] h-[150px]">
                          <img 
                            src={booking.destinationImage} 
                            alt={booking.destinationName} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-5 flex-1">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-semibold">{booking.destinationName}</h3>
                              <p className="text-sm text-gray-500">ID: {booking.id}</p>
                            </div>
                            <div className={`text-sm font-medium ${
                              booking.status === 'completed' ? 'text-green-500' : 
                              booking.status === 'upcoming' ? 'text-blue-500' : 'text-gray-500'
                            }`}>
                              {booking.status === 'completed' ? 'Selesai' : 
                               booking.status === 'upcoming' ? 'Akan Datang' : booking.status}
                            </div>
                          </div>
                          
                          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="block text-gray-500">Tanggal Kunjungan:</span>
                              <span>{new Date(booking.date).toLocaleDateString('id-ID', { 
                                day: 'numeric', 
                                month: 'long', 
                                year: 'numeric' 
                              })}</span>
                            </div>
                            <div>
                              <span className="block text-gray-500">Jenis Tiket:</span>
                              <span>{booking.ticketType} x {booking.quantity}</span>
                            </div>
                            <div>
                              <span className="block text-gray-500">Total:</span>
                              <span className="font-semibold">{booking.totalPrice}</span>
                            </div>
                          </div>
                          
                          <div className="mt-4 flex justify-between items-center">
                            {booking.status === 'completed' ? (
                              <div className="flex items-center">
                                <span className="mr-2 text-sm">Rating:</span>
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star 
                                      key={i} 
                                      className={`h-4 w-4 ${
                                        i < booking.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                                      }`} 
                                    />
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div></div>
                            )}
                            
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                Lihat Detail
                              </Button>
                              
                              {booking.status === 'upcoming' && (
                                <Button size="sm">
                                  Cetak E-Tiket
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <div className="mx-auto w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Ticket className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Belum ada pemesanan
                </h3>
                <p className="text-gray-500 mb-6">
                  Anda belum melakukan pemesanan tiket wisata
                </p>
                <Button>Jelajahi Destinasi</Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="saved">
            <h2 className="text-xl font-semibold mb-6">Destinasi Tersimpan</h2>
            
            {savedDestinations.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedDestinations.map((destination) => (
                  <Card key={destination.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative h-40">
                      <img 
                        src={destination.image} 
                        alt={destination.name} 
                        className="w-full h-full object-cover"
                      />
                      <button className="absolute top-3 right-3 p-1.5 bg-white rounded-full shadow-sm opacity-90 hover:opacity-100">
                        <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                      </button>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold">{destination.name}</h3>
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <MapPin className="h-3.5 w-3.5 mr-1" />
                        <span>{destination.location}</span>
                      </div>
                      <div className="flex justify-between items-center mt-3">
                        <span className="font-medium text-primary">{destination.price}</span>
                        <Button size="sm">Lihat Detail</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <div className="mx-auto w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Belum ada destinasi tersimpan
                </h3>
                <p className="text-gray-500 mb-6">
                  Tambahkan destinasi favorit Anda ke daftar tersimpan
                </p>
                <Button>Jelajahi Destinasi</Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
};

export default Profile;
