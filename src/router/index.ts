import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Tab from '@/components/category/Tab.vue';
import TabProduct from '@/components/product/TabProduct.vue';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/product',
        name: 'product',
        component: TabProduct
    },
    {
        path: '/category',
        name: 'category',
        component: Tab,
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;

