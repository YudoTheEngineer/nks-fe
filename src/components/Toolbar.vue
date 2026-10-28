<script setup>
    import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';

    const props = defineProps({
        tabs: { type: Array, default: () => [] },
        years: { type: Array, default: () => [] },
        searchPlaceholder: { type: String, default: 'Cari...' }
    });

    const activeTab = defineModel({ type: [String, Number], default: undefined });
    const emit = defineEmits(['tab-change', 'filter-change', 'per-page-change', 'reset']);

    const MONTHS = [
        { value: '1', label: 'Januari' },
        { value: '2', label: 'Februari' },
        { value: '3', label: 'Maret' },
        { value: '4', label: 'April' },
        { value: '5', label: 'Mei' },
        { value: '6', label: 'Juni' },
        { value: '7', label: 'Juli' },
        { value: '8', label: 'Agustus' },
        { value: '9', label: 'September' },
        { value: '10', label: 'Oktober' },
        { value: '11', label: 'November' },
        { value: '12', label: 'Desember' }
    ];

    const SORT_OPTIONS = [
        { value: 'terbaru', label: 'Terbaru' },
        { value: 'terlama', label: 'Terlama' },
        { value: 'nama-asc', label: 'A - Z' }
    ];

    // Statis, sengaja tidak lewat props: jumlah data per halaman tidak bisa diubah dari luar.
    const PER_PAGE_OPTIONS = [
        { value: 'all', label: 'Semua' },
        { value: '10', label: '10' },
        { value: '25', label: '25' },
        { value: '50', label: '50' },
        { value: '100', label: '100' }
    ];

    const filters = reactive({
        search: '',
        year: '',
        month: '',
        sort: 'terbaru'
    });

    const perPage = ref('10');

    const filterSelects = computed(() => [
        {
            key: 'year',
            id: 'filterTahun',
            ariaLabel: 'Filter tahun',
            options: [
                { value: '', label: 'Semua Tahun' },
                ...props.years.map((year) => ({ value: String(year), label: String(year) }))
            ]
        },
        {
            key: 'month',
            id: 'filterBulan',
            ariaLabel: 'Filter bulan',
            options: [{ value: '', label: 'Semua Bulan' }, ...MONTHS]
        },
        {
            key: 'sort',
            id: 'filterSort',
            ariaLabel: 'Urutkan data',
            options: SORT_OPTIONS
        }
    ]);

    const perPageSelect = computed(() => ({
        key: 'perPage',
        id: 'perPageSelect',
        ariaLabel: 'Jumlah data per halaman',
        options: PER_PAGE_OPTIONS
    }));

    const allSelects = computed(() => [...filterSelects.value, perPageSelect.value]);

    const valueOf = (key) => {
        if (key === 'perPage') return perPage.value;
        return filters[key];
    };

    const setValue = (key, value) => {
        if (key === 'perPage') {
            perPage.value = value;
            emit('per-page-change', value);
            return;
        }
        filters[key] = value;
    };

    const labelOf = (select) => {
        const found = select.options.find((opt) => String(opt.value) === String(valueOf(select.key)));
        return found ? found.label : select.options[0]?.label ?? '';
    };

    const hasFilter = computed(() => Boolean(filters.search.trim() || filters.year || filters.month));

    const currentTab = computed(() => activeTab.value ?? props.tabs[0]?.key ?? null);

    const tabName = (tab) => tab.name ?? tab.label ?? '';

    const selectTab = (tab) => {
        activeTab.value = tab.key;
        emit('tab-change', tab.key);
    };

    const resetFilters = () => {
        filters.search = '';
        filters.year = '';
        filters.month = '';
        filters.sort = 'terbaru';
        emit('reset');
    };

    const openSelect = ref(null);
    const triggerEl = ref(null);
    const panelRef = ref(null);
    const positioned = ref(false);
    const hoveredValue = ref(null);
    const activeIndex = ref(0);
    const panelStyle = ref({ left: '0px', top: '0px', width: '0px' });

    const activeSelect = computed(
        () => allSelects.value.find((select) => select.key === openSelect.value) ?? null
    );

    const hoveringOther = computed(() => {
        if (hoveredValue.value === null || !activeSelect.value) return false;
        return String(hoveredValue.value) !== String(valueOf(activeSelect.value.key));
    });

    const isSelected = (opt) => String(opt.value) === String(valueOf(activeSelect.value.key));

    const optionClass = (opt, index) => {
        if (index === activeIndex.value) {
            return isSelected(opt)
                ? 'bg-sky-100 text-sky-700 font-bold'
                : 'bg-sky-100 text-sky-500 font-medium hover:bg-sky-100 hover:text-sky-500';
        }
        if (isSelected(opt) && !hoveringOther.value) {
            return 'bg-sky-100 text-sky-700 font-bold';
        }
        return 'text-slate-700 font-medium hover:bg-sky-100 hover:text-sky-500';
    };

    const positionPanel = () => {
        if (!triggerEl.value || !panelRef.value) return;

        const rect = triggerEl.value.getBoundingClientRect();
        const margin = 4;
        const minWidth = openSelect.value === 'perPage' ? 96 : rect.width;
        const width = Math.min(Math.max(rect.width, minWidth), window.innerWidth - margin * 2);
        const left = Math.min(Math.max(margin, rect.left), window.innerWidth - width - margin);

        const panelHeight = panelRef.value.offsetHeight;
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;

        let top = rect.bottom + margin;
        if (panelHeight > spaceBelow && spaceAbove > panelHeight) {
            top = rect.top - panelHeight - margin;
        } else if (panelHeight > spaceBelow) {
            top = Math.max(margin, window.innerHeight - panelHeight - margin);
        }

        panelStyle.value = { left: `${left}px`, top: `${top}px`, width: `${width}px` };
        positioned.value = true;
    };

    const scrollActiveIntoView = () => {
        const optionEl = panelRef.value?.children[activeIndex.value];
        optionEl?.scrollIntoView({ block: 'nearest' });
    };

    const closeSelect = () => {
        openSelect.value = null;
        triggerEl.value = null;
        positioned.value = false;
        hoveredValue.value = null;
    };

    const resetHover = () => {
        hoveredValue.value = null;
        if (!activeSelect.value) return;
        activeIndex.value = Math.max(
            0,
            activeSelect.value.options.findIndex(
                (opt) => String(opt.value) === String(valueOf(activeSelect.value.key))
            )
        );
    };

    const openSelectFor = async (key, element) => {
        openSelect.value = key;
        triggerEl.value = element;
        positioned.value = false;
        hoveredValue.value = null;

        const select = allSelects.value.find((item) => item.key === key);
        activeIndex.value = Math.max(
            0,
            select.options.findIndex((opt) => String(opt.value) === String(valueOf(key)))
        );

        await nextTick();
        positionPanel();
        scrollActiveIntoView();
    };

    const toggleSelect = (select, event) => {
        if (openSelect.value === select.key) closeSelect();
        else openSelectFor(select.key, event.currentTarget);
    };

    const choose = (opt) => {
        if (!activeSelect.value) return;
        const element = triggerEl.value;
        setValue(activeSelect.value.key, opt.value);
        closeSelect();
        element?.focus();
    };

    const moveActive = (step) => {
        if (!activeSelect.value) return;
        const total = activeSelect.value.options.length;
        if (!total) return;
        activeIndex.value = (activeIndex.value + step + total) % total;
        scrollActiveIntoView();
    };

    const useActiveOption = () => {
        const opt = activeSelect.value?.options[activeIndex.value];
        if (opt) choose(opt);
    };

    const onTriggerKeydown = (select, event) => {
        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                if (openSelect.value !== select.key) openSelectFor(select.key, event.currentTarget);
                else moveActive(1);
                break;
            case 'ArrowUp':
                event.preventDefault();
                if (openSelect.value !== select.key) openSelectFor(select.key, event.currentTarget);
                else moveActive(-1);
                break;
            case 'Home':
                if (openSelect.value !== select.key) return;
                event.preventDefault();
                activeIndex.value = 0;
                scrollActiveIntoView();
                break;
            case 'End':
                if (openSelect.value !== select.key) return;
                event.preventDefault();
                activeIndex.value = activeSelect.value.options.length - 1;
                scrollActiveIntoView();
                break;
            case 'Enter':
            case ' ':
                event.preventDefault();
                if (openSelect.value === select.key) useActiveOption();
                else openSelectFor(select.key, event.currentTarget);
                break;
            case 'Escape':
                if (openSelect.value !== select.key) return;
                event.preventDefault();
                closeSelect();
                break;
            case 'Tab':
                closeSelect();
                break;
        }
    };

    const onDocumentClick = (event) => {
        if (!openSelect.value) return;
        if (triggerEl.value?.contains(event.target)) return;
        if (panelRef.value?.contains(event.target)) return;
        closeSelect();
    };

    const onDocumentScroll = (event) => {
        if (!openSelect.value) return;
        if (panelRef.value?.contains(event.target)) return;
        closeSelect();
    };

    const onResize = () => {
        if (openSelect.value) closeSelect();
    };

    onMounted(() => {
        document.addEventListener('click', onDocumentClick);
        document.addEventListener('scroll', onDocumentScroll, true);
        window.addEventListener('resize', onResize);
    });

    onBeforeUnmount(() => {
        document.removeEventListener('click', onDocumentClick);
        document.removeEventListener('scroll', onDocumentScroll, true);
        window.removeEventListener('resize', onResize);
    });

    watch(
        filters,
        () => emit('filter-change', { ...filters }),
        { deep: true }
    );
