<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">{{ $t("region.title") }}</h1>
      <p class="page-subtitle">行政区划基础数据管理</p>
    </div>

    <div class="card" style="padding: 0; overflow: hidden">
      <div class="region-container">
        <div class="region-tree">
          <div class="region-tree__header">
            <h3>行政区划树</h3>
            <el-button text type="primary" size="small">
              <el-icon><Expand /></el-icon> 展开全部
            </el-button>
          </div>
          <el-tree
            :data="regionTree"
            :props="treeProps"
            node-key="code"
            default-expand-all
            highlight-current
            @node-click="handleNodeClick"
            class="glass-tree"
          >
            <template #default="{ node, data }">
              <span class="tree-node">
                <el-icon :size="16" style="color: var(--primary)">
                  <MapLocation v-if="data.level === 1" />
                  <OfficeBuilding v-else-if="data.level === 2" />
                  <HomeFilled v-else />
                </el-icon>
                <span>{{ data.name }}</span>
                <span class="tree-node__code">{{ data.code }}</span>
              </span>
            </template>
          </el-tree>
        </div>
        <div class="region-content">
          <div class="region-content__header">
            <h3>{{ selectedRegion?.name || "请选择区域" }}</h3>
            <div v-if="selectedRegion" class="region-content__actions">
              <el-button size="small" @click="handleEdit">编辑</el-button>
              <el-button size="small" type="danger" plain @click="handleDelete">删除</el-button>
              <el-button size="small" type="primary" @click="handleAddChild">新增子级</el-button>
            </div>
          </div>
          <div v-if="selectedRegion" class="region-content__body">
            <el-descriptions :column="2" border>
              <el-descriptions-item label="行政编码">{{ selectedRegion.code }}</el-descriptions-item>
              <el-descriptions-item label="名称">{{ selectedRegion.name }}</el-descriptions-item>
              <el-descriptions-item label="级别">
                {{ selectedRegion.level === 1 ? "省/直辖市" : selectedRegion.level === 2 ? "地级市" : "区/县" }}
              </el-descriptions-item>
              <el-descriptions-item label="上级编码">{{ selectedRegion.parentCode || "-" }}</el-descriptions-item>
              <el-descriptions-item label="经度">{{ selectedRegion.lng || "-" }}</el-descriptions-item>
              <el-descriptions-item label="纬度">{{ selectedRegion.lat || "-" }}</el-descriptions-item>
            </el-descriptions>
          </div>
          <div v-else class="region-content__empty">
            <el-empty :description="$t('common.search')" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue"
import { ElMessage } from "element-plus"

const treeProps = { children: "children", label: "name" }
const selectedRegion = ref<any>(null)

const regionTree = reactive([
  {
    name: "广东省",
    code: "440000",
    level: 1,
    children: [
      {
        name: "广州市",
        code: "440100",
        level: 2,
        children: [
          { name: "天河区", code: "440106", level: 3, parentCode: "440100" },
          { name: "南沙区", code: "440115", level: 3, parentCode: "440100" },
          { name: "黄埔区", code: "440112", level: 3, parentCode: "440100" }
        ]
      },
      {
        name: "深圳市",
        code: "440300",
        level: 2,
        children: [
          { name: "南山区", code: "440305", level: 3, parentCode: "440300" },
          { name: "福田区", code: "440304", level: 3, parentCode: "440300" },
          { name: "宝安区", code: "440306", level: 3, parentCode: "440300" }
        ]
      },
      {
        name: "东莞市",
        code: "441900",
        level: 2,
        children: [
          { name: "南城街道", code: "441900003", level: 3, parentCode: "441900" },
          { name: "长安镇", code: "441900004", level: 3, parentCode: "441900" }
        ]
      }
    ]
  },
  {
    name: "浙江省",
    code: "330000",
    level: 1,
    children: [
      {
        name: "杭州市",
        code: "330100",
        level: 2,
        children: [
          { name: "西湖区", code: "330106", level: 3, parentCode: "330100" },
          { name: "滨江区", code: "330108", level: 3, parentCode: "330100" }
        ]
      },
      {
        name: "宁波市",
        code: "330200",
        level: 2,
        children: [{ name: "海曙区", code: "330203", level: 3, parentCode: "330200" }]
      }
    ]
  }
])

function handleNodeClick(data: any) {
  selectedRegion.value = data
}

function handleEdit() {
  ElMessage.info("编辑功能待实现")
}

function handleDelete() {
  ElMessage.info("删除功能待实现")
}

function handleAddChild() {
  ElMessage.info("新增子级功能待实现")
}
</script>

<style scoped>
.region-container {
  display: flex;
  height: 600px;
}

.region-tree {
  width: 320px;
  border-right: 1px solid var(--glass-border);
  overflow-y: auto;
}

.region-tree__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-md) var(--space-lg);
  border-bottom: 1px solid var(--glass-border);
}

.region-tree__header h3 {
  font-size: 14px;
  font-weight: 600;
}

.region-tree :deep(.el-tree) {
  background: transparent;
}

.region-tree :deep(.el-tree-node__content) {
  height: 40px;
  padding: 0 var(--space-lg);
}

.region-tree :deep(.el-tree-node__content:hover) {
  background: rgba(102, 126, 234, 0.06);
}

.region-tree :deep(.el-tree-node.is-current > .el-tree-node__content) {
  background: rgba(102, 126, 234, 0.1);
  color: var(--primary);
}

.tree-node {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.tree-node__code {
  font-size: 11px;
  color: var(--text-disabled);
  margin-left: auto;
  font-family: "SF Mono", monospace;
}

.region-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.region-content__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-md) var(--space-lg);
  border-bottom: 1px solid var(--glass-border);
}

.region-content__header h3 {
  font-size: 16px;
  font-weight: 600;
}

.region-content__actions {
  display: flex;
  gap: 8px;
}

.region-content__body {
  padding: var(--space-lg);
}

.region-content__empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
