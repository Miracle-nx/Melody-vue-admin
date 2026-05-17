<template>
  <div class="page-container">
    <!-- Welcome Banner -->
    <div class="welcome-banner">
      <div class="welcome-banner__content">
        <h2 class="welcome-banner__title">{{ $t("dashboard.welcome", { name: authStore.username }) }} 👋</h2>
        <p class="welcome-banner__desc">{{ $t("dashboard.todayStats") }}</p>
      </div>
      <div class="welcome-banner__actions">
        <el-button round @click="refreshData">
          <el-icon><Refresh /></el-icon>
          刷新数据
        </el-button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div
        v-for="(stat, index) in stats"
        :key="stat.label"
        class="stat-card"
        :style="{ animationDelay: `${index * 0.08}s` }"
      >
        <div class="stat-card__icon" :style="{ background: stat.gradient }">
          <el-icon :size="24"><component :is="stat.icon" /></el-icon>
        </div>
        <div class="stat-card__info">
          <span class="stat-card__value">{{ stat.value }}</span>
          <span class="stat-card__label">{{ stat.label }}</span>
        </div>
        <div class="stat-card__trend" :class="stat.trend > 0 ? 'up' : 'down'">
          {{ stat.trend > 0 ? "+" : "" }}{{ stat.trend }}%
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="charts-grid">
      <!-- Order Trend Chart -->
      <div class="card chart-card">
        <div class="chart-card__header">
          <h3>{{ $t("dashboard.orderTrend") }}</h3>
          <el-radio-group v-model="chartPeriod" size="small">
            <el-radio-button value="week">周</el-radio-button>
            <el-radio-button value="month">月</el-radio-button>
            <el-radio-button value="quarter">季</el-radio-button>
          </el-radio-group>
        </div>
        <div ref="orderChartRef" class="chart-card__body"></div>
      </div>

      <!-- Quality Stats -->
      <div class="card chart-card">
        <div class="chart-card__header">
          <h3>{{ $t("dashboard.qualityStats") }}</h3>
        </div>
        <div ref="qualityChartRef" class="chart-card__body"></div>
      </div>
    </div>

    <!-- Bottom Row -->
    <div class="bottom-grid">
      <!-- Recent Activities -->
      <div class="card recent-card">
        <div class="chart-card__header">
          <h3>{{ $t("dashboard.recentActivities") }}</h3>
          <el-button text type="primary" size="small">查看全部</el-button>
        </div>
        <div class="recent-card__list">
          <div v-for="(activity, index) in activities" :key="index" class="recent-card__item">
            <div class="recent-card__dot" :style="{ background: activity.color }"></div>
            <div class="recent-card__content">
              <span class="recent-card__text">{{ activity.text }}</span>
              <span class="recent-card__time">{{ activity.time }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- System Health -->
      <div class="card health-card">
        <div class="chart-card__header">
          <h3>{{ $t("dashboard.systemHealth") }}</h3>
        </div>
        <div class="health-card__list">
          <div v-for="(item, index) in healthItems" :key="index" class="health-card__item">
            <div class="health-card__info">
              <span>{{ item.name }}</span>
              <span class="health-card__status" :style="{ color: item.status === 'healthy' ? '#22c55e' : '#f59e0b' }">
                {{ item.status === "healthy" ? "正常" : "告警" }}
              </span>
            </div>
            <el-progress
              :percentage="item.percent"
              :color="item.status === 'healthy' ? '#22c55e' : '#f59e0b'"
              :stroke-width="6"
              :show-text="false"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from "vue"
import { useAuthStore } from "@/stores/auth"
import * as echarts from "echarts"
import { Refresh } from "@element-plus/icons-vue"

const authStore = useAuthStore()

const chartPeriod = ref("month")
const orderChartRef = ref<HTMLElement>()
const qualityChartRef = ref<HTMLElement>()
let orderChart: echarts.ECharts | null = null
let qualityChart: echarts.ECharts | null = null

const stats = [
  {
    label: "待处理订单",
    value: "1,284",
    icon: "ShoppingCart",
    trend: 12.5,
    gradient: "linear-gradient(135deg, #667eea, #764ba2)"
  },
  {
    label: "待处理质量单",
    value: "37",
    icon: "Warning",
    trend: -8.3,
    gradient: "linear-gradient(135deg, #f093fb, #f5576c)"
  },
  {
    label: "活跃供应商",
    value: "856",
    icon: "UserFilled",
    trend: 5.2,
    gradient: "linear-gradient(135deg, #4facfe, #00f2fe)"
  },
  {
    label: "今日接口调用",
    value: "12.5k",
    icon: "Connection",
    trend: 18.7,
    gradient: "linear-gradient(135deg, #43e97b, #38f9d7)"
  }
]

const activities = [
  { text: "供应商「深圳华强科技」提交准入申请", time: "2分钟前", color: "#667eea" },
  { text: "采购订单 PO-202405-0089 已确认", time: "15分钟前", color: "#22c55e" },
  { text: "质量问题单 QI-202405-0032 已关闭", time: "1小时前", color: "#f59e0b" },
  { text: "接口日志：SRM-ORD-001 异常重试", time: "2小时前", color: "#ef4444" },
  { text: "供应商「东莞精密制造」资质即将到期", time: "3小时前", color: "#f59e0b" }
]

const healthItems = [
  { name: "采购服务", status: "healthy", percent: 98 },
  { name: "供应商服务", status: "healthy", percent: 95 },
  { name: "质量服务", status: "healthy", percent: 92 },
  { name: "接口网关", status: "warning", percent: 78 },
  { name: "同步服务", status: "healthy", percent: 88 }
]

function initCharts() {
  if (orderChartRef.value) {
    orderChart = echarts.init(orderChartRef.value)
    orderChart.setOption({
      tooltip: { trigger: "axis" },
      grid: { left: 40, right: 16, top: 20, bottom: 24 },
      xAxis: {
        type: "category",
        data: ["1月", "2月", "3月", "4月", "5月", "6月"],
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: "#94a3b8", fontSize: 12 }
      },
      yAxis: {
        type: "value",
        splitLine: { lineStyle: { color: "rgba(0,0,0,0.04)", type: "dashed" } },
        axisLabel: { color: "#94a3b8", fontSize: 12 }
      },
      series: [
        {
          name: "订单金额",
          type: "bar",
          data: [32, 41, 38, 55, 48, 62],
          barWidth: "32%",
          itemStyle: {
            borderRadius: [6, 6, 0, 0],
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "#667eea" },
              { offset: 1, color: "#764ba2" }
            ])
          }
        },
        {
          name: "订单数量",
          type: "line",
          smooth: true,
          data: [120, 150, 138, 180, 168, 210],
          lineStyle: { width: 3, color: "#f59e0b" },
          itemStyle: { color: "#f59e0b" },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(245, 158, 11, 0.2)" },
              { offset: 1, color: "rgba(245, 158, 11, 0)" }
            ])
          }
        }
      ]
    })
  }

  if (qualityChartRef.value) {
    qualityChart = echarts.init(qualityChartRef.value)
    qualityChart.setOption({
      tooltip: { trigger: "item" },
      legend: {
        bottom: 0,
        textStyle: { color: "#94a3b8", fontSize: 12 }
      },
      series: [
        {
          type: "pie",
          radius: ["45%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 6,
            borderColor: "transparent",
            borderWidth: 2
          },
          label: { show: false },
          emphasis: {
            label: { show: true, fontSize: 14, fontWeight: "bold" }
          },
          data: [
            { value: 12, name: "致命", itemStyle: { color: "#7c3aed" } },
            { value: 28, name: "严重", itemStyle: { color: "#ef4444" } },
            { value: 45, name: "主要", itemStyle: { color: "#f59e0b" } },
            { value: 68, name: "轻微", itemStyle: { color: "#3b82f6" } },
            { value: 32, name: "建议", itemStyle: { color: "#22c55e" } }
          ]
        }
      ]
    })
  }
}

