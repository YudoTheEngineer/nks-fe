<script setup>
    import Card from '@/components/Card.vue';
    import SectionCard from '@/components/SectionCard.vue';
    import AdminSideBar from '@/partials/AdminSideBar.vue';
    import TopBar from '@/partials/TopBar.vue';

</script>

<template>
    <div class="min-h-screen overflow-x-hidden antialiased bg-gray-50">
        <AdminSideBar />
        <main class="lg:ml-[260px] min-h-screen flex flex-col transition-all duration-300">
            <TopBar title="Manajemen Divisi" subtitle="Kelola semua divisi Jabar & BRIN"/>

            <div class="flex-1 px-4 sm:px-6 lg:px-7 pt-[104px] pb-12">
                <div class="grid grid-cols-3 gap-3.5 mb-5">
                    <Card title="Total Divisi" :total="10" icon="fa-sitemap" color="bg-blue-700"></Card>
                    <Card title="Perangkat Daerah" :total="10" icon="fa-building" color="bg-blue-500"></Card>
                    <Card title="Unit BRIN" :total="10" icon="fa-microscope" color="bg-blue-300"></Card>
                </div>

                <SectionCard title="Tambah Data Divisi" subtitle="Buat dan simpan informasi Unit/OPD" icon="fa-plus">
                    
                </SectionCard>
            </div>
        </main>
    </div>
</template>
