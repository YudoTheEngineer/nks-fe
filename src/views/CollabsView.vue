<script setup>
    import { ref } from 'vue';
    import AdminSideBar from '@/partials/AdminSideBar.vue';
    import TopBar from '@/partials/TopBar.vue';
    import Card from '@/components/Card.vue';
    import SectionCard from '@/components/SectionCard.vue';
    import InputField from '@/components/InputField.vue';
    import DropdownInputField from '@/components/DropdownInputField.vue';

    const jbrDivisions = ref([
        {
            id: 1,
            name: 'Sekretariat Daerah'
        },
        {
            id: 2,
            name: 'Dinas Pendidikan'
        }
    ]);

    const mtrDivisions = ref([
        {
            id: 31,
            name: 'Pusat Riset Energi'
        }
    ]);
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

                <SectionCard title="Tambah Data Kolaborasi" subtitle="Buat dan daftarkan kolaborasi" icon="fa-plus">
                    <InputField
                        name="collabs"
                        title="Kolaborasi"
                        placeholder="Masukan Nama Kolaborasi"
                        :required="true"
                    ></InputField>
                    
                    <div class="grid sm:grid-cols-1 mt-5 lg:grid-cols-2 sm:gap-5 lg:gap-3.5 mb-5">
                        <DropdownInputField
                            name="jbr-division"
                            title="Perangkat Daerah Jabar"
                            placeholder="Pilih Perangkat Daerah"
                            :items="jbrDivisions"
                            :required="true"
                        ></DropdownInputField>
                        <DropdownInputField
                            name="mtr-division"
                            title="Unit BRIN"
                            placeholder="Pilih Unit BRIN"
                            :items="mtrDivisions"
                            :required="true"
                        ></DropdownInputField>
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
