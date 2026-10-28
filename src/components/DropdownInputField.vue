<script setup>
    import { computed, nextTick, onBeforeUnmount, onMounted, ref, useAttrs, watch } from 'vue';

    defineOptions({ inheritAttrs: false });

    const props = defineProps({
        name: { type: String, default: 'name' },
        icon: { type: String, default: null },
        title: { type: String, default: 'Title' },
        placeholder: { type: String, default: 'Placeholder' },
        message: { type: String, default: null },
        items: { type: Array, default: () => [] },
        required: { type: Boolean, default: false }
    });

    const model = defineModel({ type: [String, Number], default: '' });
    const emit = defineEmits(['change']);

    const attrs = useAttrs();
    const fieldId = computed(() => attrs.id ?? props.name);
    const labelId = computed(() => `${fieldId.value}-label`);

    // Placeholder ikut jadi opsi pertama, sama seperti <select> di dashboard-nks.
    const options = computed(() => [
        { value: '', label: props.placeholder },
        ...props.items.map((item) => {
            if (item !== null && typeof item === 'object') {
                return {
                    value: String(item.id ?? item.value ?? ''),
                    label: String(item.name ?? item.label ?? '')
                };
            }
            return { value: String(item), label: String(item) };
        })
    ]);

    const selectedValue = computed(() => String(model.value ?? ''));
    const selectedLabel = computed(() => {
        const found = options.value.find((opt) => opt.value === selectedValue.value);
        return found ? found.label : props.placeholder;
    });

    const open = ref(false);
    const positioned = ref(false);
    const hoveredValue = ref(null);
    const activeIndex = ref(0);
    const triggerRef = ref(null);
    const panelRef = ref(null);
    const panelStyle = ref({ left: '0px', top: '0px', width: '0px' });

    const hoveringOther = computed(
        () => hoveredValue.value !== null && hoveredValue.value !== selectedValue.value
    );

    const isSelected = (opt) => opt.value === selectedValue.value;

    const optionClass = (opt, index) => {
        const selected = isSelected(opt);

        if (selected && !hoveringOther.value) {
            return 'bg-sky-100 text-sky-700 font-bold';
        }
        if (index === activeIndex.value && open.value) {
            return 'bg-sky-100 text-sky-500 font-medium hover:bg-sky-100 hover:text-sky-500';
        }
        return 'text-slate-700 font-medium hover:bg-sky-100 hover:text-sky-500';
    };

    const positionPanel = () => {
        if (!triggerRef.value || !panelRef.value) return;

        const rect = triggerRef.value.getBoundingClientRect();
        const margin = 4;
        const width = Math.min(rect.width, window.innerWidth - margin * 2);
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

    const openPanel = async () => {
        if (attrs.disabled) return;
        open.value = true;
        positioned.value = false;
        activeIndex.value = Math.max(
            0,
            options.value.findIndex((opt) => opt.value === selectedValue.value)
        );
        await nextTick();
        positionPanel();
        scrollActiveIntoView();
    };

    const closePanel = () => {
        open.value = false;
        positioned.value = false;
        hoveredValue.value = null;
    };

    const resetHover = () => {
        hoveredValue.value = null;
        activeIndex.value = Math.max(
            0,
            options.value.findIndex((opt) => opt.value === selectedValue.value)
        );
    };

    const toggle = () => {
        if (open.value) closePanel();
        else openPanel();
    };

    const select = (opt) => {
        model.value = opt.value;
        emit('change', opt.value);
        closePanel();
        triggerRef.value?.focus();
    };

    const scrollActiveIntoView = () => {
        if (!panelRef.value) return;
        const optionEl = panelRef.value.children[activeIndex.value];
        optionEl?.scrollIntoView({ block: 'nearest' });
    };

    const moveActive = (step) => {
        const total = options.value.length;
        if (!total) return;
        activeIndex.value = (activeIndex.value + step + total) % total;
        scrollActiveIntoView();
    };

    const onKeydown = (event) => {
        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                if (!open.value) openPanel();
                else moveActive(1);
                break;
            case 'ArrowUp':
                event.preventDefault();
                if (!open.value) openPanel();
                else moveActive(-1);
                break;
            case 'Home':
                if (!open.value) return;
                event.preventDefault();
                activeIndex.value = 0;
                scrollActiveIntoView();
                break;
            case 'End':
                if (!open.value) return;
                event.preventDefault();
                activeIndex.value = options.value.length - 1;
                scrollActiveIntoView();
                break;
            case 'Enter':
            case ' ':
                if (!open.value) return;
                event.preventDefault();
                select(options.value[activeIndex.value]);
                break;
            case 'Escape':
                if (!open.value) return;
                event.preventDefault();
                closePanel();
                triggerRef.value?.focus();
                break;
            case 'Tab':
                closePanel();
                break;
        }
    };

    const onDocumentClick = (event) => {
        if (!open.value) return;
        if (triggerRef.value?.contains(event.target)) return;
        if (panelRef.value?.contains(event.target)) return;
        closePanel();
    };

    const onDocumentScroll = (event) => {
        if (!open.value) return;
        if (panelRef.value?.contains(event.target)) return;
        closePanel();
    };

    const onResize = () => {
        if (open.value) closePanel();
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

    watch(selectedValue, () => {
        if (!open.value) return;
        activeIndex.value = Math.max(
            0,
            options.value.findIndex((opt) => opt.value === selectedValue.value)
        );
    });
</script>

<template>
    <div class="flex flex-col gap-2 min-w-0 max-w-full">
        <label :id="labelId" :for="fieldId" class="text-[11.5px] font-bold text-sky-800 uppercase tracking-wide flex items-center gap-2">
            <i v-if="icon" :class="['fas', icon]" class="text-sky-500 text-xs"></i>
            {{ title }}
            <span v-if="required" class="text-red-500">*</span>
        </label>

        <button
            ref="triggerRef"
            v-bind="$attrs"
            :id="fieldId"
            type="button"
            role="combobox"
            aria-haspopup="listbox"
            :aria-expanded="open"
            :aria-labelledby="labelId"
            :aria-required="required || undefined"
            class="w-full max-w-full min-w-0 flex items-center justify-between gap-2 py-2.5 px-3 rounded-[10px] border-[1.5px] border-sky-200 bg-white text-[13px] font-medium text-slate-700 text-left cursor-pointer appearance-none transition-[border-color] duration-150 overflow-hidden outline-none hover:border-sky-400 focus:border-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
            @click="toggle"
            @keydown="onKeydown"
        >
            <span class="flex-1 min-w-0 truncate">{{ selectedLabel }}</span>
            <i class="fas fa-chevron-down text-sky-500 text-[10px] shrink-0 transition-transform duration-150" :class="{ 'rotate-180': open }"></i>
        </button>

        <input v-if="name" type="hidden" :name="name" :value="selectedValue" />

        <span v-if="message" class="text-xs text-slate-400 font-medium">{{ message }}</span>

        <Teleport to="body">
            <div
                v-show="open"
                ref="panelRef"
                role="listbox"
                :aria-labelledby="labelId"
                :style="{ ...panelStyle, visibility: positioned ? 'visible' : 'hidden' }"
                class="fixed z-60 bg-white border border-sky-200 rounded-[10px] shadow-[0_10px_25px_rgba(2,132,199,0.12)] max-h-60 overflow-y-auto p-1"
                @mouseleave="resetHover"
            >
                <div
                    v-for="(opt, index) in options"
                    :key="`${opt.value}-${index}`"
                    role="option"
                    :aria-selected="isSelected(opt)"
                    class="px-3 py-2 rounded-lg text-[13px] cursor-pointer transition-colors duration-150 wrap-anywhere"
                    :class="optionClass(opt, index)"
                    @click="select(opt)"
                    @mouseenter="hoveredValue = opt.value; activeIndex = index"
                >
                    {{ opt.label }}
                </div>
            </div>
        </Teleport>
    </div>
</template>
