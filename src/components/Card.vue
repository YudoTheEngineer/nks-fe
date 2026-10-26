<script setup>
    const props = defineProps({
        'title': String,
        'total': Number,
        'icon': String,
        'valueClass': String,
        'color': String
    })
</script>

<template>
    <div class="bg-white border border-blue-200 rounded-2xl p-4 flex items-center gap-3.5 hover:border-blue-400 hover:-translate-y-0.5 transition-all">
        <div :class="[color]" class="w-11 h-11 rounded-[10px] text-white flex items-center justify-center text-lg shrink-0">
            <i :class="['fas', icon]"></i>
        </div>
        <div>
            <div class="text-[10.5px] font-bold uppercase tracking-wider text-gray-400">{{ title }}</div>
            <div :class="[valueClass]" class="text-xl font-extrabold text-blue-800 tracking-tight">{{ total }}</div>
        </div>
    </div>

</template>
