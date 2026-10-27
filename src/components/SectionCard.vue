<script setup>
    const props = defineProps({
        'title': {
            type: String,
            default: 'Judul Section'
        },
        'subtitle': {
            type: String,
            default: ''
        },
        'icon': {
            type: String,
            default: 'fa-plus'
        }
    })
</script>

<template>
    <div class="bg-white border border-blue-200 rounded-2xl mb-5 overflow-hidden transition-all">
        <div class="flex items-center gap-3.5 px-5 py-4 bg-blue-50 border-b border-blue-200">
            <div class="w-9 h-9 bg-blue-500 text-white rounded-[10px] flex items-center justify-center text-sm font-extrabold shrink-0 transition-colors">
                <i :class="['fas', icon]" class="text-[13px]"></i>
            </div>
            <div class="flex-1 min-w-0">
                <h3 class="text-[15px] font-bold text-blue-800 flex items-center gap-2 tracking-tight truncate">
                    {{ title }}
                </h3>
                <p v-if="subtitle" class="text-xs text-gray-500 mt-0.5 truncate">{{ subtitle }}</p>
            </div>
        </div>

        <div class="p-5">
            <slot>
                <p class="text-sm text-slate-500">Konten section belum diisi.</p>
            </slot>
        </div>
    </div>
</template>
