import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'

const routes: RouteRecordRaw[] = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/login/index.vue'),
        meta: { hidden: true },
    },
    {
        path: '/',
        component: () => import('@/layouts/DefaultLayout.vue'),
        redirect: '/dashboard',
        children: [
            {
                path: 'dashboard',
                name: 'Dashboard',
                component: () => import('@/views/dashboard/index.vue'),
                meta: { title: '工作台', icon: 'dashboard', keepAlive: true },
            },
            {
                path: 'supplier',
                name: 'Supplier',
                component: () => import('@/views/supplier/index.vue'),
                meta: { title: '供应商管理', icon: 'supplier', permission: 'supplier:list' },
            },
            {
                path: 'supplier/:id',
                name: 'SupplierDetail',
                component: () => import('@/views/supplier/detail.vue'),
                meta: { title: '供应商详情', icon: 'supplier', hidden: true },
            },
            {
                path: 'purchase',
                name: 'Purchase',
                component: () => import('@/views/purchase/index.vue'),
                meta: { title: '采购协同', icon: 'purchase', permission: 'purchase:list' },
            },
            {
                path: 'purchase/:id',
                name: 'PurchaseDetail',
                component: () => import('@/views/purchase/detail.vue'),
                meta: { title: '采购订单详情', icon: 'purchase', hidden: true },
            },
            {
                path: 'quality',
                name: 'Quality',
                component: () => import('@/views/quality/index.vue'),
                meta: { title: '质量管理', icon: 'quality', permission: 'quality:list' },
            },
            {
                path: 'logs',
                name: 'Logs',
                component: () => import('@/views/logs/index.vue'),
                meta: { title: '接口日志', icon: 'logs', permission: 'logs:list' },
            },
            {
                path: 'region',
                name: 'Region',
                component: () => import('@/views/region/index.vue'),
                meta: { title: '行政区划', icon: 'region' },
            },
            {
                path: 'labs',
                name: 'Labs',
                component: () => import('@/views/labs/index.vue'),
                meta: { title: '实验室', icon: 'labs' },
                redirect: '/labs/print',
                children: [
                    {
                        path: 'print',
                        name: 'PrintLab',
                        component: () => import('@/views/labs/print.vue'),
                        meta: { title: '打印实验室', icon: 'print' },
                    },
                    {
                        path: 'watermark',
                        name: 'WatermarkLab',
                        component: () => import('@/views/labs/watermark.vue'),
                        meta: { title: '水印实验室', icon: 'watermark' },
                    },
                    {
                        path: 'upload',
                        name: 'UploadLab',
                        component: () => import('@/views/labs/upload.vue'),
                        meta: { title: '上传实验室', icon: 'upload' },
                    },
                    {
                        path: 'export',
                        name: 'ExportLab',
                        component: () => import('@/views/labs/export.vue'),
                        meta: { title: '导出实验室', icon: 'export' },
                    },
                ],
            },
            {
                path: 'settings',
                name: 'Settings',
                component: () => import('@/views/settings/index.vue'),
                meta: { title: '系统设置', icon: 'settings', permission: 'settings:view' },
            },
            {
                path: 'exception/403',
                name: 'Forbidden',
                component: () => import('@/views/exception/403.vue'),
                meta: { title: '403 无权限', icon: 'exception', hidden: true },
            },
            {
                path: 'exception/404',
                name: 'NotFound',
                component: () => import('@/views/exception/404.vue'),
                meta: { title: '404 页面不存在', icon: 'exception', hidden: true },
            },
        ],
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/exception/404',
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach(async (to, _from, next) => {
    const authStore = useAuthStore()

    if (to.path === '/login') {
        if (authStore.isLoggedIn) {
            next('/dashboard')
        } else {
            next()
        }
        return
    }

    if (!authStore.isLoggedIn) {
        next(`/login?redirect=${to.path}`)
        return
    }

    // Fetch user info if not loaded
    if (!authStore.userInfo) {
        await authStore.fetchUserInfo()
    }

    // Check permission
    const requiredPermission = to.meta.permission as string | undefined
    if (requiredPermission && !authStore.hasPermission(requiredPermission)) {
        next('/exception/403')
        return
    }

    // Add tab
    if (!to.meta.hidden) {
        const appStore = useAppStore()
        appStore.addTab({
            path: to.path,
            title: (to.meta.title as string) || '',
            name: to.name as string,
        })
    }

    next()
})

export default router
