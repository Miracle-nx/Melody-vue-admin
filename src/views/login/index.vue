<template>
  <div class="login">
    <div class="login__container">
      <!-- Left: Decorative -->
      <div class="login__decorative">
        <div class="login__decorative-content">
          <div class="login__logo">
            <svg viewBox="0 0 48 48" width="48" height="48">
              <defs>
                <linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color: #667eea" />
                  <stop offset="100%" style="stop-color: #764ba2" />
                </linearGradient>
              </defs>
              <circle cx="24" cy="24" r="22" fill="url(#lg)" opacity="0.9" />
              <text
                x="24"
                y="32"
                font-family="Arial"
                font-size="28"
                font-weight="bold"
                fill="white"
                text-anchor="middle"
              >
                M
              </text>
            </svg>
          </div>
          <h1 class="login__title">Melody Nexus</h1>
          <p class="login__slogan">{{ $t("app.slogan") }}</p>
          <div class="login__features">
            <div class="login__feature-item" v-for="feature in features" :key="feature.icon">
              <el-icon :size="20" :color="feature.color"><component :is="feature.icon" /></el-icon>
              <span>{{ feature.text }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Login Form -->
      <div class="login__form-wrapper">
        <div class="login__form-container glass-card">
          <h2 class="login__form-title">{{ $t("app.login") }}</h2>
          <p class="login__form-subtitle">{{ $t("app.subtitle") }}</p>

          <el-form
            ref="formRef"
            :model="form"
            :rules="rules"
            size="large"
            class="login__form"
            @keyup.enter="handleLogin"
          >
            <el-form-item prop="username">
              <el-input
                v-model="form.username"
                :placeholder="$t('common.search')"
                :prefix-icon="User"
                class="glass-input"
              >
                <template #prefix>
                  <el-icon><User /></el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item prop="password">
              <el-input v-model="form.password" type="password" show-password :placeholder="$t('common.search')">
                <template #prefix>
                  <el-icon><Lock /></el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item>
              <el-checkbox v-model="remember">{{ $t("common.search") }}</el-checkbox>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" class="login__submit-btn" :loading="loading" round @click="handleLogin">
                {{ $t("app.login") }}
              </el-button>
            </el-form-item>
          </el-form>

          <div class="login__footer">
            <span class="login__footer-text">{{ $t("common.search") }}</span>
            <el-button link type="primary">admin / admin123</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue"
import { useRouter, useRoute } from "vue-router"
import { useAuthStore } from "@/stores/auth"
import { ElMessage } from "element-plus"
import { User, Lock } from "@element-plus/icons-vue"
import type { FormInstance, FormRules } from "element-plus"

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const formRef = ref<FormInstance>()
const loading = ref(false)
const remember = ref(true)

const form = reactive({
  username: "admin",
  password: "admin123"
})

const rules: FormRules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }]
}

const features = [
  { icon: "Odometer", text: "智能数据看板", color: "#667eea" },
  { icon: "ShoppingCart", text: "采购协同管理", color: "#22c55e" },
  { icon: "UserFilled", text: "供应商全生命周期", color: "#f59e0b" },
  { icon: "CircleCheck", text: "质量追溯闭环", color: "#ef4444" }
]

async function handleLogin() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  try {
    await authStore.login({
      username: form.username,
      password: form.password
    })
    ElMessage.success("登录成功")
    const redirect = (route.query.redirect as string) || "/dashboard"
    router.push(redirect)
  } catch {
    ElMessage.error("用户名或密码错误")
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.login__container {
  display: flex;
  width: 900px;
  height: 560px;
  border-radius: var(--radius-xl);
  overflow: hidden;
  background: rgba(255, 255, 255, 0.35);
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  border: 1px solid var(--glass-border);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.15);
  position: relative;
  z-index: 1;
}

.login__decorative {
  flex: 1;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px;
}

.login__decorative-content {
  text-align: center;
}

.login__logo {
  margin-bottom: 20px;
}

.login__title {
  font-size: 28px;
  font-weight: 800;
  background: linear-gradient(135deg, var(--primary), #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
}

.login__slogan {
  color: var(--text-secondary);
  font-size: 15px;
  margin-bottom: 40px;
}

.login__features {
  display: flex;
  flex-direction: column;
  gap: 16px;
  text-align: left;
  max-width: 240px;
  margin: 0 auto;
}

.login__feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(8px);
  font-size: 14px;
  color: var(--text-primary);
  transition: all var(--transition-fast);
}

.login__feature-item:hover {
  transform: translateX(4px);
  background: rgba(255, 255, 255, 0.4);
}

.login__form-wrapper {
  width: 420px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.login__form-container {
  width: 100%;
  padding: 32px;
  background: rgba(255, 255, 255, 0.6);
}

.login__form-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.login__form-subtitle {
  color: var(--text-secondary);
  font-size: 14px;
  margin-bottom: 32px;
}

.login__form {
  margin-bottom: 16px;
}

.login__form :deep(.el-input__wrapper) {
  background: rgba(255, 255, 255, 0.5) !important;
  backdrop-filter: blur(8px);
  border: 1px solid var(--glass-border) !important;
  box-shadow: none !important;
  border-radius: var(--radius-md) !important;
  padding: 4px 12px;
}

.login__form :deep(.el-input__wrapper.is-focus) {
  border-color: var(--primary) !important;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.12) !important;
}

.login__form :deep(.el-input__inner) {
  height: 44px;
}

.login__submit-btn {
  width: 100%;
  height: 44px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  border: none;
  letter-spacing: 2px;
}

.login__submit-btn:hover {
  background: linear-gradient(135deg, var(--primary-light), var(--primary));
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.35);
  transform: translateY(-1px);
}

.login__footer {
  text-align: center;
  padding-top: 8px;
  border-top: 1px solid var(--glass-border);
}

.login__footer-text {
  font-size: 12px;
  color: var(--text-disabled);
}

@media (max-width: 768px) {
  .login__container {
    flex-direction: column;
    width: 90vw;
    height: auto;
  }
  .login__decorative {
    display: none;
  }
  .login__form-wrapper {
    width: 100%;
    padding: 24px;
  }
}
</style>
