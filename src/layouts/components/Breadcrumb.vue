<template>
  <div class="breadcrumb">
    <el-icon :size="14" class="breadcrumb__home"><HomeFilled /></el-icon>
    <el-breadcrumb separator=">">
      <el-breadcrumb-item
        v-for="(item, index) in breadcrumbItems"
        :key="index"
        :to="index < breadcrumbItems.length - 1 ? item.path : undefined"
      >
        {{ item.title }}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useRoute } from "vue-router"

const route = useRoute()

const breadcrumbItems = computed(() => {
  const pathParts = route.path.split("/").filter(Boolean)
  const items: { path: string; title: string }[] = []

  let currentPath = ""
  for (const part of pathParts) {
    currentPath += `/${part}`
    const matched = route.matched.find(
      (r) => r.path === currentPath || r.path.replace(/:\w+/g, "") === currentPath.replace(/\/\d+$/, "")
    )
    if (matched) {
      items.push({
        path: currentPath,
        title: (matched.meta?.title as string) || part
      })
    }
  }

  return items
})
</script>

<style scoped>
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
}

.breadcrumb__home {
  color: var(--text-disabled);
}

:deep(.el-breadcrumb) {
  font-size: 13px;
}

:deep(.el-breadcrumb__inner) {
  color: var(--text-secondary) !important;
  font-weight: 400;
}

:deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
  color: var(--text-primary) !important;
  font-weight: 500;
}
</style>
