<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">{{ $t("quality.title") }}</h1>
      <p class="page-subtitle">来料检验、质量问题闭环与统计分析</p>
    </div>

    <div class="card search-card">
      <el-form :model="searchForm" layout="inline">
        <el-form-item :label="$t('quality.issueNo')">
          <el-input v-model="searchForm.keyword" :placeholder="$t('common.search')" clearable />
        </el-form-item>
        <el-form-item :label="$t('quality.level')">
          <el-select v-model="searchForm.level" clearable :placeholder="$t('common.all')" style="width: 130px">
            <el-option label="全部" value="" />
            <el-option label="致命" value="critical" />
            <el-option label="严重" value="major" />
            <el-option label="轻微" value="minor" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('common.status')">
          <el-select v-model="searchForm.status" clearable :placeholder="$t('common.all')" style="width: 130px">
            <el-option label="全部" value="" />
            <el-option v-for="(v, k) in ISSUE_STATUS" :key="k" :label="v.label" :value="k" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchData"
            ><el-icon><Search /></el-icon> {{ $t("common.search") }}</el-button
          >
          <el-button @click="resetSearch">{{ $t("common.reset") }}</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="stats-row">
      <el-statistic title="待处理" :value="37" />
      <el-statistic title="本月新增" :value="128" />
      <el-statistic title="已闭环" :value="(1, 256)" />
      <el-statistic title="闭环率" value="92.5%" />
    </div>

    <div class="card table-card">
      <el-table :data="tableData" stripe v-loading="loading">
        <el-table-column prop="issueNo" label="问题单号" width="160" />
        <el-table-column prop="title" label="问题标题" min-width="220" />
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag
              :type="row.type === 'incoming' ? 'primary' : row.type === 'process' ? 'warning' : 'danger'"
              size="small"
              effect="plain"
            >
              {{ row.type === "incoming" ? "来料" : row.type === "process" ? "过程" : "客诉" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="level" label="等级" width="80">
          <template #default="{ row }">
            <span class="level-badge" :class="`level-badge--${row.level}`">{{ getLevelLabel(row.level) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <span class="status-badge" :style="{ color: ISSUE_STATUS[row.status]?.color }">
              {{ ISSUE_STATUS[row.status]?.label || row.status }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="responsiblePerson" label="责任人" width="100" />
        <el-table-column prop="discoveryDate" label="发现日期" width="120">
          <template #default="{ row }">{{ formatDate(row.discoveryDate, "YYYY-MM-DD") }}</template>
        </el-table-column>
        <el-table-column prop="rectificationDeadline" label="整改期限" width="120">
          <template #default="{ row }">{{ formatDate(row.rectificationDeadline, "YYYY-MM-DD") }}</template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button text type="primary" size="small">查看</el-button>
            <el-button text type="success" size="small" @click="handleClose(row)">闭环</el-button>
            <el-button text type="danger" size="small" v-permission="'quality:delete'">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-pagination">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue"
import { ElMessage } from "element-plus"
import { formatDate } from "@/utils"
import { ISSUE_STATUS } from "@/types/dict"

const loading = ref(false)
const total = ref(0)
const tableData = ref<any[]>([])

const mockData = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  issueNo: `QI-${20240000 + i + 1}`,
  title: ["PCB板焊接不良", "传感器精度偏差", "包装破损", "外观划伤", "尺寸超差"][i % 5],
  type: ["incoming", "process", "complaint"][i % 3],
  level: ["critical", "major", "minor"][i % 3],
  status: Object.keys(ISSUE_STATUS)[i % 5],
  responsiblePerson: ["张工", "李工", "王工", "赵工"][i % 4],
  discoveryDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  rectificationDeadline: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
}))

const searchForm = reactive({ keyword: "", level: "", status: "" })
const pagination = reactive({ page: 1, pageSize: 10 })

function fetchData() {
  loading.value = true
  setTimeout(() => {
    tableData.value = mockData.slice((pagination.page - 1) * pagination.pageSize, pagination.page * pagination.pageSize)
    total.value = mockData.length
    loading.value = false
  }, 300)
}

function resetSearch() {
  searchForm.keyword = ""
  searchForm.level = ""
  searchForm.status = ""
  fetchData()
}

function handleClose(row: any) {
  ElMessage.success("问题已闭环")
}

function getLevelLabel(level: string) {
  return { critical: "致命", major: "严重", minor: "轻微" }[level] || level
}

onMounted(fetchData)
</script>

<style scoped>
.search-card {
  padding: var(--space-md) var(--space-lg);
  margin-bottom: var(--space-md);
}

.stats-row {
  display: flex;
  gap: var(--space-lg);
  padding: var(--space-lg);
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-md);
}

.table-card {
  padding: 0;
  overflow: hidden;
}
.table-pagination {
  display: flex;
  justify-content: flex-end;
  padding: var(--space-md) var(--space-lg);
}

.level-badge {
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: var(--radius-full);
}

.level-badge--critical {
  background: rgba(124, 58, 237, 0.1);
  color: #7c3aed;
}
.level-badge--major {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}
.level-badge--minor {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.status-badge {
  font-size: 13px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  background: rgba(0, 0, 0, 0.04);
}
</style>
