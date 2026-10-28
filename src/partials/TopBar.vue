<script setup>
    import { onBeforeUnmount, onMounted, ref } from 'vue'
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

    const isUserMenuOpen = ref(false)
    const userMenuRef = ref(null)

    function toggleUserMenu() {
        isUserMenuOpen.value = !isUserMenuOpen.value
    }

    function closeUserMenu() {
        isUserMenuOpen.value = false
    }

    function handleClickOutside(event) {
        if (isUserMenuOpen.value && userMenuRef.value && !userMenuRef.value.contains(event.target)) {
            closeUserMenu()
        }
    }

    function handleKeydown(event) {
        if (event.key === 'Escape') closeUserMenu()
    }

    onMounted(() => {
        document.addEventListener('click', handleClickOutside)
        document.addEventListener('keydown', handleKeydown)
    })

    onBeforeUnmount(() => {
        document.removeEventListener('click', handleClickOutside)
        document.removeEventListener('keydown', handleKeydown)
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
            <div ref="userMenuRef" class="relative">
                <button type="button" @click="toggleUserMenu" aria-haspopup="menu"
                    :aria-expanded="isUserMenuOpen" aria-controls="user-menu"
                    class="w-10 h-10 bg-blue-500 hover:bg-blue-600 rounded-full
                        flex items-center justify-center text-white transition-all cursor-pointer">
                    <i class="fas fa-user text-md"></i>
                </button>

                <Transition enter-active-class="transition duration-150 ease-out"
                    enter-from-class="opacity-0 -translate-y-1.5 scale-95"
                    enter-to-class="opacity-100 translate-y-0 scale-100"
                    leave-active-class="transition duration-100 ease-in"
                    leave-from-class="opacity-100 translate-y-0 scale-100"
                    leave-to-class="opacity-0 -translate-y-1.5 scale-95">
                    <div v-if="isUserMenuOpen" id="user-menu" role="menu"
                        class="absolute right-0 mt-2 w-64 origin-top-right bg-white border border-blue-200 rounded-2xl shadow-xl overflow-hidden">
                        <div class="px-4 py-3 border-b border-blue-100">
                            <p class="text-sm font-semibold text-gray-900 truncate">Admin NKS</p>
                            <p class="text-xs font-mono text-gray-500 truncate mt-0.5">admin@nksjabar.id</p>
                            <span
                                class="inline-block mt-2 px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-700 border border-blue-200">
                                Administrator
                            </span>
                        </div>

                        <div class="py-1">
                            <RouterLink to="/" role="menuitem" @click="closeUserMenu"
                                class="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer">
                                <i class="fas fa-gear w-4 text-blue-500 text-center"></i>
                                <span>Pengaturan</span>
                            </RouterLink>
                        </div>

                        <div class="border-t border-blue-100 pt-1 pb-1">
                            <button type="button" role="menuitem" @click="closeUserMenu"
                                class="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer">
                                <i class="fas fa-arrow-right-from-bracket w-4 text-center"></i>
                                <span>Keluar</span>
                            </button>
                        </div>
                    </div>
                </Transition>
            </div>
        </div>
    </header>
</template>
