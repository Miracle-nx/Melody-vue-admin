<template>
  <div class="page-container">
    <div class="page-header">
      <el-button text @click="router.back()">
        <el-icon><ArrowLeft /></el-icon> 返回
      </el-button>
      <h1 class="page-title">订单详情</h1>
    </div>

    <div class="card">
      <h3 class="detail-section-title">订单信息</h3>
      <el-descriptions :column="3" border>
        <el-descriptions-item label="订单编号">PO-2024-0089</el-descriptions-item>
        <el-descriptions-item label="订单标题">传感器模组批量采购</el-descriptions-item>
        <el-descriptions-item label="供应商">东莞精密制造有限公司</el-descriptions-item>
        <el-descriptions-item label="订单类型">标准采购</el-descriptions-item>
        <el-descriptions-item label="总金额">¥ 256,000.00</el-descriptions-item>
        <el-descriptions-item label="交货日期">2024-11-30</el-descriptions-item>
        <el-descriptions-item label="创建时间">2024-09-15 10:30:00</el-descriptions-item>
        <el-descriptions-item label="订单状态">
          <span class="status-badge" style="color: #3b82f6">已确认</span>
        </el-descriptions-item>
        <el-descriptions-item label="备注">请确保包装符合防静电要求</el-descriptions-item>
      </el-descriptions>
    </div>

    <div class="card" style="margin-top: var(--space-md)">
      <h3 class="detail-section-title">订单明细</h3>
      <el-table :data="orderItems" stripe>
        <el-table-column prop="materialCode" label="物料编码" width="140" />
        <el-table-column prop="materialName" label="物料名称" min-width="160" />
        <el-table-column prop="spec" label="规格型号" width="140" />
        <el-table-column prop="unit" label="单位" width="60" />
        <el-table-column prop="quantity" label="数量" width="80" align="right" />
        <el-table-column prop="unitPrice" label="单价" width="120" align="right">
          <template #default="{ row }">¥{{ row.unitPrice.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="totalPrice" label="总价" width="140" align="right">
          <template #default="{ row }">¥{{ row.totalPrice.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="deliveryDate" label="交货日期" width="120">
          <template #default="{ row }">{{ formatDate(row.deliveryDate, "YYYY-MM-DD") }}</template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="100" />
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue"
import { useRouter } from "vue-router"
import { formatDate } from "@/utils"

const router = useRouter()

const orderItems = reactive([
  {
    materialCode: "IC-A100-X",
    materialName: "传感器模组 A100",
    spec: "SMD-8",
    unit: "PCS",
    quantity: 5000,
    unitPrice: 32.5,
    totalPrice: 162500,
    deliveryDate: new Date().toISOString(),
    remark: ""
  },
  {
    materialCode: "IC-B200-Y",
    materialName: "传感器模组 B200",
    spec: "SMD-12",
    unit: "PCS",
    quantity: 2000,
    unitPrice: 46.75,
    totalPrice: 93500,
    deliveryDate: new Date().toISOString(),
    remark: "急用"
  }
])
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

.detail-section-title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: var(--space-md);
  padding-bottom: var(--space-sm);
  border-bottom: 1px solid var(--glass-border);
}
</style>
