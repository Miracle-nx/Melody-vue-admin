<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">🖨️ 打印实验室</h1>
      <p class="page-subtitle">批量打印、套打、条码/二维码打印示例</p>
    </div>

    <el-row :gutter="20">
      <el-col :span="12">
        <div class="card">
          <h3 class="section-title">基础打印测试</h3>
          <div class="print-preview">
            <div class="print-card" ref="printContent">
              <div class="print-header">
                <h2>采购订单</h2>
                <p>PO-20240101-0001</p>
              </div>
              <table class="print-table">
                <tr>
                  <th>供应商</th>
                  <td>宁波舜宇光电有限公司</td>
                  <th>日期</th>
                  <td>2024-01-15</td>
                </tr>
                <tr>
                  <th>物料名称</th>
                  <td>光学镜头模组</td>
                  <th>数量</th>
                  <td>10,000 PCS</td>
                </tr>
                <tr>
                  <th>单价</th>
                  <td>¥32.50</td>
                  <th>金额</th>
                  <td>¥325,000.00</td>
                </tr>
              </table>
            </div>
            <el-button class="print-btn" type="primary" @click="handlePrint">
              <el-icon><Printer /></el-icon> 打印此卡片
            </el-button>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="card">
          <h3 class="section-title">条码/二维码打印</h3>
          <div style="display: flex; gap: var(--space-lg); justify-content: center; padding: var(--space-lg)">
            <div class="barcode-demo">
              <div class="barcode-demo">
                <canvas ref="barcodeCanvas" width="260" height="80"></canvas>
                <p>PO-20240115-001</p>
              </div>
            </div>
            <div class="qrcode-demo">
              <canvas ref="qrcodeCanvas" width="130" height="130"></canvas>
            </div>
          </div>
          <el-button class="print-btn" type="success" @click="handleBarcodePrint">
            <el-icon><Printer /></el-icon> 打印条码/二维码
          </el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { ElMessage } from "element-plus"
import QRCode from "qrcode"

const printContent = ref<HTMLElement>()
const barcodeCanvas = ref<HTMLCanvasElement>()
const qrcodeCanvas = ref<HTMLCanvasElement>()

const BARCODE_NUM = "20240115-001"
const QR_DATA = "https://melody-nexus.example.com/order/PO-20240115-001"

function drawBarcode(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d")!
  const dpr = window.devicePixelRatio || 1
  const w = 260,
    h = 80
  canvas.width = w * dpr
  canvas.height = h * dpr
  canvas.style.width = w + "px"
  canvas.style.height = h + "px"
  ctx.scale(dpr, dpr)

  ctx.fillStyle = "#fff"
  ctx.fillRect(0, 0, w, h)

  // Simulate a Code128-like barcode by drawing varied-width bars
  const pattern = [
    2, 1, 3, 1, 1, 2, 4, 1, 2, 1, 3, 2, 1, 1, 4, 2, 1, 3, 1, 2, 4, 1, 1, 2, 2, 3, 1, 2, 1, 1, 4, 1, 3, 2, 1, 2
  ]
  const digits = BARCODE_NUM.replace(/-/g, "")
  const barWidth = w / (pattern.length + 2)
  let x = barWidth

  ctx.fillStyle = "#000"
  for (let i = 0; i < pattern.length; i++) {
    const bw = barWidth * (pattern[i] / 5) * 0.8
    if (i % 3 !== 1) {
      ctx.fillRect(x, 8, Math.max(bw, 1), 50)
    }
    x += barWidth
  }

  ctx.fillStyle = "#000"
  ctx.font = "bold 12px Courier New"
  ctx.textAlign = "center"
  ctx.fillText(BARCODE_NUM, w / 2, h - 4)
}

async function drawQR() {
  if (!qrcodeCanvas.value) return
  await QRCode.toCanvas(qrcodeCanvas.value, QR_DATA, {
    width: 130,
    margin: 2,
    color: { dark: "#000000", light: "#ffffff" }
  })
}

onMounted(() => {
  if (barcodeCanvas.value) drawBarcode(barcodeCanvas.value)
  drawQR()
})

