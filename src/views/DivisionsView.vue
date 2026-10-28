<script setup>
    import { ref } from 'vue';
    import Card from '@/components/Card.vue';
    import SectionCard from '@/components/SectionCard.vue';
    import AdminSideBar from '@/partials/AdminSideBar.vue';
    import TopBar from '@/partials/TopBar.vue';
    import InputField from '@/components/InputField.vue';
    import DropdownInputField from '@/components/DropdownInputField.vue';

    const institutions = ref([
        {
            id: 1,
            name: 'Perangkat Daerah di Lingkungan Provinsi Jawa Barat'
        },
        {
            id: 2,
            name: 'Badan Riset Dan Inovasi Nasional (BRIN)'
        }
    ])
</script>

<template>
    <div class="min-h-screen overflow-x-hidden antialiased bg-gray-50">
        <AdminSideBar />
        <main class="lg:ml-65 min-h-screen flex flex-col transition-all duration-300">
            <TopBar title="Manajemen Divisi" subtitle="Kelola semua divisi Jabar & BRIN"/>

            <div class="flex-1 px-4 sm:px-6 lg:px-7 pt-26 pb-12">
                <div class="grid grid-cols-3 gap-3.5 mb-5">
                    <Card title="Total Divisi" :total="10" icon="fa-sitemap" color="bg-sky-700"></Card>
                    <Card title="Perangkat Daerah" :total="10" icon="fa-building" color="bg-sky-500"></Card>
                    <Card title="Unit BRIN" :total="10" icon="fa-microscope" color="bg-sky-300"></Card>
                </div>

                <SectionCard title="Tambah Data Divisi" subtitle="Buat dan simpan informasi Unit/OPD" icon="fa-plus">
                    <div class="grid sm:grid-cols-1 lg:grid-cols-2 sm:gap-5 lg:gap-3.5 mb-5">
                        <DropdownInputField
                            name="institution"
                            title="Institusi"
                            placeholder="Pilih Institusi"
                            :items="institutions"
                            :required="true"
                        ></DropdownInputField>
                        <InputField
                            name="division"
                            title="Unit/OPD"
                            placeholder="Masukan Nama Unit/OPD"
                            :required="true"
                        ></InputField>   
                    </div>

                    <div class="flex justify-end items-center gap-2 mt-5 pt-4 border-t border-sky-100 flex-wrap">
                        <button class="inline-flex cursor-pointer select-none items-center gap-2 px-4 py-2 rounded-[10px] text-[12.5px] font-bold bg-white text-red-600 border-[1.5px] border-red-200 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all">
                            <i class="fas fa-rotate-left text-xs"></i>
                            Reset
                        </button>
                        <button class="inline-flex cursor-pointer select-none items-center gap-2 px-4 py-2 rounded-[10px] text-[13px] font-bold text-white bg-sky-500 hover:bg-sky-600">
                            <i class="fas fa-paper-plane text-xs"></i>
                            Submit
                        </button>
                    </div>
                </SectionCard>
            </div>
        </main>
    </div>
</template>
