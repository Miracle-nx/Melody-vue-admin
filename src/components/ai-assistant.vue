<template>
  <div class="ai-assistant">
    <!-- Floating Button -->
    <Transition name="scale-fade">
      <button v-if="!expanded" class="ai-toggle" @click="expanded = true">
        <div class="ai-toggle__pulse" />
        <svg viewBox="0 0 24 24" class="ai-toggle__icon" fill="none" stroke="currentColor" stroke-width="2">
          <path
            d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1.27A7 7 0 0 1 14 23h-4a7 7 0 0 1-5.73-3H3a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"
          />
        </svg>
      </button>
    </Transition>

    <!-- Chat Panel -->
    <Transition name="slide-up">
      <div v-if="expanded" class="ai-panel glass-panel">
        <!-- Header -->
        <div class="ai-panel__header">
          <div class="ai-panel__header-left">
            <div class="ai-avatar">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                <path
                  d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1.27A7 7 0 0 1 14 23h-4a7 7 0 0 1-5.73-3H3a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"
                />
              </svg>
            </div>
            <span>AI 助手</span>
          </div>
          <button class="ai-panel__close" @click="expanded = false">
            <el-icon><Close /></el-icon>
          </button>
        </div>

        <!-- Messages -->
        <div ref="messagesRef" class="ai-panel__body">
          <div
            v-for="(msg, i) in messages"
            :key="i"
            class="ai-message"
            :class="{ 'is-user': msg.role === 'user', 'is-ai': msg.role === 'assistant' }"
          >
            <div v-if="msg.role === 'assistant'" class="ai-message__avatar">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                <path
                  d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1.27A7 7 0 0 1 14 23h-4a7 7 0 0 1-5.73-3H3a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"
                />
              </svg>
            </div>
            <div class="ai-message__content" v-html="renderMarkdown(msg.content)" />
          </div>
          <div v-if="loading" class="ai-message is-ai">
            <div class="ai-message__avatar">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                <path
                  d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1.27A7 7 0 0 1 14 23h-4a7 7 0 0 1-5.73-3H3a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"
                />
              </svg>
            </div>
            <div class="ai-message__content typing"><span class="dot" /><span class="dot" /><span class="dot" /></div>
          </div>
        </div>

        <!-- Input -->
        <div class="ai-panel__footer">
          <input v-model="input" class="ai-input" :placeholder="'输入消息...'" @keydown.enter="sendMessage" />
          <button class="ai-send" :disabled="!input.trim() || loading" @click="sendMessage">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 2L11 13" />
              <path d="M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue"

const expanded = ref(false)
const input = ref("")
const loading = ref(false)
const messagesRef = ref<HTMLDivElement>()

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

const messages = ref<ChatMessage[]>([
  {
    role: "assistant",
    content:
      "你好！我是 Melody Nexus AI 助手，可以帮你：\n\n• 📊 **数据分析** — 查看业务报表与趋势\n• 🔍 **快速导航** — 跳转系统功能模块\n• 💡 **使用建议** — 获取操作指导\n• 🛠 **问题排查** — 快速定位系统异常"
  }
])

const predefinedAnswers: Record<string, string> = {
  default:
    '我是 Melody Nexus 智能助手，当前版本为预览阶段。以下是我的核心能力：\n\n1.  **智能导航**: "打开采购管理"、"跳转质量看板"\n2.  **数据分析**: 支持查看系统当前概览数据\n3.  **操作指引**: 提供各模块使用帮助\n4.  **系统状态**: 检查服务运行情况\n\n> 需要什么帮助可以直接输入问题，或点击右上角 ❌ 关闭',
  "你好|hi|hello": "你好！👋 欢迎使用 Melody Nexus 智能管理系统。有什么我可以帮你的吗？",
  "采购|采购管理":
    "**采购管理模块** 包含以下功能：\n\n• 📋 **采购订单** - 创建与跟踪采购订单\n• ✅ **订单确认** - 供应商确认与排期\n• 📦 **到货管理** - 收货与入库协同\n• 📄 **发票管理** - 采购发票核对\n• 📊 **采购看板** - 采购数据可视化\n\n> 点击左侧菜单「采购管理」即可使用",
  "供应商|供应商管理":
    "**供应商管理模块** 包含：\n\n• 🏢 **供应商主档** - 供应商信息维护\n• ✅ **准入审核** - 供应商资质审核\n• ⭐ **白名单** - 优质供应商管理\n• 📜 **资质维护** - 证照到期提醒\n• 📊 **绩效评估** - 供应商绩效看板\n\n> 点击左侧菜单「供应商管理」即可使用",
  "质量|质量管理|质量问题":
    "**质量管理模块** 包含：\n\n• 🔍 **来料检验** - 来料质量检测\n• ⚠️ **问题单管理** - 质量问题追踪\n• 🔄 **整改闭环** - 8D整改流程\n• 📊 **质量看板** - 质量数据分析\n\n> 点击左侧菜单「质量管理」即可使用",
  "导航|跳转|打开":
    '请告诉我你想导航到哪个模块，例如：\n- "跳转到采购管理"\n- "打开质量看板"\n- "去供应商管理"\n\n系统将自动为你导航到对应页面。',
  "帮助|功能|能力":
    "**Melody Nexus 系统功能概览** 🚀\n\n📊 **仪表盘** — 系统运行全景看板\n🏢 **供应商管理** — 全生命周期管理\n📋 **采购管理** — 采购协同全流程\n🔍 **质量管理** — 质量闭环管理\n📝 **接口日志** — 系统调用监控\n🗺 **行政区划** — 基础数据维护\n🧪 **实验室** — 打印/水印/导出工具箱\n\n> 当前版本 v1.0.0 | 技术栈: Vue3 + Vite + Element Plus"
}

