<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">{{ $t("supplier.title") }}</h1>
      <p class="page-subtitle">{{ $t("common.search") }}</p>
    </div>

    <!-- Search Filters -->
    <div class="card search-card">
      <el-form :model="searchForm" layout="inline" class="search-form">
        <el-form-item :label="$t('supplier.name')">
          <el-input v-model="searchForm.keyword" :placeholder="$t('common.search')" clearable />
        </el-form-item>
        <el-form-item :label="$t('common.status')">
          <el-select v-model="searchForm.status" clearable :placeholder="$t('common.all')" style="width: 140px">
            <el-option label="全部" value="" />
            <el-option v-for="(v, k) in supplierStatusMap" :key="k" :label="v.label" :value="k" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('supplier.level')">
          <el-select v-model="searchForm.level" clearable :placeholder="$t('common.all')" style="width: 140px">
            <el-option label="全部" value="" />
            <el-option label="战略级" value="strategic" />
            <el-option label="核心级" value="core" />
            <el-option label="普通级" value="regular" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchData">
            <el-icon><Search /></el-icon>
            {{ $t("common.search") }}
          </el-button>
          <el-button @click="resetSearch">
            <el-icon><Refresh /></el-icon>
            {{ $t("common.reset") }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- Table Actions -->
    <div class="table-actions">
      <el-button type="primary" @click="openCreate">
        <el-icon><Plus /></el-icon>
        {{ $t("common.create") }}
      </el-button>
      <el-button @click="handleExport">
        <el-icon><Download /></el-icon>
        {{ $t("common.export") }}
      </el-button>
      <div class="table-actions__right">
        <el-button text @click="fetchData">
          <el-icon><Refresh /></el-icon>
        </el-button>
      </div>
    </div>

    <!-- Table -->
    <div class="card table-card">
      <el-table :data="tableData" stripe style="width: 100%" v-loading="loading" @row-click="goDetail">
        <el-table-column prop="code" :label="$t('supplier.code')" width="140" />
        <el-table-column prop="name" :label="$t('supplier.name')" min-width="180" />
        <el-table-column prop="level" :label="$t('supplier.level')" width="100">
          <template #default="{ row }">
            <el-tag :type="getLevelType(row.level)" size="small" effect="plain">
              {{ row.level === "strategic" ? "战略" : row.level === "core" ? "核心" : "普通" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" :label="$t('common.status')" width="100">
          <template #default="{ row }">
            <span class="status-badge" :style="{ color: getStatusColor(row.status) }">
              {{ getStatusLabel(row.status) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="contacts" :label="$t('supplier.contacts')" width="120" />
        <el-table-column prop="phone" :label="$t('supplier.phone')" width="140" />
        <el-table-column prop="riskLevel" :label="$t('supplier.riskLevel')" width="100">
          <template #default="{ row }">
            <span class="risk-badge" :class="`risk-badge--${row.riskLevel}`">
              {{ row.riskLevel === "low" ? "低" : row.riskLevel === "medium" ? "中" : "高" }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="cooperationCount" :label="$t('supplier.cooperationCount')" width="110" align="right" />
        <el-table-column prop="createTime" :label="$t('common.time')" width="170">
          <template #default="{ row }">
            {{ formatDate(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.action')" width="160" fixed="right">
          <template #default="{ row }">
            <el-button text type="primary" size="small" @click.stop="openEdit(row)">{{ $t("common.edit") }}</el-button>
            <el-button text type="success" size="small" @click.stop="handleApprove(row)">准入</el-button>
            <el-popconfirm :title="$t('common.confirmDelete')" @confirm="handleDelete(row)">
              <template #reference>
                <el-button text type="danger" size="small" @click.stop>{{ $t("common.delete") }}</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <div class="table-pagination">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="fetchData"
          @current-change="fetchData"
        />
      </div>
    </div>

    <!-- Create/Edit Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? $t('common.edit') : $t('common.create')"
      width="700px"
      :close-on-click-modal="false"
      class="glass-modal"
    >
      <el-form :model="formData" label-width="120px" class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('supplier.code')" required>
              <el-input v-model="formData.code" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('supplier.name')" required>
              <el-input v-model="formData.name" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('supplier.level')">
              <el-select v-model="formData.level" style="width: 100%">
                <el-option label="战略级" value="strategic" />
                <el-option label="核心级" value="core" />
                <el-option label="普通级" value="regular" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('supplier.category')">
              <el-input v-model="formData.category" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('supplier.contacts')">
              <el-input v-model="formData.contacts" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('supplier.phone')">
              <el-input v-model="formData.phone" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item :label="$t('supplier.address')">
          <el-input v-model="formData.address" />
        </el-form-item>
        <el-form-item :label="$t('supplier.businessScope')">
          <el-input v-model="formData.businessScope" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">{{ $t("common.cancel") }}</el-button>
        <el-button type="primary" @click="handleSave">{{ $t("common.save") }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue"
import { useRouter } from "vue-router"
import { ElMessage } from "element-plus"
import { formatDate } from "@/utils"
import { SUPPLIER_STATUS } from "@/types/dict"

const router = useRouter()

const loading = ref(false)
const total = ref(0)
const tableData = ref<any[]>([])
const dialogVisible = ref(false)
const isEdit = ref(false)

const supplierStatusMap = SUPPLIER_STATUS

// Mock data
const mockData = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  code: `SUP-${String(i + 1).padStart(5, "0")}`,
  name: [
    "深圳华强科技",
    "东莞精密制造",
    "广州天元电子",
    "苏州博世",
    "杭州海康",
    "北京中科",
    "上海电气",
    "成都振华",
    "武汉烽火",
    "西安航天"
  ][i % 10],
  level: ["strategic", "core", "regular"][i % 3],
  status: Object.keys(SUPPLIER_STATUS)[i % 5],
  contacts: ["张三", "李四", "王五", "赵六", "钱七"][i % 5],
  phone: `138${String(10000000 + Math.floor(Math.random() * 80000000))}`,
  email: `contact${i + 1}@company.com`,
  address: "深圳市南山区科技园",
  riskLevel: ["low", "medium", "high"][i % 3],
  cooperationCount: Math.floor(Math.random() * 50) + 1,
  complaintCount: Math.floor(Math.random() * 5),
  createTime: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
}))

const searchForm = reactive({
  keyword: "",
  status: "",
  level: ""
})

const pagination = reactive({
  page: 1,
  pageSize: 10
})

const formData = reactive({
  code: "",
  name: "",
  level: "regular",
  category: "",
  contacts: "",
  phone: "",
  address: "",
  businessScope: ""
})

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
  searchForm.status = ""
  searchForm.level = ""
  fetchData()
}

function openCreate() {
  isEdit.value = false
  Object.assign(formData, {
    code: `SUP-${String(Date.now()).slice(-5)}`,
    name: "",
    level: "regular",
    category: "",
    contacts: "",
    phone: "",
    address: "",
    businessScope: ""
  })
  dialogVisible.value = true
}

function openEdit(row: any) {
  isEdit.value = true
  Object.assign(formData, row)
  dialogVisible.value = true
}

function handleSave() {
  ElMessage.success(isEdit.value ? "更新成功" : "创建成功")
  dialogVisible.value = false
  fetchData()
}

function handleDelete(row: any) {
  ElMessage.success("删除成功")
}

function handleApprove(row: any) {
  ElMessage.success("准入成功")
}

function handleExport() {
  ElMessage.success("导出成功")
}

function goDetail(row: any) {
  router.push(`/supplier/${row.id}`)
}

function getLevelType(level: string) {
  const map: Record<string, string> = { strategic: "danger", core: "warning", regular: "info" }
  return map[level] || "info"
}

function getStatusColor(status: string) {
  return SUPPLIER_STATUS[status]?.color || "#6b7280"
}

function getStatusLabel(status: string) {
  return SUPPLIER_STATUS[status]?.label || status
}

onMounted(fetchData)
</script>

<style scoped>
.search-card {
  padding: var(--space-md) var(--space-lg);
  margin-bottom: var(--space-md);
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 0;
}

.table-actions {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
}

.table-actions__right {
  margin-left: auto;
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

.status-badge {
  font-size: 13px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  background: rgba(0, 0, 0, 0.04);
}

.risk-badge {
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: var(--radius-full);
}

.risk-badge--low {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.risk-badge--medium {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.risk-badge--high {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.dialog-form {
  padding: var(--space-md) 0;
}
</style>
