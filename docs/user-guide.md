# Panduan Pengguna — Dashboard Power Auto

Dashboard internal Power Auto untuk mengelola listing mobil yang tayang di [powerauto.id](https://powerauto.id).

## Login

1. Buka `https://powerauto.id/login` (atau URL yang diberikan admin).
2. Masukkan email + password akun staff.
3. Lupa password? Klik **Lupa password?** — sistem akan kirim link reset ke email kamu.

> Hanya admin yang bisa membuat akun staff baru. Hubungi admin untuk pendaftaran.

## Peran (Role)

- **Sales** — bisa membuat draft listing sendiri, submit untuk approval, dan revisi listing miliknya. Tidak bisa publish langsung.
- **Admin** — semua hak sales, plus approve/reject, publish langsung, ubah status listing siapa pun, kelola cabang, dan kelola akun.

## Membuat Listing Baru

1. Dashboard → klik **Tambah Listing** (tombol merah kanan atas).
2. Sistem otomatis membuat draft kosong + membawa kamu ke editor.
3. Isi 6 step berikut. **Form auto-save setiap field setelah dipindah/klik keluar** — tidak perlu klik tombol simpan tiap kali.

### Step 1 — Spesifikasi
Brand, model, tahun, warna, transmisi, bahan bakar, kilometer, kondisi, mesin (cc), tenaga (hp), jumlah kursi, jumlah pintu, VIN, plat nomor.

### Step 2 — Harga
- **Harga jual** — yang ditampilkan ke pembeli.
- **Harga pasar** (opsional) — kalau diisi, sistem otomatis tampilkan badge "% OFF" + harga coret di kartu listing publik.

### Step 3 — Deskripsi + Fitur
- Deskripsi minimal 20 karakter. Tulis kondisi unit, history pemakaian, hal-hal yang sales tahu.
- Klik chip fitur untuk pilih yang relevan (AC double blower, ABS, dll).

### Step 4 — Dokumen
- Pemegang STNK + BPKB sesuai dokumen.
- Tanggal jatuh tempo pajak.
- Riwayat servis (opsional, tapi membantu kepercayaan pembeli).

### Step 5 — Foto
- Klik **Tambah foto**. File dipilih dari komputer, sistem otomatis kompres ke max 1600px JPEG sebelum upload.
- Foto pertama otomatis jadi cover. Klik bintang di foto lain untuk ganti cover.
- Hover foto → muncul tombol panah untuk pindah urutan, dan tombol hapus.
- Maksimal 20 foto. Listing tidak bisa di-submit tanpa minimal 1 foto.

### Step 6 — Lokasi & PIC
- **Cabang** — pilih showroom tempat unit berada.
- **Sales PIC** — siapa yang handle inquiry pembeli. Sales user otomatis di-set ke diri sendiri (admin bisa pilih PIC lain).

### Submit
Setelah semua step terisi:
- Klik **Simpan** untuk simpan tanpa ubah status (tetap draft).
- Klik **Submit untuk approval** — listing masuk antrian admin. Status berubah ke "Menunggu approval".
- (Admin saja) **Publish langsung** — skip antrian, langsung tayang di website publik.

> Sistem akan menolak submit kalau ada field wajib kosong dan otomatis loncat ke step yang error. Lengkapi lalu coba lagi.

## Status Listing

| Status | Arti |
|---|---|
| **Draft** | Belum di-submit. Hanya owner + admin yang lihat. |
| **Menunggu approval** | Sudah di-submit oleh sales, sedang menunggu review admin. |
| **Available** | Tayang di website publik. |
| **Reserved** | Sedang dalam proses transaksi. Masih tayang di publik tapi dengan badge "Reserved". |
| **Sold** | Sudah terjual. Tetap tayang dengan badge "Terjual" untuk SEO history. |
| **Rejected** | Admin menolak. Sales bisa baca alasan di banner editor, perbaiki, lalu submit lagi. |
| **Archived** | Dihapus dari sirkulasi tapi data masih ada untuk audit. |

## Halaman Listing

Sidebar → **Listing**. Tabel semua listing:

- **Toggle "Listing saya / Semua"** — sales default lihat punya sendiri.
- **Filter status** — dropdown atas.
- **Search** — cari brand, model, atau plat nomor.
- **Pencet ikon pensil** untuk edit listing.

## Approval (Admin Only)

Sidebar → **Approval**. Badge angka di sidebar menunjukkan jumlah listing menunggu review.

- Klik **Buka** untuk masuk ke editor listing.
- **Approve & publish** → status jadi `available`, langsung tayang.
- **Reject** → muncul dialog minta alasan. Sales akan lihat alasan tsb di banner editor mereka dan bisa revisi.

## Transisi Setelah Tayang

Pada listing `available`:
- **Tandai reserved** — saat ada uang muka / DP.
- **Tandai sold** — saat transaksi selesai.
- **Arsipkan** — kalau listing perlu di-take-down (misalnya ditarik dari pasar).

Pada listing `reserved`:
- **Kembalikan ke available** — kalau reservasi batal.
- **Tandai sold** — kalau transaksi jadi.

## Audit Trail

Setiap perubahan status otomatis tercatat di tabel `listing_audit_log` (database). Admin bisa query database langsung kalau perlu lihat history detail. Sales hanya bisa lihat audit untuk listing miliknya.

## Foto & Cover

- Cover ditentukan oleh flag `is_cover` di tabel `car_images` — hanya satu cover per listing (database enforced).
- Path penyimpanan: `car-images/{car_id}/{uuid}.jpg`.
- URL publik otomatis aktif begitu listing `available` (RLS).

## WhatsApp CTA

Tombol WhatsApp di listing publik otomatis route ke `sales_pic.phone` listing tersebut, dengan pesan pre-filled berisi info mobil. Kalau PIC belum di-set, fallback ke 3-nomor rotasi default (Alfi/Audy/Jimmy).

> Pastikan setiap sales mengisi nomor HP di profile mereka — kalau kosong, customer akan kena fallback dan bukan langsung ke sales yang ditugaskan.

## Troubleshooting

**Submit selalu gagal "Lengkapi data sebelum melanjutkan"** — sistem otomatis loncat ke step yang error. Cek field merah, isi, lalu submit lagi.

**Upload foto gagal** — kemungkinan file terlalu besar atau format aneh. Coba JPG/PNG di bawah 10 MB. Resize otomatis terjadi di browser kamu sebelum upload.

**Tidak bisa edit listing yang sudah tayang** — sales tidak bisa edit listing `available`. Minta admin untuk archive atau kembalikan ke draft dulu.

**Lupa password tapi tidak ada email reset** — Supabase SMTP default rate-limited. Hubungi admin untuk reset manual sampai SMTP custom dikonfigurasi.
