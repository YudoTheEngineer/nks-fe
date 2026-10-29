<script setup>
    import { computed, ref } from 'vue';
    import AdminSideBar from '@/partials/AdminSideBar.vue';
    import TopBar from '@/partials/TopBar.vue';
    import Card from '@/components/Card.vue';
    import SectionCard from '@/components/SectionCard.vue';
    import InputField from '@/components/InputField.vue';
    import DropdownInputField from '@/components/DropdownInputField.vue';
    import Toolbar from '@/components/Toolbar.vue';
    import CollabsTable from '@/components/CollabsTable.vue';
    import TrashedCollabsTable from '@/components/TrashedCollabsTable.vue';

    const activeTab = ref('collabs');
    const filters = ref({ search: '', year: '', month: '', sort: 'terbaru' });
    const perPage = ref('10');

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

    const collabs = ref([
        {
            id: 1,
            title: 'Pengembangan Sistem Energi Terbarukan Berbasis Biomassa',
            jbr_division_id: 1,
            mtr_division_id: 31,
            created_at: '2026-10-15 09:30:00',
            updated_at: '2026-10-16 11:20:00'
        },
        {
            id: 2,
            title: 'Riset Kurikulum Berbasis Sains dan Teknologi Terapan',
            jbr_division_id: 2,
            mtr_division_id: 31,
            created_at: '2026-09-20 14:00:00',
            updated_at: '2026-09-20 14:00:00'
        }
    ]);

    const trashedCollabs = ref([
        {
            id: 3,
            title: 'Kajian Awal Pemanfaatan Limbah Pertanian untuk Energi',
            jbr_division_id: 1,
            mtr_division_id: 31,
            created_at: '2026-02-10 08:00:00',
            updated_at: '2026-02-15 10:00:00',
            deleted_at: '2026-05-12 15:30:00'
        }
    ]);

    const tabs = computed(() => [
        { key: 'collabs', name: 'Kolaborasi Aktif', icon: 'fa-handshake', count: collabs.value.length },
        { key: 'trashed', name: 'Disembunyikan', icon: 'fa-eye-slash', count: trashedCollabs.value.length }
    ]);

    const years = computed(() => {
        const rows = [...collabs.value, ...trashedCollabs.value];
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
            <TopBar title="Manajemen Kolaborasi" subtitle="Kelola daftar kolaborasi antara Divisi Perangkat Daerah & Divisi BRIN"/>

            <div class="flex-1 px-4 sm:px-6 lg:px-7 pt-26 pb-12">
                <div class="grid lg:grid-cols-3 sm:grid-cols-1 gap-3.5 mb-5">
                    <Card title="Total Kolaborasi Aktif" :total="collabs.length" icon="fa-handshake" color="bg-sky-700"></Card>
                    <Card title="Total Kolaborasi Disembunyikan" :total="trashedCollabs.length" icon="fa-handshake" color="bg-red-500"></Card>
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
                            <h3 class="text-[15px] font-bold text-sky-800">Daftar Kolaborasi</h3>
                        </div>
                    </div>

                    <CollabsTable
                        v-show="activeTab === 'collabs'"
                        :items="collabs"
                        :filters="filters"
                        :per-page="perPage">
                    </CollabsTable>

                    <TrashedCollabsTable
                        v-show="activeTab === 'trashed'"
                        :items="trashedCollabs"
                        :filters="filters"
                        :per-page="perPage">
                    </TrashedCollabsTable>
                </div>
            </div>
        </main>
    </div>
</template>
