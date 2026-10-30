<script setup>
    import { computed, ref, watch } from 'vue';
    import { buildDateInfo } from '@/helpers/date';
    import { filterTableItems, pageWindow } from '@/helpers/table';

    const props = defineProps({
        items: { type: Array, default: () => [] },
        filters: {
            type: Object,
            default: () => ({ search: '', year: '', month: '', sort: 'terbaru' })
        },
        perPage: { type: [String, Number], default: '10' }
    });

    const emit = defineEmits(['restore', 'force-delete', 'detail']);

    const page = ref(1);
    const rootRef = ref(null);

    const filteredRows = computed(() => filterTableItems(props.items, props.filters, 'deleted_at'));

    const perPageSize = computed(() => {
        const value = String(props.perPage ?? '10');
        if (value === 'all') return Infinity;

        const number = Number(value);
        return Number.isFinite(number) && number > 0 ? number : 10;
    });

    const totalPages = computed(() =>
        perPageSize.value === Infinity
            ? 1
            : Math.max(1, Math.ceil(filteredRows.value.length / perPageSize.value))
    );

    const currentPage = computed(() => Math.min(Math.max(1, page.value), totalPages.value));

    const startIndex = computed(() =>
        perPageSize.value === Infinity ? 0 : (currentPage.value - 1) * perPageSize.value
    );

    const pagedRows = computed(() => {
        const start = startIndex.value;
        const end =
            perPageSize.value === Infinity
                ? filteredRows.value.length
                : start + perPageSize.value;

        return filteredRows.value.slice(start, end).map((item, offset) => ({
            item,
            number: start + offset + 1,
            date: buildDateInfo(item, true)
        }));
    });

    const rangeStart = computed(() => (filteredRows.value.length === 0 ? 0 : startIndex.value + 1));
    const rangeEnd = computed(() =>
        filteredRows.value.length === 0 ? 0 : startIndex.value + pagedRows.value.length
    );

    const pageNumbers = computed(() =>
        totalPages.value <= 1 ? [1] : pageWindow(totalPages.value, currentPage.value)
    );

    const emptyMessage = computed(() =>
        props.items.length === 0
            ? 'Tidak ada data kolaborasi yang disembunyikan.'
            : 'Tidak ada kolaborasi yang cocok dengan filter yang dipilih.'
    );

    watch(
        () => props.perPage,
        () => {
            page.value = 1;
        }
    );

    watch(
        () => props.filters,
        () => {
            page.value = Math.min(page.value, totalPages.value);
        },
        { deep: true }
    );

    const goToPage = (number) => {
        const next = Math.min(Math.max(1, number), totalPages.value);
        if (next === currentPage.value) return;

        page.value = next;
        const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
            ? 'auto'
            : 'smooth';
        rootRef.value?.scrollIntoView({ behavior, block: 'start' });
    };
</script>

