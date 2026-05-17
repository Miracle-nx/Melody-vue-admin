import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface Tab {
    path: string
    title: string
    name: string
}

export const useAppStore = defineStore('app', () => {
    const tabs = ref<Tab[]>([
        { path: '/dashboard', title: '工作台', name: 'Dashboard' },
    ])
    const activeTab = ref('/dashboard')
    const globalLoading = ref(false)

    const tabList = computed(() => tabs.value)

    function addTab(tab: Tab) {
        const exists = tabs.value.find(t => t.path === tab.path)
        if (!exists) {
            tabs.value.push(tab)
        }
        activeTab.value = tab.path
    }

    function removeTab(path: string) {
        const idx = tabs.value.findIndex(t => t.path === path)
        if (idx === -1) return
        tabs.value.splice(idx, 1)
        if (activeTab.value === path) {
            activeTab.value = tabs.value[idx]?.path || tabs.value[idx - 1]?.path || '/dashboard'
        }
    }

    function closeOtherTabs(path: string) {
        tabs.value = tabs.value.filter(t => t.path === path || t.path === '/dashboard')
        activeTab.value = path
    }

    function closeAllTabs() {
        tabs.value = [tabs.value[0]]
        activeTab.value = '/dashboard'
    }

    function setGlobalLoading(val: boolean) {
        globalLoading.value = val
    }

    return {
        tabs,
        activeTab,
        globalLoading,
        tabList,
        addTab,
        removeTab,
        closeOtherTabs,
        closeAllTabs,
        setGlobalLoading,
    }
})