</script>

<template>
    <div class="bg-white border border-sky-200 rounded-2xl overflow-hidden mb-4">
        <!-- Filter Bar -->
        <div class="p-4 border-b border-sky-100">
            <div class="grid grid-cols-1 md:grid-cols-12 gap-3">
                <div class="md:col-span-6 relative">
                    <i class="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-500 text-sm pointer-events-none"></i>
                    <input
                        v-model="filters.search"
                        type="text"
                        :placeholder="searchPlaceholder"
                        class="w-full text-[13px] font-medium pl-10 pr-3.5 py-2.5 rounded-[10px] border-[1.5px] border-sky-200 bg-white outline-none transition-all hover:border-sky-400"
                    />
                </div>

                <div v-for="select in filterSelects" :key="select.key" class="md:col-span-2 relative">
                    <button
                        :id="select.id"
                        type="button"
                        role="combobox"
                        aria-haspopup="listbox"
                        :aria-expanded="openSelect === select.key"
                        :aria-label="select.ariaLabel"
                        class="w-full flex items-center justify-between gap-2 text-[13px] font-medium px-3 py-2.5 pr-9 rounded-[10px] border-[1.5px] border-sky-200 bg-white outline-none cursor-pointer transition-all hover:border-sky-400  text-gray-700"
                        @click="toggleSelect(select, $event)"
                        @keydown="onTriggerKeydown(select, $event)"
                    >
                        <span class="truncate">{{ labelOf(select) }}</span>
                        <i
                            class="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-sky-500 text-[11px] pointer-events-none transition-transform"
                            :class="{ 'rotate-180': openSelect === select.key }"
                        ></i>
                    </button>
                </div>
            </div>
        </div>

        <!-- Tab Switcher, Reset Filter & Jumlah Data -->
        <div class="px-4 py-3 flex items-center gap-2 flex-wrap">
            <div
                v-if="tabs.length"
                class="flex w-full sm:w-auto sm:inline-flex gap-1.5 bg-white border border-sky-200 rounded-[10px] p-1 flex-wrap"
            >
                <button
                    v-for="tab in tabs"
                    :key="tab.key"
                    type="button"
                    class="flex-1 sm:flex-none cursor-pointer select-none inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-[8px] text-[12px] font-bold transition-all"
                    :class="tab.key === currentTab ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-600'"
                    @click="selectTab(tab)"
                >
                    <i v-if="tab.icon" :class="['fas', tab.icon]" class="text-[11px]"></i>
                    {{ tabName(tab) }}
                    <span
                        v-if="tab.count !== undefined && tab.count !== null"
                        class="px-1.5 py-0.5 rounded-full text-[10px]"
                        :class="tab.key === currentTab ? 'bg-sky-100 text-sky-700' : 'bg-slate-200 text-slate-700'"
                    >
                        {{ tab.count }}
                    </span>
                </button>
            </div>

            <div class="flex-1"></div>

            <button
                v-show="hasFilter"
                type="button"
                class="inline-flex items-center gap-1.5 text-[11.5px] font-bold text-slate-500 hover:text-red-600 transition-colors"
                @click="resetFilters"
            >
                <i class="fas fa-xmark text-[10px]"></i> Reset Filter
            </button>

            <div class="inline-flex items-center gap-1.5 self-center">
                <span class="text-[11.5px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Tampilkan</span>
                <button
                    :id="perPageSelect.id"
                    type="button"
                    role="combobox"
                    aria-haspopup="listbox"
                    :aria-expanded="openSelect === perPageSelect.key"
                    :aria-label="perPageSelect.ariaLabel"
                    class="inline-flex items-center justify-center gap-1 text-center text-[12.5px] font-medium pl-2.5 pr-1.5 py-1.5 rounded-[8px] border-[1.5px] border-sky-200 bg-white outline-none cursor-pointer transition-all hover:border-sky-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 text-slate-700"
                    @click="toggleSelect(perPageSelect, $event)"
                    @keydown="onTriggerKeydown(perPageSelect, $event)"
                >
                    {{ labelOf(perPageSelect) }}
                    <i
                        class="fas fa-chevron-down text-sky-500 text-[9px] pointer-events-none transition-transform"
                        :class="{ 'rotate-180': openSelect === perPageSelect.key }"
                    ></i>
                </button>
            </div>
        </div>

        <Teleport to="body">
            <div
                v-show="openSelect"
                ref="panelRef"
                role="listbox"
                :aria-label="activeSelect?.ariaLabel"
                :style="{ ...panelStyle, visibility: positioned ? 'visible' : 'hidden' }"
                class="fixed z-[60] bg-white border border-sky-200 rounded-[10px] shadow-[0_10px_25px_rgba(2,132,199,0.12)] max-h-[240px] overflow-y-auto p-1"
                @mouseleave="resetHover"
            >
                <template v-if="activeSelect">
                    <div
                        v-for="(opt, index) in activeSelect.options"
                        :key="`${opt.value}-${index}`"
                        role="option"
                        :aria-selected="isSelected(opt)"
                        class="px-3 py-2 rounded-lg text-[13px] cursor-pointer transition-colors duration-150 [overflow-wrap:anywhere]"
                        :class="optionClass(opt, index)"
                        @click="choose(opt)"
                        @mouseenter="hoveredValue = opt.value; activeIndex = index"
                    >
                        {{ opt.label }}
                    </div>
                </template>
            </div>
        </Teleport>
    </div>
</template>
