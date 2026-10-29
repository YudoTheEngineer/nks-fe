<script setup>
    import { computed, ref } from 'vue';
    import Card from '@/components/Card.vue';
    import SectionCard from '@/components/SectionCard.vue';
    import AdminSideBar from '@/partials/AdminSideBar.vue';
    import TopBar from '@/partials/TopBar.vue';
    import InputField from '@/components/InputField.vue';
    import DropdownInputField from '@/components/DropdownInputField.vue';
    import Toolbar from '@/components/Toolbar.vue';
    import DivisionsTable from '@/components/DivisionsTable.vue';
    import TrashedDivisionsTable from '@/components/TrashedDivisionsTable.vue';

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

    const activeTab = ref('jbr');
    const filters = ref({ search: '', year: '', month: '', sort: 'terbaru' });
    const perPage = ref('10');

    const jbrDivisions = ref([
        {
            id: 1,
            name: 'Sekretariat Daerah',
            institution_id: 1,
            created_at: '2026-10-10 08:45:30',
            updated_at: '2026-10-12 09:00:00'
        },
        {
            id: 2,
            name: 'Dinas Pendidikan',
            institution_id: 1,
            created_at: '2026-09-01 10:00:00',
            updated_at: '2026-09-01 10:00:00'
        }
    ]);

    const mtrDivisions = ref([
        {
            id: 31,
            name: 'Pusat Riset Energi',
            institution_id: 2,
            created_at: '2026-08-20 13:15:00',
            updated_at: '2026-08-21 08:30:00'
        }
    ]);

    const trashedDivisions = ref([
        {
            id: 5,
            name: 'Divisi Lama',
            institution_id: 1,
            source: 'jbr',
            created_at: '2026-01-05 09:00:00',
            updated_at: '2026-02-01 11:00:00',
            deleted_at: '2026-03-10 14:20:00'
        },
        {
            id: 42,
            name: 'Unit Riset Lama',
            institution_id: 2,
            source: 'mtr',
            created_at: '2025-12-01 08:00:00',
            updated_at: '2025-12-01 08:00:00',
            deleted_at: '2026-04-02 16:45:00'
        }
    ]);

    const tabs = computed(() => [
        { key: 'jbr', name: 'Divisi BP2D', icon: 'fa-sitemap', count: jbrDivisions.value.length },
        { key: 'mtr', name: 'Divisi BRIN', icon: 'fa-microscope', count: mtrDivisions.value.length },
        { key: 'trashed', name: 'Disembunyikan', icon: 'fa-eye-slash', count: trashedDivisions.value.length }
    ]);

    const years = computed(() => {
        const rows = [...jbrDivisions.value, ...mtrDivisions.value, ...trashedDivisions.value];
        const values = rows
            .flatMap((row) => [row.created_at, row.deleted_at])
            .filter(Boolean)
            .map((value) => String(value).slice(0, 4));

        return [...new Set(values)].sort((a, b) => b - a);
    });
</script>

<template>
    <div class="min-h-screen overflow-x-hidden antialiased bg-gray-50">
        <AdminSideBar />
        <main class="lg:ml-65 min-h-screen flex flex-col transition-all duration-300">
            <TopBar title="Manajemen Divisi" subtitle="Kelola semua divisi Jabar & BRIN"/>

            <div class="flex-1 px-4 sm:px-6 lg:px-7 pt-26 pb-12">
                <div class="grid lg:grid-cols-3 sm:grid-cols-1 gap-3.5 mb-5">
                    <Card title="Total Divisi" :total="10" icon="fa-sitemap" color="bg-sky-700"></Card>
                    <Card title="Perangkat Daerah" :total="10" icon="fa-building" color="bg-sky-700"></Card>
                    <Card title="Unit BRIN" :total="10" icon="fa-microscope" color="bg-sky-700"></Card>
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

                <Toolbar
                    v-model="activeTab"
                    :tabs="tabs"
                    :years="years"
                    search-placeholder="Cari nama divisi..."
                    @filter-change="filters = $event"
                    @per-page-change="perPage = $event">
                </Toolbar>

                <div class="bg-white border border-sky-200 rounded-2xl overflow-hidden">
                    <div class="flex items-center justify-between px-4 sm:px-5 py-4 bg-sky-50 border-b border-sky-200 flex-wrap gap-2">
                        <div class="flex items-center gap-2.5">
                            <i class="fas fa-table text-sky-500 text-lg"></i>
                            <h3 class="text-[15px] font-bold text-sky-800">Daftar Divisi</h3>
                        </div>
                    </div>

                    <DivisionsTable
                        v-show="activeTab === 'jbr'"
                        :items="jbrDivisions"
                        division="jbr"
                        :filters="filters"
                        :per-page="perPage">
                    </DivisionsTable>

                    <DivisionsTable
                        v-show="activeTab === 'mtr'"
                        :items="mtrDivisions"
                        division="mtr"
                        :filters="filters"
                        :per-page="perPage">
                    </DivisionsTable>

                    <TrashedDivisionsTable
                        v-show="activeTab === 'trashed'"
                        :items="trashedDivisions"
                        :filters="filters"
                        :per-page="perPage">
                    </TrashedDivisionsTable>
                </div>
            </div>
        </main>
    </div>
</template>
