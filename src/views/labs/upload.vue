<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">📤 上传实验室</h1>
      <p class="page-subtitle">大文件分片上传、拖拽上传、预览进度</p>
    </div>

    <el-row :gutter="20">
      <el-col :span="12">
        <div class="card">
          <h3 class="section-title">拖拽上传</h3>
          <el-upload class="drop-upload" drag multiple :auto-upload="false" @change="onFileChange">
            <el-icon class="upload-icon" :size="48"><UploadFilled /></el-icon>
            <div class="upload-text">将文件拖拽到此处，或 <em>点击选择文件</em></div>
            <template #tip>
              <div class="upload-tip">支持 PDF、Excel、Word、图片等常用格式，单文件不超过 50MB</div>
            </template>
          </el-upload>
          <div v-if="files.length" class="file-list">
            <div v-for="(f, i) in files" :key="i" class="file-item">
              <el-icon><Document /></el-icon>
              <span class="file-name">{{ f.name }}</span>
              <span class="file-size">{{ (f.size / 1024 / 1024).toFixed(1) }} MB</span>
              <el-tag v-if="f.type.startsWith('image/')" size="small">图片</el-tag>
              <el-tag v-else size="small" type="info">文件</el-tag>
            </div>
          </div>
        </div>
        <div class="card" style="margin-top: var(--space-md)">
          <h3 class="section-title">文件夹上传</h3>
          <el-upload class="drop-upload" drag directory multiple :auto-upload="false" @change="onFolderChange">
            <el-icon class="upload-icon" :size="48"><FolderOpened /></el-icon>
            <div class="upload-text">将文件夹拖拽到此处，或 <em>点击选择文件夹</em></div>
          </el-upload>
          <div v-if="folders.length" class="file-list">
            <div v-for="(f, i) in folders" :key="i" class="file-item">
              <el-icon><Folder /></el-icon>
              <span class="file-name">{{ f.webkitRelativePath || f.name }}</span>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="card">
          <h3 class="section-title">大文件分片上传</h3>
          <el-upload class="shard-upload" :auto-upload="false">
            <el-button type="primary">
              <el-icon><Upload /></el-icon> 选择大文件
            </el-button>
            <template #tip>
              <div class="upload-tip">自动将大文件分割为 5MB 片并发上传</div>
            </template>
          </el-upload>

          <div class="shard-demo">
            <h4>模拟分片传输</h4>
            <div class="shard-list">
              <div
                v-for="(chunk, i) in chunks"
                :key="i"
                class="shard-item"
                :class="{ uploaded: chunk.done, uploading: chunk.active }"
              >
                <span class="shard-index">分片 {{ i + 1 }}</span>
                <span class="shard-size">{{ chunk.size }}</span>
                <span class="shard-status">{{ chunk.done ? "✅" : chunk.active ? "⏳" : "⏸️" }}</span>
              </div>
            </div>
            <el-button type="success" style="margin-top: var(--space-md)" @click="simulateUpload">
              <el-icon><VideoPlay /></el-icon> 模拟分片上传
            </el-button>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue"
import { ElMessage } from "element-plus"

const files = ref<File[]>([])
const folders = ref<File[]>([])

function onFileChange(uploadFile: any) {
  if (uploadFile.raw) {
    files.value.push(uploadFile.raw)
    ElMessage.success(`已添加文件: ${uploadFile.raw.name}`)
  }
}

function onFolderChange(uploadFile: any) {
  if (uploadFile.raw) {
    folders.value.push(uploadFile.raw)
    ElMessage.success(`已添加文件: ${uploadFile.raw.webkitRelativePath || uploadFile.raw.name}`)
  }
}

const chunks = reactive([
  { size: "5.0 MB", done: false, active: false },
  { size: "5.0 MB", done: false, active: false },
  { size: "5.0 MB", done: false, active: false },
  { size: "5.0 MB", done: false, active: false },
  { size: "5.0 MB", done: false, active: false },
  { size: "5.0 MB", done: false, active: false },
  { size: "5.0 MB", done: false, active: false },
  { size: "2.3 MB", done: false, active: false }
])

function simulateUpload() {
  if (chunks.some((c) => c.active)) {
    ElMessage.warning("正在上传中，请等待")
    return
  }
  chunks.forEach((c) => {
    c.done = false
    c.active = false
  })

  ElMessage.info("开始模拟分片上传")
  let i = 0
  const timer = setInterval(() => {
    if (i >= chunks.length) {
      clearInterval(timer)
      ElMessage.success("所有分片上传完成！")
      return
    }
    chunks[i].active = true
    setTimeout(() => {
      chunks[i].done = true
      chunks[i].active = false
      i++
    }, 400)
  }, 600)
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

.card {
  padding: var(--space-lg);
}

.drop-upload {
  display: block;
}

.drop-upload :deep(.el-upload) {
  width: 100%;
}

.drop-upload :deep(.el-upload-dragger) {
  width: 100%;
  background: var(--glass-bg);
  backdrop-filter: blur(4px);
  border: 2px dashed var(--glass-border);
  border-radius: var(--radius-lg);
  padding: 40px 20px;
  transition: all 0.3s ease;
}

.drop-upload :deep(.el-upload-dragger:hover) {
  border-color: var(--primary);
  background: rgba(102, 126, 234, 0.04);
}

.drop-upload :deep(.el-upload-dragger.is-dragover) {
  border-color: var(--primary);
  background: rgba(102, 126, 234, 0.08);
}

.upload-icon {
  color: var(--primary);
  margin-bottom: var(--space-md);
}

.upload-text {
  font-size: 15px;
  color: var(--text-secondary);
}

.upload-text em {
  color: var(--primary);
  font-style: normal;
  font-weight: 500;
}

.upload-tip {
  font-size: 12px;
  color: var(--text-disabled);
  margin-top: var(--space-sm);
  text-align: center;
}

.shard-upload {
  margin-bottom: var(--space-lg);
}

.shard-demo h4 {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 var(--space-md);
}

.shard-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.shard-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: var(--glass-bg);
  border-radius: var(--radius-md);
  border: 1px solid var(--glass-border);
  font-size: 13px;
  transition: all 0.3s ease;
}

.shard-item.uploading {
  border-color: var(--warning);
  background: rgba(245, 158, 11, 0.05);
}

.shard-item.uploaded {
  border-color: var(--success);
  background: rgba(34, 197, 94, 0.05);
}

.shard-index {
  font-weight: 500;
}
.shard-size {
  color: var(--text-disabled);
  font-family: "SF Mono", monospace;
  font-size: 12px;
}

.file-list {
  margin-top: var(--space-md);
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 200px;
  overflow-y: auto;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  background: var(--glass-bg);
  border-radius: var(--radius-md);
  border: 1px solid var(--glass-border);
  font-size: 13px;
}

.file-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-size {
  color: var(--text-disabled);
  font-family: "SF Mono", monospace;
  font-size: 12px;
}
</style>
