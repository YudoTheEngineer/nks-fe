<script setup>
    import { computed, ref } from 'vue';
    import AdminSideBar from '@/partials/AdminSideBar.vue';
    import TopBar from '@/partials/TopBar.vue';
    import Card from '@/components/Card.vue';
    import Toolbar from '@/components/Toolbar.vue';
    import ActivitiesTable from '@/components/ActivitiesTable.vue';
    import TrashedActivitiesTable from '@/components/TrashedActivitiesTable.vue';
    import CompareActivitiesModal from '@/components/CompareActivitiesModal.vue';

    const activeTab = ref('active');
    const filters = ref({ search: '', year: '', month: '', sort: 'terbaru' });
    const perPage = ref('10');

    const activities = ref([
        {
            id: 1,
            title: 'Pengembangan Sistem Energi Terbarukan Berbasis Biomassa',
            jbrDivision: { name: 'Dinas Energi dan Sumber Daya Mineral' },
            mtrDivision: { name: 'Pusat Riset Energi Terbarukan' },
            status: 'proses',
            progress: 85,
            created_at: '2026-10-15 09:30:00',
            updated_at: '2026-10-20 14:15:00',
            harmonized: null,
            jabar: {
                lembaga: 'Perangkat Daerah di Lingkungan Provinsi Jawa Barat',
                divisi: 'Dinas Energi dan Sumber Daya Mineral',
                periode: 'Oktober – Desember 2026',
                lokasi: 'Kota Bandung – Gedung Sate',
                sumber: 'APBD Provinsi Jawa Barat',
                anggaran: 145000000,
                progress: 85,
                capaian: 'Inventarisasi limbah pertanian dan uji kalor biomassa tahap awal rampung.',
                kendala: 'Data produksi biomassa dari dua kabupaten belum lengkap.',
                rekomendasi: 'Sinkronkan data produksi dengan dinas pertanian setempat.',
                kak: 'KAK_PDJabar_1.pdf',
                foto: '9 foto',
                lain: '',
                ringkasan: 'Pemetaan potensi biomassa di lima kabupaten selesai disusun.',
                laporanAkhir: '',
                status: 'proses',
                catatan: ''
            },
            brin: {
                lembaga: 'Badan Riset dan Inovasi Nasional',
                divisi: 'Pusat Riset Energi Terbarukan',
                periode: 'Oktober – Desember 2026',
                lokasi: 'KST Soekarno BRIN Cibinong, Kab. Bogor',
                sumber: 'DIPA BRIN',
                anggaran: 132500000,
                progress: 80,
                capaian: 'Pemodelan konversi biomassa ke energi listrik selesai tahap validasi.',
                kendala: 'Kalibrasi alat gasifikasi menunggu suku cadang.',
                rekomendasi: 'Ajukan pengadaan suku cadang bersamaan dengan jadwal uji berikutnya.',
                kak: 'KAK_BRIN_1.pdf',
                foto: '7 foto',
                lain: '',
                ringkasan: 'Model konversi biomassa sudah diuji pada skala laboratorium.',
                laporanAkhir: '',
                status: 'proses',
                catatan: ''
            }
        },
        {
            id: 2,
            title: 'Riset Kurikulum Berbasis Sains dan Teknologi Terapan',
            jbrDivision: { name: 'Dinas Pendidikan' },
            mtrDivision: { name: 'Pusat Riset Pendidikan' },
            status: 'ditolak',
            progress: 45,
            created_at: '2026-09-20 10:00:00',
            updated_at: '2026-09-20 10:00:00',
            harmonized: null,
            jabar: {
                lembaga: 'Perangkat Daerah di Lingkungan Provinsi Jawa Barat',
                divisi: 'Dinas Pendidikan',
                periode: 'September – November 2026',
                lokasi: 'Kota Bandung – Dinas Pendidikan',
                sumber: 'APBD Provinsi Jawa Barat',
                anggaran: 60000000,
                progress: 45,
                capaian: 'Draf kurikulum terapan untuk 12 sekolah pilot selesai.',
                kendala: 'Rincian anggaran honor narasumber belum dilampirkan.',
                rekomendasi: 'Lengkapi rincian biaya lalu kirim ulang ke admin.',
                kak: 'KAK_PDJabar_2.pdf',
                foto: '4 foto',
                lain: '',
                ringkasan: 'Kurikulum sains terapan tahap pertama sudah disusun.',
                laporanAkhir: '',
                status: 'ditolak',
                catatan: 'Rincian anggaran honor narasumber belum dilampirkan. Lengkapi lalu kirim ulang.'
            },
            brin: {
                lembaga: 'Badan Riset dan Inovasi Nasional',
                divisi: 'Pusat Riset Pendidikan',
                periode: 'September – November 2026',
                lokasi: 'Kota Bandung – Dinas Pendidikan',
                sumber: 'DIPA BRIN',
                anggaran: 60000000,
                progress: 40,
                capaian: 'Validasi instrumen asesmen kurikulum selesai di tiga sekolah.',
                kendala: 'Jadwal pelatihan guru bertabrakan dengan ujian semester.',
                rekomendasi: 'Geser pelatihan ke awal Desember.',
                kak: 'KAK_BRIN_2.pdf',
                foto: '3 foto',
                lain: '',
                ringkasan: 'Instrumen asesmen sudah divalidasi tim peneliti.',
                laporanAkhir: '',
                status: 'proses',
                catatan: ''
            }
        },
        {
            id: 3,
            title: 'Uji Coba Varietas Padi Rendah Emisi Karbon di Lahan Basah',
            jbrDivision: { name: 'Dinas Tanaman Pangan dan Hortikultura' },
            mtrDivision: { name: 'Pusat Riset Tanaman Pangan' },
            status: 'disetujui',
            progress: 100,
            created_at: '2026-08-11 08:30:00',
            updated_at: '2026-10-25 16:40:00',
            harmonized: {
                at: '2026-10-25 16:40:00',
                by: 'Admin',
                from: { anggaran: 'brin', lokasi: 'sama' },
                orig: {
                    jabar: { anggaran: 220000000, lokasi: 'Kab. Subang – Balai Penelitian Padi' },
                    brin: { anggaran: 210000000, lokasi: 'Kab. Subang – Balai Penelitian Padi' }
                }
            },
            jabar: {
                lembaga: 'Perangkat Daerah di Lingkungan Provinsi Jawa Barat',
                divisi: 'Dinas Tanaman Pangan dan Hortikultura',
                periode: 'Agustus – Oktober 2026',
                lokasi: 'Kab. Subang – Balai Penelitian Padi',
                sumber: 'APBD Provinsi Jawa Barat',
                anggaran: 210000000,
                progress: 100,
                capaian: 'Uji coba varietas di 40 hektar lahan basah selesai dipanen.',
                kendala: '',
                rekomendasi: 'Lanjutkan uji multilokasi pada musim tanam berikutnya.',
                kak: 'KAK_PDJabar_3.pdf',
                foto: '12 foto',
                lain: '',
                ringkasan: 'Hasil panen menunjukkan penurunan emisi 18% dari varietas pembanding.',
                laporanAkhir: 'Laporan_Akhir_PDJabar_3.pdf',
                status: 'disetujui',
                catatan: ''
            },
            brin: {
                lembaga: 'Badan Riset dan Inovasi Nasional',
                divisi: 'Pusat Riset Tanaman Pangan',
                periode: 'Agustus – Oktober 2026',
                lokasi: 'Kab. Subang – Balai Penelitian Padi',
                sumber: 'DIPA BRIN',
                anggaran: 210000000,
                progress: 100,
                capaian: 'Pengukuran emisi metana dan validasi data panen selesai.',
                kendala: '',
                rekomendasi: 'Publikasikan hasil uji coba di jurnal nasional terakreditasi.',
                kak: 'KAK_BRIN_3.pdf',
                foto: '15 foto',
                lain: '',
                ringkasan: 'Data emisi lengkap untuk satu musim tanam sudah dianalisis.',
                laporanAkhir: 'Laporan_Akhir_BRIN_3.pdf',
                status: 'disetujui',
                catatan: ''
            }
        }
    ]);

    const trashedActivities = ref([
        {
            id: 4,
            title: 'Kajian Awal Pemanfaatan Limbah Pertanian untuk Energi',
            jbrDivision: { name: 'Dinas Tanaman Pangan dan Hortikultura' },
            mtrDivision: { name: 'Pusat Riset Energi Terbarukan' },
            status: 'proses',
            progress: 30,
            created_at: '2026-02-10 08:00:00',
            updated_at: '2026-02-15 10:00:00',
            deleted_at: '2026-05-12 15:30:00'
        }
    ]);

    const tabs = computed(() => [
        { key: 'active', name: 'Kolaborasi Aktif', icon: 'fa-handshake', count: activities.value.length },
        { key: 'trashed', name: 'Disembunyikan', icon: 'fa-eye-slash', count: trashedActivities.value.length }
    ]);

    const years = computed(() => {
        const rows = [...activities.value, ...trashedActivities.value];
        const values = rows
            .flatMap((item) => [item.created_at, item.deleted_at])
            .filter(Boolean)
            .map((val) => String(val).slice(0, 4));

        return [...new Set(values)].sort((a, b) => b - a);
    });

    const avgProgress = computed(() => {
        if (!activities.value.length) return 0;
        const sum = activities.value.reduce((acc, curr) => acc + (curr.progress || 0), 0);
        return Math.round((sum / activities.value.length) * 10) / 10;
    });

    const compareItem = ref(null);

    const openCompare = (item) => {
        compareItem.value = item;
    };

    const statusFromSides = (item) => {
        const sides = [item.jabar?.status, item.brin?.status];
        if (sides.includes('ditolak')) return 'ditolak';
        if (sides.every((status) => status === 'disetujui')) return 'disetujui';
        return 'proses';
    };

    const applyCompareUpdate = (payload) => {
        const item = compareItem.value;
        if (!item) return;

        Object.assign(item, payload);
        item.status = statusFromSides(item);
        item.progress = Math.round(((item.jabar?.progress ?? 0) + (item.brin?.progress ?? 0)) / 2);
    };
