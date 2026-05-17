<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">📥 导出实验室</h1>
      <p class="page-subtitle">Excel、PDF、CSV 导出功能演示</p>
    </div>

    <el-row :gutter="20">
      <el-col :span="8">
        <div class="card export-card" @click="handleExport('excel')">
          <div class="export-icon" style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%)">
            <el-icon :size="36"><Document /></el-icon>
          </div>
          <h3>导出 Excel</h3>
          <p>将当前表格数据导出为 .xlsx 格式</p>
          <div class="export-features">
            <span class="feature-tag">多 Sheet</span>
            <span class="feature-tag">合并单元格</span>
            <span class="feature-tag">样式定制</span>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="card export-card" @click="handleExport('pdf')">
          <div class="export-icon" style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%)">
            <el-icon :size="36"><Reading /></el-icon>
          </div>
          <h3>导出 PDF</h3>
          <p>将当前页面或报表导出为 PDF 格式</p>
          <div class="export-features">
            <span class="feature-tag">分页</span>
            <span class="feature-tag">页眉页脚</span>
            <span class="feature-tag">水印</span>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="card export-card" @click="handleExport('csv')">
          <div class="export-icon" style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)">
            <el-icon :size="36"><DataAnalysis /></el-icon>
          </div>
          <h3>导出 CSV</h3>
          <p>将数据导出为 .csv 通用格式</p>
          <div class="export-features">
            <span class="feature-tag">编码选择</span>
            <span class="feature-tag">大数据量</span>
            <span class="feature-tag">兼容性</span>
          </div>
        </div>
      </el-col>
    </el-row>

    <div class="card" style="margin-top: var(--space-lg); padding: var(--space-lg)">
      <h3 class="section-title">导出预览</h3>
      <el-table :data="previewData" border stripe max-height="300">
        <el-table-column prop="date" label="日期" width="120" />
        <el-table-column prop="orderNo" label="订单号" width="180" />
        <el-table-column prop="supplier" label="供应商" min-width="180" />
        <el-table-column prop="amount" label="金额" width="120" align="right" />
        <el-table-column prop="status" label="状态" width="100" />
      </el-table>
      <div style="margin-top: var(--space-md); display: flex; gap: var(--space-sm)">
        <el-button type="primary" @click="handleExport('excel')">
          <el-icon><Download /></el-icon> 导出 Excel
        </el-button>
        <el-button type="danger" @click="handleExport('pdf')">
          <el-icon><Download /></el-icon> 导出 PDF
        </el-button>
        <el-button @click="handleExport('csv')">
          <el-icon><Download /></el-icon> 导出 CSV
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue"
import { ElMessage } from "element-plus"
import * as XLSX from "xlsx"
import { jsPDF } from "jspdf"
import "jspdf-autotable"
import { saveAs } from "file-saver"

const previewData = reactive([
  {
    date: "2024-01-15",
    orderNo: "PO-20240115-001",
    supplier: "宁波舜宇光电有限公司",
    amount: "¥325,000.00",
    status: "已审核"
  },
  {
    date: "2024-01-14",
    orderNo: "PO-20240114-002",
    supplier: "苏州汇川技术有限公司",
    amount: "¥128,500.00",
    status: "待审核"
  },
  {
    date: "2024-01-13",
    orderNo: "PO-20240113-003",
    supplier: "深圳大族激光科技",
    amount: "¥2,350,000.00",
    status: "已完成"
  },
  { date: "2024-01-12", orderNo: "PO-20240112-004", supplier: "杭州海康威视", amount: "¥89,200.00", status: "已审核" },
  { date: "2024-01-11", orderNo: "PO-20240111-005", supplier: "北京四方继保", amount: "¥560,000.00", status: "已关闭" }
])

async function handleExport(type: string) {
  ElMessage.info(`正在导出 ${type.toUpperCase()} 文件...`)
  try {
    switch (type) {
      case "excel":
        await exportExcel()
        break
      case "pdf":
        await exportPdf()
        break
      case "csv":
        exportCsv()
        break
    }
  } catch (e) {
    ElMessage.error("导出失败：" + (e as Error).message)
  }
}

function exportExcel() {
  const ws = XLSX.utils.json_to_sheet(
    previewData.map((r) => ({
      日期: r.date,
      订单号: r.orderNo,
      供应商: r.supplier,
      金额: r.amount,
      状态: r.status
    }))
  )
  ws["!cols"] = [{ wch: 14 }, { wch: 22 }, { wch: 22 }, { wch: 14 }, { wch: 10 }]
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, "采购订单")
  const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" })
  saveAs(new Blob([buf]), `采购订单_${new Date().toISOString().slice(0, 10)}.xlsx`)
  ElMessage.success("Excel 导出完成！")
}

function exportPdf() {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" })
  doc.setFontSize(16)
  doc.text("采购订单报表", 14, 20)
  doc.setFontSize(10)
  doc.text(`生成日期: ${new Date().toLocaleDateString("zh-CN")}`, 14, 28)
  ;(doc as any).autoTable({
    startY: 34,
    head: [["日期", "订单号", "供应商", "金额", "状态"]],
    body: previewData.map((r) => [r.date, r.orderNo, r.supplier, r.amount, r.status]),
    theme: "striped",
    headStyles: { fillColor: [102, 126, 234] },
    styles: { fontSize: 9 }
  })
  doc.save(`采购订单_${new Date().toISOString().slice(0, 10)}.pdf`)
  ElMessage.success("PDF 导出完成！")
}

function exportCsv() {
  const headers = ["日期", "订单号", "供应商", "金额", "状态"]
  const rows = previewData.map((r) => [r.date, r.orderNo, r.supplier, r.amount, r.status])
  const csvContent = [headers.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join("\n")
  const bom = "\uFEFF"
  saveAs(
    new Blob([bom + csvContent], { type: "text/csv;charset=utf-8" }),
    `采购订单_${new Date().toISOString().slice(0, 10)}.csv`
  )
  ElMessage.success("CSV 导出完成！")
}
</script>

<style scoped>
.section-title {
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 var(--space-md);
  padding-bottom: var(--space-sm);
  border-bottom: 1px solid var(--glass-border);
}

.export-card {
  padding: var(--space-lg);
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
}

.export-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.export-icon {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  margin: 0 auto var(--space-md);
}

.export-card h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: var(--space-sm);
}

.export-card p {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: var(--space-md);
}

.export-features {
  display: flex;
  gap: 6px;
  justify-content: center;
  flex-wrap: wrap;
}

.feature-tag {
  font-size: 11px;
  padding: 2px 8px;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-full);
  color: var(--text-secondary);
}
</style>