<template>
    <div ref="rootRef" class="overflow-x-auto">
        <table class="w-full text-[13px] min-w-160">
            <thead>
                <tr class="bg-sky-500 sticky top-0 z-10">
                    <th class="text-center text-[10.5px] font-bold text-sky-800 uppercase tracking-wider px-3 sm:px-5 py-3 w-16 bg-sky-50">No</th>
                    <th class="text-left text-[10.5px] font-bold text-sky-800 uppercase tracking-wider py-3 px-4 bg-sky-50 w-full">Judul Kerjasama</th>
                    <th class="text-left text-[10.5px] font-bold text-sky-800 uppercase tracking-wider py-3 px-4 bg-sky-50 w-px whitespace-nowrap">Tanggal</th>
                    <th class="text-left text-[10.5px] font-bold text-sky-800 uppercase tracking-wider py-3 px-3 sm:px-4 bg-sky-50 w-px whitespace-nowrap">Aksi</th>
                </tr>
            </thead>

            <tbody>
                <tr
                    v-for="row in pagedRows"
                    :key="row.item.id ?? row.number"
                    class="border-b border-sky-100 transition-colors division-row"
                >
                    <td class="py-4 px-3 sm:px-5 text-center font-bold text-sky-800">{{ row.number }}</td>

                    <td class="py-4 px-4 font-semibold text-gray-700 text-[13.5px] leading-snug">
                        {{ row.item.title ?? row.item.name }}
                    </td>

                    <td class="px-4 py-3.5 align-top whitespace-nowrap">
                        <div class="space-y-1">
                            <div class="flex items-center gap-1.5 text-[11px] text-gray-600 whitespace-nowrap">
                                <span class="font-medium">Dihapus:</span>
                                <span class="font-bold text-red-600">
                                    {{ row.date.date }}
                                    <span v-if="row.date.time" class="text-gray-500 font-medium">• {{ row.date.time }}</span>
                                </span>
                            </div>
                        </div>
                    </td>

                    <td class="py-4 pl-3 pr-4 text-left whitespace-nowrap align-top">
                        <div class="inline-flex items-center gap-2">
                            <button
                                type="button"
                                title="Pulihkan"
                                aria-label="Pulihkan"
                                class="cursor-pointer select-none text-sky-600 hover:text-sky-800 transition-colors p-1"
                                @click="emit('restore', row.item)"
                            >
                                <i class="fas fa-rotate-left text-[14px]"></i>
                            </button>

                            <button
                                type="button"
                                title="Hapus Permanen"
                                aria-label="Hapus Permanen"
                                class="cursor-pointer select-none text-red-500 hover:text-red-700 transition-colors p-1"
                                @click="emit('force-delete', row.item)"
                            >
                                <i class="fas fa-trash text-[14px]"></i>
                            </button>

                            <button
                                type="button"
                                title="Lihat Detail"
                                aria-label="Lihat Detail"
                                class="cursor-pointer select-none text-gray-500 hover:text-gray-800 transition-colors p-1"
                                @click="emit('detail', row.item)"
                            >
                                <i class="fas fa-ellipsis-vertical text-[14px]"></i>
                            </button>
                        </div>
                    </td>
                </tr>

                <tr v-if="!pagedRows.length" class="empty-row">
                    <td colspan="4" class="px-5 py-6 text-center text-gray-500 font-medium">{{ emptyMessage }}</td>
                </tr>
            </tbody>
        </table>

        <div class="border-t border-sky-100 px-4 sm:px-5 py-3 flex items-center justify-between flex-wrap gap-3">
            <span class="text-[12px] font-medium text-gray-500">
                Menampilkan {{ rangeStart }}–{{ rangeEnd }} dari {{ filteredRows.length }} kolaborasi
            </span>

            <div class="inline-flex items-center gap-1.5">
                <button
                    type="button"
                    class="inline-flex items-center justify-center w-7 h-7 rounded-lg text-[13px] font-bold text-sky-700 bg-sky-100 hover:bg-sky-600 hover:text-white transition-colors disabled:opacity-40 disabled:pointer-events-none"
                    :disabled="currentPage === 1"
                    @click="goToPage(currentPage - 1)"
                >
                    <i class="fas fa-chevron-left text-[11px]"></i>
                </button>

                <div class="inline-flex items-center gap-1">
                    <template v-for="(pageNumber, index) in pageNumbers" :key="`${pageNumber}-${index}`">
                        <span
                            v-if="pageNumber === '…'"
                            class="inline-flex items-center justify-center min-w-7 h-7 text-[11.5px] font-bold text-slate-300"
                        >…</span>
                        <button
                            v-else
                            type="button"
                            class="inline-flex items-center justify-center min-w-7 h-7 px-2 rounded-lg text-[11.5px] font-bold transition-colors"
                            :class="pageNumber === currentPage ? 'bg-sky-600 text-white' : 'text-gray-600 hover:bg-sky-100 hover:text-sky-700'"
                            @click="goToPage(pageNumber)"
                        >
                            {{ pageNumber }}
                        </button>
                    </template>
                </div>

                <button
                    type="button"
                    class="inline-flex items-center justify-center w-7 h-7 rounded-lg text-[13px] font-bold text-sky-700 bg-sky-100 hover:bg-sky-600 hover:text-white transition-colors disabled:opacity-40 disabled:pointer-events-none"
                    :disabled="currentPage === totalPages"
                    @click="goToPage(currentPage + 1)"
                >
                    <i class="fas fa-chevron-right text-[11px]"></i>
                </button>
            </div>
        </div>
    </div>
</template>
