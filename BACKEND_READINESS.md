# Audit Kesiapan Integrasi Backend

Tanggal: 31 Oktober 2026

Status: **belum siap plug-and-play**. UI, tabel, filter, pagination, dan modal sudah berfungsi sebagai lapisan presentasi, tetapi data masih mock dan aksi CRUD belum tersambung ke backend.

Tidak ada source code yang diubah saat audit ini. Build terakhir (`npm run build`) berhasil.

## Ringkasan

| Area | Status | Catatan |
| --- | --- | --- |
| Tabel aktivitas | Sebagian siap | Data dari props, aksi `compare`/`hide`/`detail` baru sebagian ditangani |
| Tabel divisi | Sebagian siap | Aksi `edit`/`hide`/`detail` belum ditangani |
| Tabel kolaborasi | Sebagian siap | Aksi `edit`/`hide`/`detail` belum ditangani |
| Tabel trashed | Sebagian siap | `restore`/`force-delete`/`detail` belum ditangani |
| Form tambah data | Belum siap | Belum ada `v-model`, submit, reset, atau validasi |
| Modal compare | Sebagian siap | State lokal lengkap, tetapi perubahan belum disimpan ke backend |
| Filter dan pagination | Belum siap untuk server-side | Masih memproses seluruh array di client |
| Auth dan error handling | Belum siap | Belum ada token, guard, loading, atau error state |
| Dashboard | Belum siap | Masih kosong |

## Yang Sudah Siap

- `src/components/ActivitiesTable.vue`, `DivisionsTable.vue`, `CollabsTable.vue`, dan tabel `Trashed*` menerima `items`, `filters`, dan `perPage` lewat props.
- Pencarian, filter tahun/bulan, sorting, dan pagination client-side sudah berjalan.
- `src/components/CompareActivitiesModal.vue` sudah punya draft lokal, validasi pilihan anggaran/lokasi, serta emit `update`.
- `src/helpers/date.js` sudah menangani format tanggal Laravel `Y-m-d H:i:s`.
- Empty state tabel sudah tersedia.
- Komponen form (`InputField`, `DropdownInputField`) sudah mendukung `v-model`.

## Blocker Utama

### 1. Belum ada API layer

Tidak ada axios, service API, base URL, atau environment variable. Pencarian `fetch(`, `axios`, `api.`, `baseURL`, dan `VITE_` di `src/` tidak menemukan hasil.

Data masih berupa array mock di:

- `src/views/ActivitiesView.vue`
- `src/views/CollabsView.vue`
- `src/views/DivisionsView.vue`

### 2. Banyak aksi tabel belum punya handler

- `ActivitiesView.vue` hanya menangani event `compare`. Event `hide` dan `detail` dari `ActivitiesTable` diabaikan.
- `DivisionsView.vue` belum menangani event `edit`, `hide`, dan `detail` dari `DivisionsTable`.
- `CollabsView.vue` belum menangani event `edit`, `hide`, dan `detail` dari `CollabsTable`.
- `TrashedActivitiesTable`, `TrashedDivisionsTable`, dan `TrashedCollabsTable` mengirim event `restore`, `force-delete`, dan `detail`, tetapi belum ada handler di view masing-masing.

Akibatnya tombol aksi tampil, tetapi tidak melakukan apa pun.

### 3. Form belum terhubung

- Field pada form Divisi dan Kolaborasi belum memakai `v-model`.
- Tombol Submit belum punya handler dan tidak berada di dalam `<form>`.
- Tombol Reset belum mengosongkan state apa pun.
- Belum ada validasi client-side maupun tampilan error dari backend.
- Data opsi dropdown masih mock.

### 4. Modal compare membutuhkan endpoint detail

Item pada list aktivitas hanya memiliki relasi divisi. `CompareActivitiesModal` membutuhkan objek lengkap `jabar` dan `brin`, termasuk:

- lembaga, divisi, periode, lokasi, sumber anggaran, total anggaran
- progress, capaian, kendala, rekomendasi
- dokumen KAK, foto, dokumen lain, ringkasan, laporan akhir
- status dan catatan per pihak
- `harmonized` dan timestamp

Backend perlu menyediakan endpoint detail aktivitas sebelum modal dibuka, atau list harus mengembalikan seluruh data tersebut.

### 5. Perubahan modal belum dipersist

`applyCompareUpdate` di `ActivitiesView.vue` hanya mengubah array lokal. Approve, reject, revert, dan harmonize di `CompareActivitiesModal.vue` hanya mengirim payload ke parent. Belum ada request PATCH/POST ke backend.

### 6. Kontrak data belum seragam

