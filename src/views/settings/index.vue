<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">{{ $t("settings.title") }}</h1>
      <p class="page-subtitle">系统设置与个性化配置</p>
    </div>

    <el-row :gutter="20">
      <el-col :span="6">
        <div class="settings-nav">
          <div
            v-for="tab in tabs"
            :key="tab.key"
            class="settings-nav__item"
            :class="{ active: activeTab === tab.key }"
            @click="activeTab = tab.key"
          >
            <el-icon><component :is="tab.icon" /></el-icon>
            <span>{{ tab.label }}</span>
          </div>
        </div>
      </el-col>
      <el-col :span="18">
        <div class="card settings-content">
          <!-- Theme Settings -->
          <div v-if="activeTab === 'theme'" class="settings-section">
            <h3 class="settings-title">主题设置</h3>
            <el-divider />
            <el-form label-width="120px">
              <el-form-item label="主题模式">
                <el-switch
                  v-model="themeStore.themeMode"
                  active-value="dark"
                  inactive-value="light"
                  @change="themeStore.toggleTheme"
                />
                <span style="margin-left: 12px">{{ themeStore.themeMode === "dark" ? "🌙 深色" : "☀️ 浅色" }}</span>
              </el-form-item>
              <el-form-item label="主题色">
                <el-color-picker
                  v-model="themeColor"
                  show-alpha
                  :predefine="['#667eea', '#7c3aed', '#ef4444', '#22c55e', '#f59e0b']"
                />
              </el-form-item>
              <el-form-item label="菜单折叠">
                <el-switch v-model="themeStore.sidebarCollapsed" @change="themeStore.toggleSidebar" />
              </el-form-item>
              <el-form-item label="菜单主题">
                <el-radio-group>
                  <el-radio value="glass">毛玻璃</el-radio>
                  <el-radio value="light">浅色</el-radio>
                  <el-radio value="dark">深色</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
          </div>

          <!-- Language Settings -->
          <div v-if="activeTab === 'language'" class="settings-section">
            <h3 class="settings-title">语言设置</h3>
            <el-divider />
            <el-form label-width="120px">
              <el-form-item label="界面语言">
                <el-radio-group :model-value="locale" @change="switchLang">
                  <el-radio-button value="zh-CN">🇨🇳 简体中文</el-radio-button>
                  <el-radio-button value="en-US">🇺🇸 English</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-form>
          </div>

          <!-- Notification Settings -->
          <div v-if="activeTab === 'notification'" class="settings-section">
            <h3 class="settings-title">通知设置</h3>
            <el-divider />
            <el-form label-width="140px">
              <el-form-item label="邮件通知">
                <el-switch v-model="notify.email" />
              </el-form-item>
              <el-form-item label="短信通知">
                <el-switch v-model="notify.sms" />
              </el-form-item>
              <el-form-item label="系统消息">
                <el-switch v-model="notify.system" />
              </el-form-item>
              <el-form-item label="审批提醒">
                <el-switch v-model="notify.approval" />
              </el-form-item>
            </el-form>
          </div>

          <!-- Account Settings -->
          <div v-if="activeTab === 'account'" class="settings-section">
            <h3 class="settings-title">账号设置</h3>
            <el-divider />
            <el-form label-width="120px">
              <el-form-item label="用户名">
                <el-input :model-value="'Admin'" disabled style="width: 200px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input :model-value="'admin@melody-nexus.com'" style="width: 300px" />
              </el-form-item>
              <el-form-item label="手机号">
                <el-input :model-value="'138-0000-0000'" style="width: 200px" />
              </el-form-item>
              <el-form-item label="部门">
                <el-input :model-value="'信息技术部'" disabled style="width: 200px" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="ElMessage.success('保存成功')">保存修改</el-button>
              </el-form-item>
            </el-form>
          </div>

          <!-- About -->
          <div v-if="activeTab === 'about'" class="settings-section">
            <h3 class="settings-title">关于系统</h3>
            <el-divider />
            <el-descriptions :column="1" border>
              <el-descriptions-item label="系统名称">Melody-Nexus · 智联采购</el-descriptions-item>
              <el-descriptions-item label="版本号">v1.0.0 (Build 2024.01)</el-descriptions-item>
              <el-descriptions-item label="前端框架">Vue 3.5 + TypeScript + Vite 6</el-descriptions-item>
              <el-descriptions-item label="UI 框架">Element Plus 2.9</el-descriptions-item>
              <el-descriptions-item label="后端接口">Mock API (开发模式)</el-descriptions-item>
              <el-descriptions-item label="许可证">MIT License</el-descriptions-item>
            </el-descriptions>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue"
import { ElMessage } from "element-plus"
import { useThemeStore } from "@/stores/theme"
import { useI18n } from "vue-i18n"

const { locale } = useI18n()
const themeStore = useThemeStore()
const activeTab = ref("theme")
const themeColor = ref("#667eea")

const notify = reactive({ email: true, sms: false, system: true, approval: true })

const tabs = [
  { key: "theme", label: "主题设置", icon: "Setting" },
  { key: "language", label: "语言设置", icon: "EditPen" },
  { key: "notification", label: "通知设置", icon: "Bell" },
  { key: "account", label: "账号设置", icon: "User" },
  { key: "about", label: "关于系统", icon: "InfoFilled" }
]

function switchLang(lang: string) {
  locale.value = lang
  localStorage.setItem("language", lang)
  ElMessage.success(`语言已切换为 ${lang === "zh-CN" ? "简体中文" : "English"}`)
}
</script>

<style scoped>
.settings-nav {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.settings-nav__item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  border-left: 3px solid transparent;
}

.settings-nav__item:hover {
  background: rgba(102, 126, 234, 0.04);
}

.settings-nav__item.active {
  color: var(--primary);
  background: rgba(102, 126, 234, 0.08);
  border-left-color: var(--primary);
  font-weight: 600;
}

.settings-content {
  padding: var(--space-lg);
}

.settings-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}
</style>