</script>

<template>
    <div class="min-h-screen overflow-x-hidden antialiased bg-gray-50">
        <AdminSideBar />
        <main class="lg:ml-65 min-h-screen transition-all duration-300">
            <TopBar title="Manajemen Kegiatan" subtitle="Evaluasi dan bandingkan laporan kinerja kegiatan antara Perangkat Daerah Jabar dan Unit BRIN"/>

            <div class="flex-1 px-4 sm:px-6 lg:px-7 pt-26 pb-12">
                <div class="grid lg:grid-cols-4 sm:grid-cols-2 gap-3.5 mb-5">
                    <Card title="Total Kolaborasi" :total="activities.length" icon="fa-handshake" color="bg-sky-700"></Card>
                    <Card title="Total Kegiatan Masuk" :total="activities.length" icon="fa-clipboard-list" color="bg-sky-700"></Card>
                    <Card title="Total Anggaran" :total="'Rp 150 Jt'" icon="fa-wallet" color="bg-green-700"></Card>
                    <Card title="Rata-rata Progres" :total="`${avgProgress}%`" icon="fa-chart-pie" color="bg-sky-700"></Card>
                </div>

                <Toolbar
                    v-model="activeTab"
                    :tabs="tabs"
                    :years="years"
                    search-placeholder="Cari judul kolaborasi..."
                    @filter-change="filters = $event"
                    @per-page-change="perPage = $event">
                </Toolbar>

                <div class="bg-white border border-sky-200 rounded-2xl overflow-hidden">
                    <div class="flex items-center justify-between px-4 sm:px-5 py-4 bg-sky-50 border-b border-sky-200 flex-wrap gap-2">
                        <div class="flex items-center gap-2.5">
                            <i class="fas fa-table text-sky-500 text-lg"></i>
                            <h3 class="text-[15px] font-bold text-sky-800">Daftar Kegiatan</h3>
                        </div>
                    </div>

                    <ActivitiesTable
                        v-show="activeTab === 'active'"
                        :items="activities"
                        :filters="filters"
                        :per-page="perPage"
                        @compare="openCompare">
                    </ActivitiesTable>

                    <TrashedActivitiesTable
                        v-show="activeTab === 'trashed'"
                        :items="trashedActivities"
                        :filters="filters"
                        :per-page="perPage">
                    </TrashedActivitiesTable>
                </div>
            </div>
        </main>

        <CompareActivitiesModal
            v-if="compareItem"
            :activity="compareItem"
            @close="compareItem = null"
            @update="applyCompareUpdate">
        </CompareActivitiesModal>
    </div>
</template>
