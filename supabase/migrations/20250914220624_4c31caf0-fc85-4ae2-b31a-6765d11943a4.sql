-- Insert sample promotions data into the promotions table
INSERT INTO promotions (title, description, promo_code, discount_percentage, start_date, end_date, is_active, category, image_url) VALUES
('Diskon 25% untuk Destinasi Pantai', 'Dapatkan diskon 25% untuk tiket masuk destinasi pantai pilihan di seluruh Indonesia. Nikmati liburan dengan harga spesial!', 'BEACH25', 25, '2025-01-01', '2025-06-30', true, 'Seasonal', 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'),
('Paket Keluarga: Beli 3 Dapat 1 Gratis', 'Beli 3 tiket dewasa dan dapatkan 1 tiket anak gratis untuk destinasi pilihan. Perfect untuk keluarga!', 'FAMILY4', 0, '2025-01-01', '2025-05-31', true, 'Family', 'https://images.unsplash.com/photo-1581417478175-a9ef18f210c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'),
('Flash Sale: Diskon 50% untuk 100 Pembeli Pertama', 'Diskon 50% untuk 100 pembeli pertama di destinasi wisata Taman Nasional. Jangan sampai terlewat!', 'FLASH50', 50, '2025-01-01', '2025-04-15', true, 'Flash Sale', 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'),
('Paket Hemat Long Weekend', 'Hemat 30% untuk kunjungan di akhir pekan panjang. Berlaku di semua destinasi pilihan dengan fasilitas terbaik.', 'WEEKEND30', 30, '2025-01-01', '2025-07-31', true, 'Weekend', 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'),
('Promo Spesial Ulang Tahun', 'Gratis tiket masuk pada hari ulang tahun Anda dengan menunjukkan KTP. Rayakan hari spesial Anda!', 'BIRTHDAY', 100, '2025-01-01', '2025-12-31', true, 'Special', 'https://images.unsplash.com/photo-1513151233558-d860c5398176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'),
('Diskon 40% untuk 10 Destinasi Terbaik', 'Nikmati liburan dengan harga spesial! Booking sekarang untuk perjalanan hingga akhir tahun dengan destinasi terpilih.', 'TOP40', 40, '2025-01-01', '2025-12-31', true, 'Featured', 'https://images.unsplash.com/photo-1576085898323-218337e3e43c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80');

-- Create a help_categories table for better organization
CREATE TABLE help_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  icon VARCHAR,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create a help_articles table for FAQ content
CREATE TABLE help_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES help_categories(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert help categories
INSERT INTO help_categories (name, icon, display_order) VALUES
('Akun dan Profil', 'user', 1),
('Pemesanan Tiket', 'ticket', 2),
('Pembayaran', 'credit-card', 3),
('E-Tiket', 'qr-code', 4),
('Pembatalan & Refund', 'arrow-left', 5),
('Penggunaan Website', 'help-circle', 6);

-- Insert sample help articles
WITH categories AS (
  SELECT id, name FROM help_categories
)
INSERT INTO help_articles (category_id, question, answer, display_order, is_featured)
SELECT 
  c.id,
  qa.question,
  qa.answer,
  qa.display_order,
  qa.is_featured
FROM categories c
CROSS JOIN (
  VALUES 
    ('Akun dan Profil', 'Bagaimana cara mendaftar akun di WisataJelajah?', 'Untuk mendaftar, klik tombol "Daftar" di pojok kanan atas halaman. Isi formulir pendaftaran dengan nama, email, dan password Anda. Kemudian ikuti instruksi verifikasi email yang dikirimkan ke alamat email Anda.', 1, true),
    ('Akun dan Profil', 'Bagaimana cara mengubah password saya?', 'Masuk ke akun Anda, klik profil di pojok kanan atas, pilih "Pengaturan Akun", kemudian pilih tab "Keamanan". Di sana Anda dapat mengubah password dengan memasukkan password lama dan password baru Anda.', 2, false),
    ('Pemesanan Tiket', 'Bagaimana cara memesan tiket wisata?', 'Pilih destinasi wisata yang ingin Anda kunjungi, pilih tanggal kunjungan dan jumlah tiket, kemudian klik "Beli Tiket". Ikuti langkah selanjutnya untuk menyelesaikan pembayaran dan menerima e-tiket.', 1, true),
    ('Pemesanan Tiket', 'Apakah saya bisa mengubah tanggal kunjungan setelah memesan?', 'Ya, untuk sebagian besar tiket, Anda dapat mengubah tanggal kunjungan melalui halaman "Pesanan Saya". Namun, beberapa destinasi memiliki kebijakan tersendiri dan mungkin mengenakan biaya perubahan.', 2, false),
    ('Pembayaran', 'Apa saja metode pembayaran yang tersedia?', 'Kami menerima berbagai metode pembayaran termasuk kartu kredit/debit, transfer bank, e-wallet (GoPay, OVO, DANA, LinkAja), dan virtual account dari berbagai bank.', 1, true),
    ('Pembayaran', 'Berapa lama batas waktu pembayaran?', 'Batas waktu pembayaran adalah 1 jam untuk metode pembayaran virtual account dan 15 menit untuk metode pembayaran lainnya. Jika tidak dibayar dalam tenggat waktu tersebut, pesanan akan otomatis dibatalkan.', 2, false)
) AS qa(category_name, question, answer, display_order, is_featured)
WHERE c.name = qa.category_name;