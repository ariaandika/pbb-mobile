# PBB Mobile

tsu gone theese knots

# Data

aplikasi ini didesain untuk lebih dari satu pengguna dengan role sebagai dasar autorisasi

terdapat dua role, bendahara dan anggota

data utama aplikasi ini yaitu transaksi

transaksi memiliki 4 attribut, yaitu nama, kategori, waktu, dan jumlah

# Views

satu halaman menampilkan layar penuh

beberapa bagian tampilan bisa ditumpuk di atas halaman, bagian ini ini disebut vault

menekan kembali akan menutup vault paling atas

halaman Home adalah tampilan dimana aplikasi menampilkan ringkasan dari semua data

halaman Login adalah tampilan ketika pengguna belum login

vault Input adalah tampilan ketika pengguna akan menambahkan transaksi

halaman Bulanan adalah tampilan untuk melaporkan transaksi bulanan

halaman History adalah tampilan untuk semua data secara detail

# Flow

saat aplikasi dibuka, proses autentikasi dilakukan, jika pengguna telah login sebelumnya, vault Home akan ditampilkan, kalau tidak vault Login akan ditampilkan.

vault Home

