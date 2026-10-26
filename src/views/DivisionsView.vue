<script setup>
    import AdminSideBar from '@/partials/AdminSideBar.vue';
    import TopBar from '@/partials/TopBar.vue';
</script>

<template>
    <div class="min-h-screen overflow-x-hidden antialiased bg-gray-50">
        <AdminSideBar />
        <main class="lg:ml-[260px] min-h-screen px-4 sm:px-6 lg:px-7 transition-all duration-300">
            <TopBar title="Manajemen Divisi" subtitle="Kelola semua divisi Jabar & BRIN"/>
        </main>
    </div>
</template>
