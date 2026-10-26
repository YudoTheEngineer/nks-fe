<script setup>
    import { formatDate } from '@/helpers/date'
    import { isSidebarOpen, toggleSidebar } from '@/helpers/sidebar'

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
        class="fixed top-0 inset-x-0 lg:ml-65 z-30 h-20 bg-white/95 backdrop-blur-md flex justify-between items-center gap-3 px-4 sm:px-6 lg:px-7 border-b border-blue-200 transition-[margin-left] duration-300 ease-in-out">
        <div class="flex items-center gap-3.5 min-w-0 flex-1">
            <button type="button" @click="toggleSidebar" aria-label="Tampilkan sidebar"
                :aria-expanded="isSidebarOpen"
                class="lg:hidden w-10 h-10 shrink-0 bg-white border border-blue-200 rounded-xl text-blue-700 hover:bg-blue-100 transition-colors flex items-center justify-center cursor-pointer">
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

        <div class="flex items-center gap-5 shrink-0">
            <div
                class="hidden lg:flex items-center gap-2 bg-blue-100 border border-blue-200 text-blue-500
                        text-xs font-medium px-3.5 py-1.5 rounded select-none">
                <i class="fas fa-calendar-alt text-blue-500"></i>
                <span>{{ today }}</span>
            </div>

            <button type="button"
                class="w-10 h-10 bg-blue-500 hover:bg-blue-600 rounded-full
                    flex items-center justify-center text-white transition-all cursor-pointer">
                <i class="fas fa-user text-md"></i>
            </button>
        </div>
    </header>
</template>