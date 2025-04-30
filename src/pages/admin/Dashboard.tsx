
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, Users, Map, TrendingUp, Activity, ArrowUp } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div className="py-6">
      <h1 className="text-2xl font-semibold mb-6">Dashboard Admin</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Penjualan</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp 12,345,000</div>
            <p className="text-xs text-muted-foreground">
              +20.1% dari bulan lalu
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Pengguna</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,350</div>
            <p className="text-xs text-muted-foreground">
              +180 pengguna baru minggu ini
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Destinasi Aktif</CardTitle>
            <Map className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <p className="text-xs text-muted-foreground">
              8 destinasi baru ditambahkan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tingkat Konversi</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24%</div>
            <p className="text-xs text-muted-foreground">
              +5% dari bulan lalu
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Penjualan Bulanan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center bg-muted/20">
              <p className="text-muted-foreground">Grafik penjualan akan ditampilkan di sini</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Destinasi Terpopuler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Pantai Kuta, Bali", sales: 456, growth: 12 },
                { name: "Candi Borobudur", sales: 351, growth: 8 },
                { name: "Taman Mini Indonesia Indah", sales: 264, growth: -3 },
                { name: "Kawah Putih, Bandung", sales: 215, growth: 15 },
                { name: "Malioboro, Yogyakarta", sales: 198, growth: 5 },
              ].map((destination, i) => (
                <div key={i} className="flex items-center">
                  <div className="font-medium flex-1">{destination.name}</div>
                  <div className="text-right">
                    <div className="font-medium">{destination.sales}</div>
                    <div className={`flex items-center text-xs ${
                      destination.growth > 0 ? "text-green-600" : "text-red-600"
                    }`}>
                      {destination.growth > 0 ? (
                        <ArrowUp className="h-3 w-3 mr-1" />
                      ) : (
                        <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      )}
                      {Math.abs(destination.growth)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 mt-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Transaksi Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { id: "#TRX-2305", destination: "Pantai Kuta", user: "Ahmad Fadli", amount: "750,000", date: "2023-05-20" },
                { id: "#TRX-2304", destination: "Candi Borobudur", user: "Siti Aminah", amount: "250,000", date: "2023-05-19" },
                { id: "#TRX-2303", destination: "Kawah Putih", user: "Budi Santoso", amount: "450,000", date: "2023-05-19" },
                { id: "#TRX-2302", destination: "Taman Mini", user: "Dewi Lestari", amount: "320,000", date: "2023-05-18" },
                { id: "#TRX-2301", destination: "Malioboro", user: "Eko Prasetyo", amount: "175,000", date: "2023-05-17" },
              ].map((transaction, i) => (
                <div key={i} className="grid grid-cols-4 text-sm border-b pb-2">
                  <div>{transaction.id}</div>
                  <div>{transaction.destination}</div>
                  <div>{transaction.user}</div>
                  <div className="text-right">Rp {transaction.amount}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Terkini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { activity: "Ahmad Fadli menambahkan destinasi baru", time: "10 menit lalu" },
                { activity: "Siti Aminah memperbarui informasi tiket", time: "45 menit lalu" },
                { activity: "Pembayaran baru diterima", time: "1 jam lalu" },
                { activity: "Budi Santoso mengubah status destinasi", time: "2 jam lalu" },
                { activity: "Dewi Lestari menambahkan galeri foto baru", time: "3 jam lalu" },
              ].map((activity, i) => (
                <div key={i} className="flex items-start space-x-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Activity className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{activity.activity}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
