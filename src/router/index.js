import { createRouter, createWebHistory } from "vue-router";
import DashboardView from '@/views/DashboardView.vue';

const routes = [
    {
        path: '/',
        redirect: '/dashboard',
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: DashboardView
    },
    {
        path: '/activities',
        name: 'activities',
        component: DashboardView
    },
    {
        path: '/divisions',
        name: 'divisions',
        component: DashboardView
    },
    {
        path: '/collabs',
        name: 'collabs',
        component: DashboardView
    },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
