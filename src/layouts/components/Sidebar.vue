<template>
  <aside class="sidebar" :class="{ 'sidebar--collapsed': themeStore.sidebarCollapsed }">
    <div class="sidebar__logo">
      <div class="sidebar__logo-icon">
        <svg viewBox="0 0 32 32" width="28" height="28">
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color: #667eea" />
              <stop offset="100%" style="stop-color: #764ba2" />
            </linearGradient>
          </defs>
          <circle cx="16" cy="16" r="14" fill="url(#logoGradient)" />
          <text x="16" y="22" font-family="Arial" font-size="18" font-weight="bold" fill="white" text-anchor="middle">
            M
          </text>
        </svg>
      </div>
      <transition name="fade">
        <span v-show="!themeStore.sidebarCollapsed" class="sidebar__logo-text">Melody Nexus</span>
      </transition>
    </div>

    <el-scrollbar class="sidebar__menu" :style="{ height: 'calc(100vh - 64px)' }">
      <el-menu
        :default-active="route.path"
        :collapse="themeStore.sidebarCollapsed"
        :collapse-transition="false"
        background-color="transparent"
        text-color="var(--text-secondary)"
        active-text-color="var(--primary)"
        @select="handleMenuSelect"
        router
      >
        <template v-for="item in menuItems" :key="item.path">
          <el-sub-menu v-if="item.children" :index="item.path">
            <template #title>
              <el-icon><component :is="item.icon" /></el-icon>
              <span>{{ item.title }}</span>
            </template>
            <el-menu-item v-for="child in item.children" :key="child.path" :index="child.path">
              <el-icon><component :is="child.icon" /></el-icon>
              <span>{{ child.title }}</span>
            </el-menu-item>
          </el-sub-menu>
          <el-menu-item v-else :index="item.path">
            <el-icon><component :is="item.icon" /></el-icon>
            <span>{{ item.title }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </el-scrollbar>

    <div class="sidebar__collapse" @click="themeStore.toggleSidebar">
      <el-icon :size="18">
        <Fold v-if="!themeStore.sidebarCollapsed" />
        <Expand v-else />
      </el-icon>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router"
import { useThemeStore } from "@/stores/theme"
import { computed } from "vue"
import { useI18n } from "vue-i18n"

const route = useRoute()
const themeStore = useThemeStore()
const { t } = useI18n()

const menuItems = computed(() => [
  { path: "/dashboard", title: t("nav.dashboard"), icon: "Odometer" },
  {
    path: "/supplier",
    title: t("nav.supplier"),
    icon: "UserFilled"
  },
  { path: "/purchase", title: t("nav.purchase"), icon: "ShoppingCart" },
  { path: "/quality", title: t("nav.quality"), icon: "CircleCheck" },
  { path: "/logs", title: t("nav.logs"), icon: "List" },
  { path: "/region", title: t("nav.region"), icon: "MapLocation" },
  {
    path: "/labs",
    title: t("nav.labs"),
    icon: "Tools",
    children: [
      { path: "/labs/print", title: "打印实验室", icon: "Printer" },
      { path: "/labs/watermark", title: "水印实验室", icon: "Stamp" },
      { path: "/labs/upload", title: "上传实验室", icon: "Upload" },
      { path: "/labs/export", title: "导出实验室", icon: "Download" }
    ]
  },
  { path: "/settings", title: t("nav.settings"), icon: "Setting" }
])

function handleMenuSelect(index: string) {
  // handled by router
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  width: var(--sidebar-width);
  height: 100vh;
  z-index: var(--z-sidebar);
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  border-right: 1px solid var(--glass-border);
  transition: all var(--transition-normal);
}

.dark .sidebar {
  background: rgba(15, 23, 42, 0.45);
  border-right-color: var(--glass-border-dark);
}

.sidebar--collapsed {
  width: var(--sidebar-collapsed-width);
}

.sidebar__logo {
  height: var(--header-height);
  display: flex;
  align-items: center;
  padding: 0 18px;
  gap: 12px;
  border-bottom: 1px solid var(--glass-border);
  flex-shrink: 0;
}

.sidebar__logo-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.sidebar__logo-text {
  font-size: 18px;
  font-weight: 700;
  background: linear-gradient(135deg, var(--primary), #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  white-space: nowrap;
}

.sidebar__menu {
  flex: 1;
  overflow: hidden;
  padding: 12px 0;
}

.sidebar__menu :deep(.el-menu) {
  border-right: none;
}

.sidebar__menu :deep(.el-menu-item),
.sidebar__menu :deep(.el-sub-menu__title) {
  height: 46px;
  line-height: 46px;
  margin: 2px 8px;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.sidebar__menu :deep(.el-menu-item:hover),
.sidebar__menu :deep(.el-sub-menu__title:hover) {
  background: rgba(102, 126, 234, 0.08);
}

.sidebar__menu :deep(.el-menu-item.is-active) {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.12), rgba(118, 75, 162, 0.08));
  color: var(--primary) !important;
  font-weight: 600;
}

.sidebar__menu :deep(.el-menu-item.is-active::before) {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 20px;
  background: linear-gradient(180deg, var(--primary), var(--primary-light));
  border-radius: 0 3px 3px 0;
}

.sidebar__menu :deep(.el-sub-menu.is-active > .el-sub-menu__title) {
  color: var(--primary) !important;
}

.sidebar__menu :deep(.el-icon) {
  font-size: 18px;
}

.sidebar__collapse {
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-top: 1px solid var(--glass-border);
  color: var(--text-secondary);
  transition: all var(--transition-fast);
  flex-shrink: 0;
}

.sidebar__collapse:hover {
  color: var(--primary);
  background: rgba(102, 126, 234, 0.06);
}
</style>
