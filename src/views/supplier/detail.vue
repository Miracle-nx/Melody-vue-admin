<template>
  <div class="page-container">
    <div class="page-header">
      <el-button text @click="router.back()">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <h1 class="page-title">供应商详情</h1>
    </div>

    <div class="detail-grid">
      <!-- Basic Info -->
      <div class="card">
        <h3 class="detail-section-title">{{ $t("supplier.basicInfo") }}</h3>
        <el-descriptions :column="3" border>
          <el-descriptions-item :label="$t('supplier.code')">{{ supplier.code }}</el-descriptions-item>
          <el-descriptions-item :label="$t('supplier.name')">{{ supplier.name }}</el-descriptions-item>
          <el-descriptions-item :label="$t('common.status')">
            <span class="status-badge" :style="{ color: '#22c55e' }">已准入</span>
          </el-descriptions-item>
          <el-descriptions-item :label="$t('supplier.level')">战略级</el-descriptions-item>
          <el-descriptions-item :label="$t('supplier.category')">电子元器件</el-descriptions-item>
          <el-descriptions-item :label="$t('supplier.contacts')">{{ supplier.contacts }}</el-descriptions-item>
          <el-descriptions-item :label="$t('supplier.phone')">{{ supplier.phone }}</el-descriptions-item>
          <el-descriptions-item :label="$t('supplier.email')">{{ supplier.email }}</el-descriptions-item>
          <el-descriptions-item :label="$t('supplier.address')">{{ supplier.address }}</el-descriptions-item>
          <el-descriptions-item :label="$t('supplier.businessScope')" :span="3">{{
            supplier.businessScope
          }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- Qualification -->
      <div class="card">
        <h3 class="detail-section-title">{{ $t("supplier.qualificationInfo") }}</h3>
        <el-table :data="qualifications" stripe>
          <el-table-column prop="name" label="资质名称" />
          <el-table-column prop="issuer" label="颁发机构" />
          <el-table-column prop="issueDate" label="颁发日期" />
          <el-table-column prop="expiryDate" label="到期日期" />
          <el-table-column prop="status" label="状态">
            <template #default="{ row }">
              <span class="status-badge" :style="{ color: row.status === 'valid' ? '#22c55e' : '#f59e0b' }">
                {{ row.status === "valid" ? "有效" : "即将到期" }}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- Cooperation History -->
      <div class="card">
        <h3 class="detail-section-title">{{ $t("supplier.cooperationHistory") }}</h3>
        <el-table :data="cooperations" stripe>
          <el-table-column prop="orderCode" label="订单编号" width="160" />
          <el-table-column prop="materialName" label="物料名称" />
          <el-table-column prop="amount" label="金额" width="120" align="right" />
          <el-table-column prop="date" label="日期" width="170" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <span class="status-badge" :style="{ color: row.status === 'completed' ? '#22c55e' : '#3b82f6' }">
                {{ row.status === "completed" ? "已完成" : "进行中" }}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue"
import { useRoute, useRouter } from "vue-router"

const route = useRoute()
const router = useRouter()

const supplier = reactive({
  code: "SUP-00001",
  name: "深圳华强科技有限公司",
  contacts: "张三",
  phone: "13800138001",
  email: "contact@hqtech.com",
  address: "深圳市南山区科技园南区R2-B栋",
  businessScope: "电子元器件、集成电路、通讯设备的研发与销售"
})

const qualifications = [
  { name: "ISO 9001质量管理体系", issuer: "SGS", issueDate: "2024-01-15", expiryDate: "2027-01-14", status: "valid" },
  { name: "ISO 14001环境管理体系", issuer: "SGS", issueDate: "2024-03-20", expiryDate: "2027-03-19", status: "valid" },
  {
    name: "安全生产许可证",
    issuer: "广东省应急管理厅",
    issueDate: "2023-06-01",
    expiryDate: "2026-05-31",
    status: "valid"
  },
  {
    name: "高新技术企业证书",
    issuer: "深圳市科技创新委员会",
    issueDate: "2022-09-10",
    expiryDate: "2025-09-09",
    status: "expiring"
  }
]

const cooperations = [
  {
    orderCode: "PO-2024-0056",
    materialName: "集成电路 A100",
    amount: "¥ 128,000.00",
    date: "2024-06-15",
    status: "completed"
  },
  {
    orderCode: "PO-2024-0089",
    materialName: "传感器模组 B200",
    amount: "¥ 256,000.00",
    date: "2024-07-20",
    status: "completed"
  },
  {
    orderCode: "PO-2024-0156",
    materialName: "电源管理芯片 C300",
    amount: "¥ 89,000.00",
    date: "2024-09-01",
    status: "in_progress"
  }
]
</script>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
}

.page-title {
  font-size: 1.4rem;
}

.detail-grid {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.detail-section-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-md);
  padding-bottom: var(--space-sm);
  border-bottom: 1px solid var(--glass-border);
}
</style>
