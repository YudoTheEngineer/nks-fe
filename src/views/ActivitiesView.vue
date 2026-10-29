<script setup>
    import AdminSideBar from '@/partials/AdminSideBar.vue';
    import TopBar from '@/partials/TopBar.vue';
    import Card from '@/components/Card.vue';
</script>

<template>
    <div class="min-h-screen overflow-x-hidden antialiased bg-gray-50">
        <AdminSideBar />
        <main class="lg:ml-65 min-h-screen transition-all duration-300">
            <TopBar title="Manajemen Kegiatan" subtitle="Evaluasi dan bandingkan laporan kinerja kegiatan antara Perangkat Daerah Jabar dan Unit BRIN"/>

            <div class="flex-1 px-4 sm:px-6 lg:px-7 pt-26 pb-12">
                <div class="grid lg:grid-cols-4 sm:grid-cols-2 gap-3.5 mb-5">
                    <Card title="Total Kolaborasi" :total="10" icon="fa-handshake" color="bg-sky-700"></Card>
                    <Card title="Total Kegiatan Masuk" :total="10" icon="fa-clipboard-list" color="bg-sky-700"></Card>
                    <Card title="Total Anggaran" :total="10" icon="fa-wallet" color="bg-green-700"></Card>
                    <Card title="Rata-rata Progres" :total="10" icon="fa-chart-pie" color="bg-sky-700"></Card>
                </div>
            </div>
        </main>
    </div>
</template>
