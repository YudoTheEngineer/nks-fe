<script setup>
    import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
    import { closeSidebar, isSidebarOpen } from '@/helpers/sidebar'

    const navs = ref([
        {
            group: 'Utama',
            pages: [
                {name: 'Dashboard', route: 'dashboard', icon: 'fa-th-large'},
                {name: 'Kegiatan', route: 'activities', icon: 'fa-clipboard-list'}
            ]
        },

        {
            group: 'Data Master',
            pages: [
                {name: 'Divisi', route: 'divisions', icon: 'fa-sitemap'},
                {name: 'Kolaborasi', route: 'collabs', icon: 'fa-handshake'}
            ]
        }
    ])

    watch(isSidebarOpen, (open) => {
        document.body.style.overflow = open ? 'hidden' : ''
    })

    function handleResize() {
        if (window.innerWidth >= 1024) {
            closeSidebar()
        }
    }

    onMounted(() => window.addEventListener('resize', handleResize))

    onBeforeUnmount(() => {
        window.removeEventListener('resize', handleResize)
        document.body.style.overflow = ''
    })
</script>

<template>
    <aside id="sidebar"
        :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
        class="fixed top-0 left-0 z-40 h-screen w-[260px] bg-white border-r border-blue-200 flex flex-col transition-transform duration-300 antialiased">

        <div class="h-20 px-5 border-b border-blue-100 flex items-center shrink-0">
            <div class="flex items-center gap-3">
                <div class="w-11 h-11 bg-blue-500 rounded-[12px] flex items-center justify-center">
                    <i class="fas fa-users text-white text-lg"></i>
                </div>
                <div class="flex-1 min-w-0">
                    <div class="text-[14px] font-extrabold text-blue-800 leading-tight truncate">
                        NKS JABAR
                    </div>
                    <div class="text-[10.5px] font-bold text-gray-400 uppercase tracking-wider">
                        Dashboard Admin
                    </div>
                </div>
            </div>
        </div>

        <div class="px-4 pt-4 pb-3 border-b border-blue-50">
            <div class="flex items-center gap-3 p-3 bg-blue-50 rounded-[12px] border border-blue-100">
                <img src="https://ui-avatars.com/api/?name=Admin+NKS&&background=bfdbfe&color=fff" alt="Avatar"
                    class="w-10 h-10 rounded-full border-2 border-white object-cover shrink-0">
                <div class="flex-1 min-w-0">
                    <div class="text-[12.5px] font-bold text-blue-800 truncate">
                        Admin NKS
                    </div>
                    <div class="text-[10.5px] text-gray-600 font-medium truncate">
                        admin@nksjabar.id
                    </div>
                </div>
                <span class="w-2 h-2 bg-green-500 rounded-full shrink-0 animate-pulse"></span>
            </div>
        </div>

        <nav class="flex-1 overflow-y-auto sidebar-scroll px-3 py-4 space-y-1">
            <div v-for="(nav, index) in navs" :key="nav.group">
                <div :class="index === 0 ? 'mb-2' : 'mt-5 mb-2'" 
                     class="px-3 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">
                    {{ nav.group }}
                </div>

                <RouterLink 
                    v-for="page in nav.pages"
                    :key="page.route"
                    :to="{ name: page.route }"
                    @click="closeSidebar"
                    active-class="bg-blue-50"
                    class="nav-item flex items-center gap-3 px-3.5 py-2.5 rounded-[10px] text-[13px] font-bold transition-all text-gray-600">
                    <i :class="['fas', page.icon]" class="w-5 text-center text-[14px] text-blue-500"></i>
                    <span>{{ page.name }}</span>
                </RouterLink>
            </div>
        </nav>

        <div class="px-4 py-3 border-t border-blue-100">
            <div class="flex items-center gap-2 text-[10.5px] text-gray-400 font-medium">
                <span></span>
            </div>
        </div>
    </aside>

    <div id="sidebarOverlay" @click="closeSidebar"
        :class="isSidebarOpen ? 'block' : 'hidden'"
        class="fixed inset-0 bg-gray-900/50 z-[35] lg:hidden"></div>
</template>
