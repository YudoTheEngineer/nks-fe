<script setup>
    import { computed, ref } from 'vue';
    import AdminSideBar from '@/partials/AdminSideBar.vue';
    import TopBar from '@/partials/TopBar.vue';
    import Card from '@/components/Card.vue';
    import Toolbar from '@/components/Toolbar.vue';
    import ActivitiesTable from '@/components/ActivitiesTable.vue';

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
            updated_at: '2026-10-20 14:15:00'
        },
        {
            id: 2,
            title: 'Riset Kurikulum Berbasis Sains dan Teknologi Terapan',
            jbrDivision: { name: 'Dinas Pendidikan' },
            mtrDivision: { name: 'Pusat Riset Pendidikan' },
            status: 'ditolak',
            progress: 45,
            created_at: '2026-09-20 10:00:00',
            updated_at: '2026-09-20 10:00:00'
        },
        {
            id: 3,
            title: 'Uji Coba Varietas Padi Rendah Emisi Karbon di Lahan Basah',
            jbrDivision: { name: 'Dinas Tanaman Pangan dan Hortikultura' },
            mtrDivision: { name: 'Pusat Riset Tanaman Pangan' },
            status: 'disetujui',
            progress: 100,
            created_at: '2026-08-11 08:30:00',
            updated_at: '2026-10-25 16:40:00'
        }
    ]);

    const tabs = computed(() => [
        { key: 'active', name: 'Kolaborasi Aktif', icon: 'fa-handshake', count: activities.value.length }
    ]);

    const years = computed(() => {
        const values = activities.value
            .map((item) => item.created_at)
            .filter(Boolean)
            .map((val) => String(val).slice(0, 4));

        return [...new Set(values)].sort((a, b) => b - a);
    });

    const avgProgress = computed(() => {
        if (!activities.value.length) return 0;
        const sum = activities.value.reduce((acc, curr) => acc + (curr.progress || 0), 0);
        return Math.round((sum / activities.value.length) * 10) / 10;
    });
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
                        :items="activities"
                        :filters="filters"
                        :per-page="perPage">
                    </ActivitiesTable>
                </div>
            </div>
        </main>
    </div>
</template>
