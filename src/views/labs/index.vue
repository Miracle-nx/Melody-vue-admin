<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">{{ $t("labs.title") }}</h1>
      <p class="page-subtitle">各种炫酷功能实验室</p>
    </div>

    <div class="labs-grid">
      <router-link v-for="lab in labs" :key="lab.path" :to="lab.path" class="lab-card">
        <div class="lab-card__icon" :style="{ background: lab.gradient }">
          <el-icon :size="32"><component :is="lab.icon" /></el-icon>
        </div>
        <div class="lab-card__info">
          <h3>{{ lab.name }}</h3>
          <p>{{ lab.desc }}</p>
        </div>
        <div class="lab-card__arrow">
          <el-icon><ArrowRight /></el-icon>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Printer, Watermelon, Upload, Download } from "@element-plus/icons-vue"

const labs = [
  {
    path: "/labs/print",
    name: "打印实验室",
    desc: "批量打印、套打、条码打印 Demo",
    icon: Printer,
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  },
  {
    path: "/labs/watermark",
    name: "水印实验室",
    desc: "全屏水印、图片水印、PDF水印 Demo",
    icon: Watermelon,
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
  },
  {
    path: "/labs/upload",
    name: "上传实验室",
    desc: "大文件分片、拖拽上传、预览 Demo",
    icon: Upload,
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
  },
  {
    path: "/labs/export",
    name: "导出实验室",
    desc: "Excel、PDF、CSV 导出 Demo",
    icon: Download,
    gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
  }
]
</script>

<style scoped>
.labs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--space-lg);
}

.lab-card {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  padding: var(--space-lg);
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  transition: all 0.3s ease;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
}

.lab-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--primary);
}

.lab-card__icon {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}

.lab-card__info {
  flex: 1;
}

.lab-card__info h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

.lab-card__info p {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.lab-card__arrow {
  color: var(--text-disabled);
  transition: transform 0.3s ease;
}

.lab-card:hover .lab-card__arrow {
  transform: translateX(4px);
  color: var(--primary);
}
</style>
