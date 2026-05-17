import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserInfo } from '@/types'
import { login as loginApi, logout as logoutApi, getUserInfo } from '@/api/auth'
import type { LoginParams } from '@/types'

export const useAuthStore = defineStore('auth', () => {
    const token = ref(localStorage.getItem('token') || '')
    const userInfo = ref<UserInfo | null>(null)
    const permissions = ref<string[]>([])

    const isLoggedIn = computed(() => !!token.value)
    const isAdmin = computed(() => userInfo.value?.roles.includes('admin'))
    const username = computed(() => userInfo.value?.nickname || userInfo.value?.username || '')
    const avatar = computed(() => userInfo.value?.avatar || '')

    async function login(params: LoginParams) {
        const res = await loginApi(params)
        token.value = res.token
        userInfo.value = res.user
        permissions.value = res.user.permissions
        localStorage.setItem('token', res.token)
        return res
    }

    async function fetchUserInfo() {
        try {
            const user = await getUserInfo()
            userInfo.value = user
            permissions.value = user.permissions
            return user
        } catch {
            logout()
            return null
        }
    }

    function logout() {
        token.value = ''
        userInfo.value = null
        permissions.value = []
        localStorage.removeItem('token')
        localStorage.removeItem('lang')
    }

    function hasPermission(code: string): boolean {
        if (isAdmin.value) return true
        return permissions.value.includes(code)
    }

    function hasAnyPermission(codes: string[]): boolean {
        return codes.some(code => hasPermission(code))
    }

    return {
        token,
        userInfo,
        permissions,
        isLoggedIn,
        isAdmin,
        username,
        avatar,
        login,
        logout,
        fetchUserInfo,
        hasPermission,
        hasAnyPermission,
    }
})
