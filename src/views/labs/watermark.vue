<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">💧 水印实验室</h1>
      <p class="page-subtitle">全屏水印、图片水印、PDF水印方案演示</p>
    </div>

    <div class="watermark-workspace">
      <div class="card watermark-config">
        <h3 class="section-title">水印配置</h3>
        <el-form :model="config" label-width="100px">
          <el-form-item label="水印文字">
            <el-input v-model="config.text" placeholder="输入水印内容" />
          </el-form-item>
          <el-form-item label="字体颜色">
            <el-color-picker v-model="config.color" />
          </el-form-item>
          <el-form-item label="透明度">
            <el-slider v-model="config.opacity" :min="0" :max="1" :step="0.05" />
          </el-form-item>
          <el-form-item label="旋转角度">
            <el-slider v-model="config.rotation" :min="-90" :max="90" />
          </el-form-item>
          <el-form-item label="字体大小">
            <el-input-number v-model="config.fontSize" :min="12" :max="64" />
          </el-form-item>
          <el-form-item label="水印类型">
            <el-radio-group v-model="config.type">
              <el-radio value="fullscreen">全屏水印</el-radio>
              <el-radio value="tiled">平铺水印</el-radio>
              <el-radio value="single">单点水印</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="applyWatermark">
              <el-icon><MagicStick /></el-icon> 应用水印
            </el-button>
            <el-button @click="clearWatermark">清除水印</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="card watermark-preview" ref="previewRef">
        <h3 class="section-title">预览区域</h3>
        <div class="preview-content">
          <p>这是一段演示文本，水印将覆盖在此区域之上。</p>
          <p>调整左侧参数后点击"应用水印"查看效果。</p>
          <p>水印系统支持全屏覆盖、平铺和单点三种模式。</p>
          <el-image :src="demoImage" style="width: 100%; max-width: 400px; margin-top: var(--space-md)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue"
import { ElMessage } from "element-plus"

const demoImage = "https://picsum.photos/seed/admin/400/250"

const config = reactive({
  text: "Melody-Nexus 机密",
  color: "#667eea",
  opacity: 0.15,
  rotation: -25,
  fontSize: 20,
  type: "fullscreen" as string
})

const previewRef = ref<HTMLElement>()

function createWatermarkCanvas(
  text: string,
  color: string,
  opacity: number,
  rotation: number,
  fontSize: number
): HTMLCanvasElement {
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")!
  const dpr = window.devicePixelRatio || 1

  const cw = 300 * dpr
  const ch = 200 * dpr
  canvas.width = cw
  canvas.height = ch
  canvas.style.width = "300px"
  canvas.style.height = "200px"

  ctx.scale(dpr, dpr)
  ctx.clearRect(0, 0, 300, 200)
  ctx.translate(150, 100)
  ctx.rotate((rotation * Math.PI) / 180)
  ctx.translate(-150, -100)

  ctx.font = `bold ${fontSize}px "PingFang SC", "Microsoft YaHei", sans-serif`
  ctx.fillStyle = color
  ctx.globalAlpha = opacity
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText(text, 150, 100)

  return canvas
}

function applyWatermark() {
  if (!previewRef.value) return
  clearWatermark()

  const canvas = createWatermarkCanvas(config.text, config.color, config.opacity, config.rotation, config.fontSize)
  const dataUrl = canvas.toDataURL("image/png")

  const overlay = document.createElement("div")
  overlay.className = "watermark-overlay"
  const baseStyle = "position: absolute; inset: 0; z-index: 9999; pointer-events: none;"

  if (config.type === "fullscreen") {
    overlay.style.cssText = `${baseStyle} background-image: url(${dataUrl}); background-repeat: repeat; background-size: 300px 200px;`
  } else if (config.type === "tiled") {
    overlay.style.cssText = `${baseStyle} background-image: url(${dataUrl}); background-repeat: repeat; background-size: 150px 100px;`
  } else {
    overlay.style.cssText = `${baseStyle} background-image: url(${dataUrl}); background-repeat: no-repeat; background-position: center;`
  }

  previewRef.value.style.position = "relative"
  previewRef.value.appendChild(overlay)
  ElMessage.success(`水印已应用: "${config.text}"`)
}

function clearWatermark() {
  if (!previewRef.value) return
  previewRef.value.querySelectorAll(".watermark-overlay").forEach((el) => el.remove())
  ElMessage.info("水印已清除")
}
</script>

<style scoped>
.watermark-workspace {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: var(--space-lg);
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 var(--space-md);
  padding-bottom: var(--space-sm);
  border-bottom: 1px solid var(--glass-border);
}

.watermark-config {
  padding: var(--space-lg);
}

.watermark-preview {
  padding: var(--space-lg);
  position: relative;
  min-height: 300px;
}

.preview-content {
  line-height: 2;
  color: var(--text-secondary);
}
</style>