- Tabel membaca `status` atau `status_activity`, sedangkan modal membaca `jabar.status` dan `brin.status`.
- Modal menganggap semua status selain `draft` sebagai laporan yang sudah dikirim. Status kosong atau tidak dikenal bisa dianggap terkirim.
- `institution_id` belum di-resolve menjadi nama institusi. Badge PDJB/BRIN di tabel masih hardcoded.
- Field dokumen (`kak`, `foto`, `laporanAkhir`) masih berupa string, belum ada upload atau URL file.
- Response list dari backend kemungkinan berbentuk envelope `{ data, meta }`, sedangkan komponen saat ini mengharapkan array langsung.

### 7. Pagination dan filter masih client-side

Tabel memfilter, menyortir, dan memotong `items` sendiri. Jika backend mengirim satu halaman saja:

- total data pada card menjadi salah
- jumlah halaman menjadi salah
- filter tahun/bulan tidak mencakup seluruh data
- daftar tahun pada toolbar tidak lengkap

Perlu dipilih salah satu pendekatan:

1. Backend mengirim seluruh data sekaligus.
2. Refactor tabel dan toolbar ke server-side pagination/filter.

### 8. Belum ada loading, error, dan submit state

Belum ada:

- skeleton atau loading indicator
- disable tombol saat request berjalan
- penanganan error 401/403/422/500
- retry
- rollback saat submit gagal
- notifikasi sukses/gagal

### 9. Auth belum tersedia

- Belum ada token header, cookie, atau `withCredentials`.
- Belum ada handling 401 dan redirect ke halaman login.
- Belum ada route guard.
- Tombol Keluar di `src/partials/TopBar.vue` hanya menutup menu, belum logout.

### 10. Dashboard masih kosong

`src/views/DashboardView.vue` baru berisi layout dan TopBar. Belum ada data, widget, maupun pemanggilan API.

## Kontrak Backend yang Perlu Disiapkan

### Aktivitas

- `GET /activities` dengan query `page`, `per_page`, `search`, `year`, `month`, `sort`
- `GET /activities/{id}` untuk detail lengkap kedua pihak dan `harmonized`
- `PATCH /activities/{id}` atau endpoint khusus untuk harmonize
- `POST /activities/{id}/sides/{side}/approve`
- `POST /activities/{id}/sides/{side}/reject`
- `POST /activities/{id}/sides/{side}/revert`
- `DELETE /activities/{id}` untuk hide
- `GET /activities/trashed`
- `POST /activities/{id}/restore`
- `DELETE /activities/{id}/force`

### Divisi

- `GET /divisions` dengan filter institusi dan sumber (`jbr`/`mtr`)
- `POST /divisions`
- `PUT/PATCH /divisions/{id}`
- `DELETE /divisions/{id}`
- `GET /divisions/trashed`
- `POST /divisions/{id}/restore`
- `DELETE /divisions/{id}/force`

### Kolaborasi

- `GET /collabs`
- `POST /collabs`
- `PUT/PATCH /collabs/{id}`
- `DELETE /collabs/{id}`
- `GET /collabs/trashed`
- `POST /collabs/{id}/restore`
- `DELETE /collabs/{id}/force`

### Kontrak response yang disarankan

Response list sebaiknya konsisten:

```json
{
  "data": [],
  "meta": {
    "current_page": 1,
    "last_page": 1,
    "per_page": 10,
    "total": 0
  }
}
```

Status aktivitas perlu disepakati satu format, misalnya:

- `draft`
- `proses`
- `disetujui`
- `ditolak`

## Urutan Pengerjaan yang Disarankan

1. Buat API client dan konfigurasi base URL.
2. Sepakati kontrak response list dan detail.
3. Sambungkan fetch data ke semua view, termasuk loading/error/empty state.
4. Sambungkan aksi tabel ke API.
5. Sambungkan form tambah/edit, reset, dan validasi.
6. Tambahkan endpoint detail sebelum membuka modal compare.
7. Sambungkan approve/reject/revert/harmonize ke endpoint persisten.
8. Pindahkan pagination dan filter ke server-side bila data sudah besar.
9. Tambahkan auth, guard, dan handling 401.
10. Isi dashboard dengan data backend.

## Catatan Tambahan

- `src/components/CompareActivitiesModal.vue` memakai `JSON.parse(JSON.stringify(...))` untuk clone. Aman untuk payload JSON, tetapi tidak mempertahankan tipe `Date` atau `undefined`.
- Perubahan pada modal sudah memperbaiki restore `periode` saat harmonize dibatalkan, tetapi penyimpanan akhir tetap bergantung pada backend.
- Komponen tabel saat ini tidak memiliki prop `loading`, `error`, atau `empty` khusus dari server.
