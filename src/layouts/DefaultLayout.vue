<template>
  <div class="layout" :class="{ 'layout--collapsed': themeStore.sidebarCollapsed }">
    <div class="gradient-bg">
      <div class="gradient-bg__orb"></div>
      <div class="gradient-bg__orb"></div>
      <div class="gradient-bg__orb"></div>
      <div class="gradient-bg__orb"></div>
    </div>
    <Sidebar />
    <div class="layout__main">
      <Header />
      <TabsView />
      <div class="layout__content">
        <router-view v-slot="{ Component }">
          <transition name="router-fade" mode="out-in">
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useThemeStore } from "@/stores/theme"
import Sidebar from "./components/Sidebar.vue"
import Header from "./components/Header.vue"
import TabsView from "./components/TabsView.vue"

const themeStore = useThemeStore()
</script>

<style scoped>
.layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

.layout__main {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: var(--sidebar-width);
  transition: margin-left var(--transition-normal);
  min-width: 0;
}

.layout--collapsed .layout__main {
  margin-left: var(--sidebar-collapsed-width);
}

.layout__content {
  flex: 1;
  overflow: auto;
  padding: var(--space-lg);
  position: relative;
  z-index: 1;
}

.layout__content > :deep(*) {
  min-height: 100%;
}
</style>
