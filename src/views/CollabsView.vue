<script setup>
    import AdminSideBar from '@/partials/AdminSideBar.vue';
    import TopBar from '@/partials/TopBar.vue';
    import Card from '@/components/Card.vue';
</script>

<template>
    <div class="min-h-screen overflow-x-hidden antialiased bg-gray-50">
        <AdminSideBar />
        <main class="lg:ml-65 min-h-screen flex flex-col transition-all duration-300">
            <TopBar title="Manajemen Kolaborasi" subtitle="Kelola daftar kolaborasi antara Divisi Perangkat Daerah & Divisi BRIN"/>


            <div class="flex-1 px-4 sm:px-6 lg:px-7 pt-26 pb-12">
                <div class="grid lg:grid-cols-3 sm:grid-cols-1 gap-3.5 mb-5">
                    <Card title="Total Kolaborasi Aktif" :total="10" icon="fa-handshake" color="bg-sky-700"></Card>
                    <Card title="Total Kolaborasi Disembunyikan" :total="10" icon="fa-handshake" color="bg-red-500"></Card>
                </div>
            </div>
        </main>
    </div>
</template>
