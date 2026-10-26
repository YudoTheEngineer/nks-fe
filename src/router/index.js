import { createRouter, createWebHistory } from "vue-router";
import DashboardView from '@/views/DashboardView.vue';
import ActivitiesView from "@/views/ActivitiesView.vue";
import DivisionsView from "@/views/DivisionsView.vue";
import CollabsView from "@/views/CollabsView.vue";

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
        component: ActivitiesView
    },
    {
        path: '/divisions',
        name: 'divisions',
        component: DivisionsView
    },
    {
        path: '/collabs',
        name: 'collabs',
        component: CollabsView
    },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
