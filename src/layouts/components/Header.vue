<template>
  <header class="header glass-header">
    <div class="header__left">
      <el-icon class="header__collapse-btn" :size="20" @click="themeStore.toggleSidebar">
        <Fold v-if="!themeStore.sidebarCollapsed" />
        <Expand v-else />
      </el-icon>
      <Breadcrumb />
    </div>

    <div class="header__right">
      <!-- Language Switch -->
      <el-tooltip :content="locale === 'zh-CN' ? 'English' : '中文'" placement="bottom">
        <el-button class="header__action-btn" text @click="toggleLanguage">
          <el-icon :size="18"><ChatLineRound /></el-icon>
          <span class="header__lang-text">{{ locale === "zh-CN" ? "EN" : "中" }}</span>
        </el-button>
      </el-tooltip>

      <!-- Theme Switch -->
      <el-tooltip :content="themeStore.isDark ? '浅色模式' : '深色模式'" placement="bottom">
        <el-button class="header__action-btn" text @click="themeStore.toggleTheme">
          <el-icon :size="18">
            <Sunny v-if="!themeStore.isDark" />
            <Moon v-else />
          </el-icon>
        </el-button>
      </el-tooltip>

      <!-- Notifications -->
      <el-badge :value="3" :hidden="false" class="header__badge">
        <el-button class="header__action-btn" text>
          <el-icon :size="18"><Bell /></el-icon>
        </el-button>
      </el-badge>

      <!-- Fullscreen -->
      <el-tooltip content="全屏" placement="bottom">
        <el-button class="header__action-btn" text @click="toggleFullscreen">
          <el-icon :size="18">
            <FullScreen v-if="!isFullscreen" />
            <CloseOne v-else />
          </el-icon>
        </el-button>
      </el-tooltip>

      <!-- User Avatar -->
      <el-dropdown trigger="click" @command="handleCommand">
        <div class="header__user">
          <div class="header__avatar">
            <el-avatar :size="32" :src="authStore.avatar">
              {{ authStore.username?.charAt(0)?.toUpperCase() }}
            </el-avatar>
          </div>
          <span class="header__username">{{ authStore.username }}</span>
          <el-icon class="header__arrow"><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">
              <el-icon><User /></el-icon>个人中心
            </el-dropdown-item>
            <el-dropdown-item command="settings">
              <el-icon><Setting /></el-icon>系统设置
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              <el-icon><SwitchButton /></el-icon>退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { useRouter } from "vue-router"
import { useI18n } from "vue-i18n"
import { useThemeStore } from "@/stores/theme"
import { useAuthStore } from "@/stores/auth"
import Breadcrumb from "./Breadcrumb.vue"

const router = useRouter()
const { locale } = useI18n()
const themeStore = useThemeStore()
const authStore = useAuthStore()

const isFullscreen = ref(false)

function toggleLanguage() {
  const newLang = locale.value === "zh-CN" ? "en-US" : "zh-CN"
  locale.value = newLang
  localStorage.setItem("lang", newLang)
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
    isFullscreen.value = true
  } else {
    document.exitFullscreen()
    isFullscreen.value = false
  }
}

function handleCommand(command: string) {
  switch (command) {
    case "profile":
      break
    case "settings":
      router.push("/settings")
      break
    case "logout":
      authStore.logout()
      router.push("/login")
      break
  }
}
</script>

<style scoped>
.header {
  height: var(--header-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-lg);
  position: sticky;
  top: 0;
  z-index: var(--z-header);
  flex-shrink: 0;
}

.header__left {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.header__collapse-btn {
  cursor: pointer;
  color: var(--text-secondary);
  transition: all var(--transition-fast);
  padding: 4px;
  border-radius: var(--radius-sm);
}

.header__collapse-btn:hover {
  color: var(--primary);
  background: rgba(102, 126, 234, 0.08);
}

.header__right {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.header__action-btn {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  font-size: 18px;
  color: var(--text-secondary);
  transition: all var(--transition-fast);
}

.header__action-btn:hover {
  background: rgba(102, 126, 234, 0.08);
  color: var(--primary);
}

.header__lang-text {
  font-size: 12px;
  font-weight: 600;
  margin-left: 2px;
}

.header__badge :deep(.el-badge__content) {
  border: 2px solid transparent;
  font-size: 10px;
  height: 16px;
  line-height: 16px;
  padding: 0 4px;
}

.header__user {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: var(--radius-md);
  transition: background var(--transition-fast);
  margin-left: var(--space-sm);
}

.header__user:hover {
  background: rgba(102, 126, 234, 0.06);
}

.header__username {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.header__arrow {
  font-size: 12px;
  color: var(--text-disabled);
}
</style>