function refreshData() {
  // Refresh chart data simulation
  if (orderChart) {
    orderChart.setOption({
      series: [
        {
          data: Array.from({ length: 6 }, () => Math.floor(Math.random() * 50) + 20)
        },
        {
          data: Array.from({ length: 6 }, () => Math.floor(Math.random() * 100) + 100)
        }
      ]
    })
  }
}

onMounted(() => {
  nextTick(initCharts)
})

onUnmounted(() => {
  orderChart?.dispose()
  qualityChart?.dispose()
})
</script>

<style scoped>
.welcome-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-lg) var(--space-xl);
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.08), rgba(118, 75, 162, 0.06));
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-lg);
  backdrop-filter: blur(10px);
}

.welcome-banner__title {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.welcome-banner__desc {
  color: var(--text-secondary);
  font-size: 14px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
}

.stat-card {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-lg);
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  animation: cardIn 0.5s ease backwards;
}

@keyframes cardIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stat-card__icon {
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  color: white;
  flex-shrink: 0;
}

.stat-card__info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-card__value {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.2;
}

.stat-card__label {
  font-size: 13px;
  color: var(--text-secondary);
}

.stat-card__trend {
  font-size: 13px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  background: rgba(34, 197, 94, 0.1);
  color: var(--success);
}

.stat-card__trend.down {
  background: rgba(239, 68, 68, 0.1);
  color: var(--danger);
}

.charts-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--space-md);
  margin-bottom: var(--space-md);
}

.chart-card {
  padding: var(--space-lg);
}

.chart-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-md);
}

.chart-card__header h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.chart-card__body {
  height: 300px;
}

.bottom-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
}

.recent-card {
  padding: var(--space-lg);
}

.recent-card__list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.recent-card__item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid var(--glass-border);
}

.recent-card__item:last-child {
  border-bottom: none;
}

.recent-card__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 6px;
  flex-shrink: 0;
}

.recent-card__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.recent-card__text {
  font-size: 14px;
  color: var(--text-primary);
}

.recent-card__time {
  font-size: 12px;
  color: var(--text-disabled);
}

.health-card {
  padding: var(--space-lg);
}

.health-card__list {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.health-card__item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.health-card__info {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: var(--text-primary);
}

.health-card__status {
  font-weight: 600;
  font-size: 13px;
}

@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .charts-grid {
    grid-template-columns: 1fr;
  }
  .bottom-grid {
    grid-template-columns: 1fr;
  }
}
</style>
