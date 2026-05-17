<template>
  <div class="error-page">
    <div class="error-content">
      <div class="error-code">403</div>
      <h1 class="error-title">{{ $t("exception.forbidden") }}</h1>
      <p class="error-desc">{{ $t("common.pageTips") }}</p>
      <div class="error-actions">
        <el-button type="primary" size="large" @click="$router.back()">
          <el-icon><ArrowLeft /></el-icon> 返回上一页
        </el-button>
        <el-button size="large" @click="$router.push('/dashboard')">
          <el-icon><HomeFilled /></el-icon> 回到首页
        </el-button>
      </div>
    </div>
    <div class="error-decoration">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
    </div>
  </div>
</template>

<style scoped>
.error-page {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.error-content {
  text-align: center;
  z-index: 1;
}

.error-code {
  font-size: 140px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: var(--space-md);
  letter-spacing: -8px;
  animation: fadeScale 0.6s ease;
}

.error-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: var(--space-sm);
}

.error-desc {
  font-size: 15px;
  color: var(--text-secondary);
  margin-bottom: var(--space-xl);
}

.error-actions {
  display: flex;
  gap: var(--space-md);
  justify-content: center;
}

.error-decoration {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  animation: float 8s ease-in-out infinite;
}

.orb-1 {
  width: 400px;
  height: 400px;
  background: rgba(102, 126, 234, 0.15);
  top: -100px;
  right: -100px;
  animation-delay: 0s;
}

.orb-2 {
  width: 300px;
  height: 300px;
  background: rgba(118, 75, 162, 0.12);
  bottom: -50px;
  left: -50px;
  animation-delay: -3s;
}

.orb-3 {
  width: 200px;
  height: 200px;
  background: rgba(239, 68, 68, 0.08);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: -6s;
}

@keyframes fadeScale {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(30px, -30px) scale(1.1);
  }
  50% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  75% {
    transform: translate(20px, 30px) scale(1.05);
  }
}
</style>