function handlePrint() {
  const content = printContent.value?.outerHTML || ""
  const win = window.open("", "", "width=800,height=600")
  if (win) {
    win.document.write(`<html><head><title>打印</title><style>
      body { font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif; padding: 40px; }
      .print-card { max-width: 600px; margin: 0 auto; }
      .print-header { text-align: center; margin-bottom: 24px; }
      .print-header h2 { margin: 0; font-size: 20px; }
      .print-header p { color: #999; margin: 4px 0 0; }
      .print-table { width: 100%; border-collapse: collapse; }
      .print-table th, .print-table td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; font-size: 13px; }
      .print-table th { background: #f5f5f5; font-weight: 600; width: 80px; }
</style></head><body>${content}</body></html>`)
    win.print()
  }
}

function handleBarcodePrint() {
  const win = window.open("", "", "width=600,height=400")
  if (win) {
    win.document.write(`<html><head><title>条码打印</title><style>
      body { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; font-family: 'PingFang SC', sans-serif; }
      canvas { margin-bottom: 8px; }
      p { font-family: 'Courier New', monospace; font-size: 14px; margin: 0; }
    </style></head><body>
      <canvas id="bc" width="260" height="80"></canvas>
      <p>${BARCODE_NUM}</p>
      <canvas id="qr" width="130" height="130" style="margin-top:16px"></canvas>
      <script>
        const bc = document.getElementById('bc');
        const ctx = bc.getContext('2d');
        ctx.fillStyle = '#fff';
        ctx.fillRect(0,0,260,80);
        const pattern = [2,1,3,1,1,2,4,1,2,1,3,2,1,1,4,2,1,3,1,2,4,1,1,2,2,3,1,2,1,1,4,1,3,2,1,2];
        const barW = 260/(pattern.length+2);
        let x = barW;
        ctx.fillStyle = '#000';
        for(let i=0;i<pattern.length;i++){
          const bw = barW*(pattern[i]/5)*0.8;
          if(i%3!==1) ctx.fillRect(x,8,Math.max(bw,1),50);
          x+=barW;
        }
        ctx.fillStyle='#000';
        ctx.font='bold 12px Courier New';
        ctx.textAlign='center';
        ctx.fillText('${BARCODE_NUM}',130,74);
        const qr = document.getElementById('qr');
        // QR rendered via qrcode lib not available in popup, render a simple grid
        const qctx = qr.getContext('2d');
        qctx.fillStyle='#fff';
        qctx.fillRect(0,0,130,130);
        qctx.fillStyle='#000';
        const cell=13, size=130;
        const data=['11111011101110111110','10100010110010100010','11101010101010101110','10101010110100100101','11101011101011101110','10101000100101010101','11101010110111100110','10100010110100100100','11111010100010111111','01111010101110100010','11111011101110110111','10101110100101110101','11111010111011101011','10100110100101110100','11111010110111011110','10101000111100101001','11111011101111101011','10100010110001101000','11111010101110011111','01011010101011100010'];
        for(let r=0;r<20;r++){
          for(let c=0;c<20;c++){
            if(data[r][c]==='1') qctx.fillRect(c*cell,r*cell,cell,cell);
          }
        }
        window.print();
      <\/script>
    </body></html>`)
  }
  ElMessage.success("条码打印任务已提交")
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

.print-preview {
  text-align: center;
}

.print-card {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: var(--space-md);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.print-header {
  text-align: center;
  margin-bottom: 20px;
}
.print-header h2 {
  margin: 0;
  font-size: 18px;
  color: #333;
}
.print-header p {
  color: #999;
  margin: 4px 0 0;
  font-size: 13px;
}

.print-table {
  width: 100%;
  border-collapse: collapse;
}
.print-table th,
.print-table td {
  border: 1px solid #ddd;
  padding: 8px 12px;
  text-align: left;
  font-size: 13px;
  color: #333;
}
.print-table th {
  background: #f5f5f5;
  font-weight: 600;
}

.print-btn {
  width: 100%;
  margin-top: var(--space-sm);
}

.barcode-demo,
.qrcode-demo {
  text-align: center;
}

.barcode-placeholder {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.barcode-lines {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  justify-content: center;
  height: 70px;
}

.barcode-bar {
  background: #333;
  border-radius: 1px;
}

.barcode-placeholder p {
  font-family: "Courier New", monospace;
  font-size: 13px;
  margin: 8px 0 0;
  color: #666;
}

.qrcode-placeholder {
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.qrcode-grid {
  display: grid;
  grid-template-columns: repeat(10, 12px);
  gap: 2px;
}

.qrcode-cell {
  width: 12px;
  height: 12px;
  background: #fff;
  border: 1px solid #eee;
}

.qrcode-cell.filled {
  background: #333;
  border-color: #333;
}
</style>
