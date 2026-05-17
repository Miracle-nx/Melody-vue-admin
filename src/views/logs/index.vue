<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">{{ $t("logs.title") }}</h1>
      <p class="page-subtitle">系统接口调用日志与监控</p>
    </div>

    <div class="card search-card">
      <el-form :model="searchForm" layout="inline">
        <el-form-item :label="$t('logs.traceId')">
          <el-input v-model="searchForm.traceId" placeholder="输入追踪ID" clearable style="width: 180px" />
        </el-form-item>
        <el-form-item :label="$t('logs.systemName')">
          <el-select v-model="searchForm.system" clearable :placeholder="$t('common.all')" style="width: 160px">
            <el-option label="全部" value="" />
            <el-option label="SRM系统" value="srm" />
            <el-option label="ERP系统" value="erp" />
            <el-option label="MES系统" value="mes" />
            <el-option label="WMS系统" value="wms" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('logs.method')">
          <el-select v-model="searchForm.method" clearable :placeholder="$t('common.all')" style="width: 120px">
            <el-option label="全部" value="" />
            <el-option label="GET" value="GET" />
            <el-option label="POST" value="POST" />
            <el-option label="PUT" value="PUT" />
            <el-option label="DELETE" value="DELETE" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchData"
            ><el-icon><Search /></el-icon> 查询</el-button
          >
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="table-actions">
      <el-button :type="autoRefresh ? 'primary' : 'default'" @click="autoRefresh = !autoRefresh">
        <el-icon><Refresh /></el-icon>
        自动刷新 {{ autoRefresh ? "ON" : "OFF" }}
      </el-button>
    </div>

    <div class="card table-card">
      <el-table :data="tableData" stripe height="calc(100vh - 380px)">
        <el-table-column prop="traceId" label="追踪ID" width="180">
          <template #default="{ row }">
            <code class="trace-id">{{ row.traceId }}</code>
          </template>
        </el-table-column>
        <el-table-column prop="systemName" label="系统" width="100" />
        <el-table-column prop="interfaceNo" label="接口编号" width="120" />
        <el-table-column prop="interfaceName" label="接口名称" min-width="180" />
        <el-table-column prop="method" label="方法" width="80">
          <template #default="{ row }">
            <el-tag :type="getMethodType(row.method)" size="small">{{ row.method }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="duration" label="耗时(ms)" width="100" align="right">
          <template #default="{ row }">
            <span :style="{ color: row.duration > 1000 ? '#ef4444' : row.duration > 500 ? '#f59e0b' : '#22c55e' }">
              {{ row.duration }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 200 ? 'success' : 'danger'" size="small">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="requestTime" label="请求时间" width="170">
          <template #default="{ row }">{{ formatDate(row.requestTime) }}</template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from "vue"
import { formatDate } from "@/utils"

const autoRefresh = ref(false)
const tableData = ref<any[]>([])
let timer: any = null

const methods = ["GET", "POST", "PUT", "DELETE"]
const systems = ["SRM系统", "ERP系统", "MES系统", "WMS系统"]

const mockData = Array.from({ length: 50 }, (_, i) => ({
  traceId: `TRC-${String(Date.now()).slice(-8)}${String(i).padStart(4, "0")}`,
  systemName: systems[i % 4],
  interfaceNo: ["SRM-ORD-001", "SRM-SUP-002", "ERP-PO-001", "MES-QC-001", "WMS-INV-001"][i % 5],
  interfaceName: ["订单同步", "供应商查询", "采购订单推送", "质量检验结果", "库存查询"][i % 5],
  method: methods[i % 4],
  duration: Math.floor(Math.random() * 2000) + 10,
  status: Math.random() > 0.1 ? 200 : [500, 404, 403][i % 3],
  requestTime: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString()
}))

const searchForm = reactive({ traceId: "", system: "", method: "" })

function fetchData() {
  tableData.value = [...mockData]
}

function resetSearch() {
  searchForm.traceId = ""
  searchForm.system = ""
  searchForm.method = ""
  fetchData()
}

function getMethodType(method: string) {
  return { GET: "success", POST: "primary", PUT: "warning", DELETE: "danger" }[method] || "info"
}

onMounted(() => {
  fetchData()
  timer = setInterval(() => {
    if (autoRefresh.value) fetchData()
  }, 5000)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<style scoped>
.search-card {
  padding: var(--space-md) var(--space-lg);
  margin-bottom: var(--space-md);
}

.table-actions {
  margin-bottom: var(--space-md);
}

.table-card {
  padding: 0;
  overflow: hidden;
}

.trace-id {
  font-size: 12px;
  font-family: "SF Mono", "Fira Code", monospace;
  background: rgba(0, 0, 0, 0.04);
  padding: 2px 6px;
  border-radius: 4px;
}
</style>