function matchAnswer(inputText: string): string {
  const lower = inputText.toLowerCase()
  for (const [pattern, answer] of Object.entries(predefinedAnswers)) {
    if (pattern.includes("|")) {
      const keywords = pattern.split("|")
      if (keywords.some((k) => lower.includes(k))) return answer
    }
  }
  return predefinedAnswers.default
}

function renderMarkdown(text: string): string {
  return text
    .replace(/### (.+)/g, '<h3 class="md-h3">$1</h3>')
    .replace(/## (.+)/g, '<h2 class="md-h2">$2</h2>')
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^> (.+)/gm, "<blockquote>$1</blockquote>")
    .replace(/^- (.+)/gm, "<li>$1</li>")
    .replace(/\n/g, "<br/>")
}

async function sendMessage() {
  const text = input.value.trim()
  if (!text || loading.value) return

  messages.value.push({ role: "user", content: text })
  input.value = ""
  loading.value = true

  // Scroll to bottom
  await nextTick()
  scrollToBottom()

  // Simulate AI thinking
  setTimeout(
    async () => {
      const answer = matchAnswer(text)
      messages.value.push({ role: "assistant", content: answer })
      loading.value = false
      await nextTick()
      scrollToBottom()
    },
    600 + Math.random() * 400
  )
}

function scrollToBottom() {
  if (messagesRef.value) {
    messagesRef.value.scrollTop = messagesRef.value.scrollHeight
  }
}
</script>

<style scoped>
.ai-assistant {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
}

.ai-toggle {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #6366f1, #06b6d4);
  color: #fff;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.ai-toggle:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 30px rgba(99, 102, 241, 0.6);
}

.ai-toggle__pulse {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 2px solid rgba(99, 102, 241, 0.3);
  animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse-ring {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

.ai-toggle__icon {
  width: 28px;
  height: 28px;
}

.ai-panel {
  position: absolute;
  bottom: 68px;
  right: 0;
  width: 360px;
  height: 520px;
  background: rgba(15, 15, 35, 0.92);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
}

.ai-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.ai-panel__header-left {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 600;
  color: #e2e8f0;
}

.ai-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #06b6d4);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.ai-panel__close {
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: all 0.2s;
}

.ai-panel__close:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #e2e8f0;
}

.ai-panel__body {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ai-message {
  display: flex;
  gap: 8px;
  max-width: 85%;
}

.ai-message.is-user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.ai-message__avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #06b6d4);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}

.ai-message.is-user .ai-message__avatar {
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
}

.ai-message__content {
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 13px;
  line-height: 1.6;
  word-break: break-word;
}

.ai-message.is-ai .ai-message__content {
  background: rgba(99, 102, 241, 0.12);
  color: #cbd5e1;
  border: 1px solid rgba(99, 102, 241, 0.15);
  border-radius: 12px 12px 12px 4px;
}

.ai-message.is-user .ai-message__content {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff;
  border-radius: 12px 12px 4px 12px;
}

.ai-panel__footer {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.ai-input {
  flex: 1;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 10px 14px;
  color: #e2e8f0;
  font-size: 13px;
  outline: none;
  transition: all 0.2s;
}

.ai-input:focus {
  border-color: #6366f1;
  background: rgba(99, 102, 241, 0.08);
}

.ai-input::placeholder {
  color: #64748b;
}

.ai-send {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.ai-send:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
}

.ai-send:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Typing animation */
.typing {
  display: flex;
  gap: 4px;
  align-items: center;
  padding: 12px 16px !important;
}
.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #6366f1;
  animation: typing 1.4s infinite;
}
.dot:nth-child(2) {
  animation-delay: 0.2s;
}
.dot:nth-child(3) {
  animation-delay: 0.4s;
}
@keyframes typing {
  0%,
  60%,
  100% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  30% {
    opacity: 1;
    transform: scale(1);
  }
}

/* Scrollbar */
.ai-panel__body::-webkit-scrollbar {
  width: 4px;
}
.ai-panel__body::-webkit-scrollbar-track {
  background: transparent;
}
.ai-panel__body::-webkit-scrollbar-thumb {
  background: rgba(99, 102, 241, 0.3);
  border-radius: 2px;
}

/* Transitions */
.scale-fade-enter-active,
.scale-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.scale-fade-enter-from,
.scale-fade-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Markdown styles */
:deep(.md-h3) {
  font-size: 14px;
  font-weight: 600;
  margin: 8px 0 4px;
  color: #e2e8f0;
}
:deep(.md-h2) {
  font-size: 15px;
  font-weight: 700;
  margin: 10px 0 4px;
  color: #f1f5f9;
}
:deep(strong) {
  color: #a5b4fc;
}
:deep(blockquote) {
  border-left: 3px solid #6366f1;
  padding-left: 10px;
  margin: 6px 0;
  color: #94a3b8;
  font-style: italic;
}
:deep(li) {
  margin: 2px 0;
  padding-left: 4px;
}
</style>
