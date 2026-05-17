<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">{{ $t("purchase.title") }}</h1>
      <p class="page-subtitle">采购订单管理与协同</p>
    </div>

    <!-- Search Filters -->
    <div class="card search-card">
      <el-form :model="searchForm" layout="inline">
        <el-form-item :label="$t('purchase.orderCode')">
          <el-input v-model="searchForm.keyword" :placeholder="$t('common.search')" clearable />
        </el-form-item>
        <el-form-item :label="$t('common.status')">
          <el-select v-model="searchForm.status" clearable :placeholder="$t('common.all')" style="width: 140px">
            <el-option label="全部" value="" />
            <el-option v-for="(v, k) in ORDER_STATUS" :key="k" :label="v.label" :value="k" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('purchase.orderType')">
          <el-select v-model="searchForm.orderType" clearable :placeholder="$t('common.all')" style="width: 140px">
            <el-option label="全部" value="" />
            <el-option label="标准采购" value="standard" />
            <el-option label="紧急采购" value="urgent" />
            <el-option label="框架协议" value="framework" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchData">
            <el-icon><Search /></el-icon>
            {{ $t("common.search") }}
          </el-button>
          <el-button @click="resetSearch">{{ $t("common.reset") }}</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="table-actions">
      <el-button type="primary">
        <el-icon><Plus /></el-icon>
        {{ $t("common.create") }}
      </el-button>
      <el-button>
        <el-icon><Download /></el-icon>
        {{ $t("common.export") }}
      </el-button>
    </div>

    <div class="card table-card">
      <el-table :data="tableData" stripe v-loading="loading" @row-click="goDetail">
        <el-table-column prop="code" :label="$t('purchase.orderCode')" width="160" />
        <el-table-column prop="title" :label="$t('purchase.orderTitle')" min-width="200" />
        <el-table-column prop="supplierName" :label="$t('purchase.supplierName')" width="160" />
        <el-table-column prop="totalAmount" :label="$t('purchase.totalAmount')" width="140" align="right">
          <template #default="{ row }"> ¥{{ row.totalAmount.toLocaleString() }} </template>
        </el-table-column>
        <el-table-column prop="status" :label="$t('common.status')" width="100">
          <template #default="{ row }">
            <span class="status-badge" :style="{ color: ORDER_STATUS[row.status]?.color }">
              {{ ORDER_STATUS[row.status]?.label || row.status }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="orderType" :label="$t('purchase.orderType')" width="100">
          <template #default="{ row }">
            <el-tag :type="row.orderType === 'urgent' ? 'danger' : 'info'" size="small" effect="plain">
              {{ row.orderType === "standard" ? "标准" : row.orderType === "urgent" ? "紧急" : "框架" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="deliveryDate" :label="$t('purchase.deliveryDate')" width="120">
          <template #default="{ row }">
            {{ formatDate(row.deliveryDate, "YYYY-MM-DD") }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.action')" width="140" fixed="right">
          <template #default="{ row }">
            <el-button text type="primary" size="small" @click.stop="handleConfirm(row)">确认</el-button>
            <el-button text type="warning" size="small" @click.stop="handleClose(row)">关闭</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-pagination">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="fetchData"
          @current-change="fetchData"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue"
import { useRouter } from "vue-router"
import { ElMessage } from "element-plus"
import { formatDate } from "@/utils"
import { ORDER_STATUS } from "@/types/dict"

const router = useRouter()

const loading = ref(false)
const total = ref(0)
const tableData = ref<any[]>([])

const mockData = Array.from({ length: 18 }, (_, i) => ({
  id: i + 1,
  code: `PO-${20240000 + i + 1}`,
  title: ["电子元件采购订单", "传感器模组采购", "芯片组批量采购", "连接器采购合同", "PCB板采购"][i % 5],
  supplierName: ["深圳华强科技", "东莞精密制造", "广州天元电子", "苏州博世", "杭州海康"][i % 5],
  totalAmount: Math.floor(Math.random() * 500000) + 10000,
  status: Object.keys(ORDER_STATUS)[i % 6],
  orderType: ["standard", "urgent", "framework"][i % 3],
  deliveryDate: new Date(Date.now() + Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString()
}))

const searchForm = reactive({ keyword: "", status: "", orderType: "" })
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
  searchForm.status = ""
  searchForm.orderType = ""
  fetchData()
}

function goDetail(row: any) {
  router.push(`/purchase/${row.id}`)
}

function handleConfirm(row: any) {
  ElMessage.success("订单已确认")
}

function handleClose(row: any) {
  ElMessage.success("订单已关闭")
}

onMounted(fetchData)
</script>

<style scoped>
.search-card {
  padding: var(--space-md) var(--space-lg);
  margin-bottom: var(--space-md);
}

.table-actions {
  display: flex;
  gap: var(--space-sm);
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

.status-badge {
  font-size: 13px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  background: rgba(0, 0, 0, 0.04);
}
</style>
