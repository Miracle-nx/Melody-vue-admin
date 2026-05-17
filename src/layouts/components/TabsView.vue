<template>
  <div class="tabs glass-header">
    <div class="tabs__scroll">
      <div
        v-for="tab in appStore.tabList"
        :key="tab.path"
        class="tabs__item"
        :class="{ 'tabs__item--active': appStore.activeTab === tab.path }"
        @click="switchTab(tab.path)"
        @middleclick.prevent="closeTab(tab.path)"
      >
        <span class="tabs__item-title">{{ tab.title }}</span>
        <el-icon v-if="tab.path !== '/dashboard'" class="tabs__item-close" :size="14" @click.stop="closeTab(tab.path)">
          <Close />
        </el-icon>
      </div>
    </div>
    <el-dropdown class="tabs__actions" trigger="click" @command="handleTabsAction">
      <el-button text>
        <el-icon><ArrowDown /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="closeOther">关闭其他</el-dropdown-item>
          <el-dropdown-item command="closeAll">关闭所有</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router"
import { useAppStore } from "@/stores/app"

const router = useRouter()
const appStore = useAppStore()

function switchTab(path: string) {
  appStore.activeTab = path
  router.push(path)
}

function closeTab(path: string) {
  if (path === "/dashboard") return
  appStore.removeTab(path)
  const active = appStore.activeTab
  router.push(active)
}

function handleTabsAction(command: string) {
  switch (command) {
    case "closeOther":
      appStore.closeOtherTabs(appStore.activeTab)
      break
    case "closeAll":
      appStore.closeAllTabs()
      router.push("/dashboard")
      break
  }
}
</script>

<style scoped>
.tabs {
  height: var(--tabs-height);
  display: flex;
  align-items: center;
  padding: 0 var(--space-md);
  border-bottom: 1px solid var(--glass-border);
  flex-shrink: 0;
  position: sticky;
  top: var(--header-height);
  z-index: var(--z-tabs);
}

.tabs__scroll {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 4px;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
}

.tabs__scroll::-webkit-scrollbar {
  display: none;
}

.tabs__item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
  user-select: none;
  border: 1px solid transparent;
}

.tabs__item:hover {
  background: rgba(102, 126, 234, 0.06);
  color: var(--text-primary);
}

.tabs__item--active {
  background: rgba(102, 126, 234, 0.1);
  color: var(--primary);
  font-weight: 600;
  border-color: rgba(102, 126, 234, 0.2);
}

.tabs__item-close {
  opacity: 0;
  transition: opacity var(--transition-fast);
  border-radius: 3px;
  padding: 2px;
}

.tabs__item:hover .tabs__item-close,
.tabs__item--active .tabs__item-close {
  opacity: 0.6;
}

.tabs__item-close:hover {
  opacity: 1 !important;
  background: rgba(0, 0, 0, 0.08);
}

.tabs__actions {
  flex-shrink: 0;
  margin-left: auto;
}
</style>
