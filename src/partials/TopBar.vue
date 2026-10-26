<script setup>
    import { formatDate } from '@/helpers/date'

    const today = formatDate()

    const props = defineProps({
        'title': {
            type: String,
            default: 'Dashboard'
        },
        'subtitle': {
            type: String,
            default: 'Monitoring & Evaluasi NKS Jabar - BRIN'
        }
    })
</script>

<template>
    <header
        class="fixed top-0 inset-x-0 lg:left-[260px] z-30 h-20 bg-white/95 backdrop-blur-md flex justify-between items-center gap-3 px-4 sm:px-6 lg:px-7 border-b border-blue-200">
        <div class="flex items-center gap-3.5 min-w-0 flex-1">
            <button id="menuToggle"
                class="lg:hidden w-10 h-10 shrink-0 bg-white border border-blue-200 rounded-xl text-blue-700
                        hover:bg-blue-100 transition-colors flex items-center justify-center shadow-sm cursor-pointer">
                <i class="fas fa-bars text-base"></i>
            </button>

            <div class="min-w-0">
                <h1 class="text-xl sm:text-2xl font-bold text-blue-800 tracking-tight leading-tight truncate">
                    {{ title }}
                </h1>
                <span class="text-xs text-gray-500 block mt-0.5 truncate">
                    {{ subtitle }}
                </span>
            </div>
        </div>

        <div class="flex items-center gap-3 shrink-0">
            <div
                class="hidden sm:flex items-center gap-1.5 bg-blue-100 border border-blue-200 text-blue-800
                        text-xs font-medium px-3.5 py-1.5 rounded-full select-none">
                <i class="fas fa-calendar-alt text-blue-500"></i>
                <span>{{ today }}</span>
            </div>

            <button type="button"
                class="w-10 h-10 bg-blue-500 hover:bg-blue-600 rounded-full
                    flex items-center justify-center text-white transition-all shadow-sm cursor-pointer">
                <i class="fas fa-user text-sm"></i>
            </button>
        </div>
    </header>
</template>