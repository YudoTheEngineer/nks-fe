<script setup>
    import AdminSideBar from '@/partials/AdminSideBar.vue';
    import TopBar from '@/partials/TopBar.vue';
</script>

<template>
    <div class="min-h-screen overflow-x-hidden antialiased bg-gray-50">
        <AdminSideBar />
        <main class="lg:ml-65 min-h-screen px-4 sm:px-6 lg:px-7 transition-all duration-300">
            <TopBar title="Dashboard" subtitle="Monitoring & Evaluasi NKS Jabar - BRIN"/>
        </main>
    </div>
</template>
