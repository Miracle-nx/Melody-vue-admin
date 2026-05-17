import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export type ThemeMode = 'light' | 'dark'

export const useThemeStore = defineStore('theme', () => {
    const mode = ref<ThemeMode>((localStorage.getItem('theme') as ThemeMode) || 'light')
    const sidebarCollapsed = ref(false)
    const sidebarOpen = ref(true)

    const isDark = computed(() => mode.value === 'dark')

    function toggleTheme() {
        mode.value = mode.value === 'light' ? 'dark' : 'light'
    }

    function toggleSidebar() {
        sidebarCollapsed.value = !sidebarCollapsed.value
    }

    // Apply theme to document
    watch(mode, (val) => {
        localStorage.setItem('theme', val)
        if (val === 'dark') {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, { immediate: true })

    return {
        mode,
        isDark,
        sidebarCollapsed,
        sidebarOpen,
        toggleTheme,
        toggleSidebar,
    }
})
