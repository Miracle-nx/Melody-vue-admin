<template>
  <router-view />
  <ParticlesBackground v-if="isLoggedIn" />
  <div class="gradient-bg" v-if="!isLoggedIn">
    <div class="gradient-bg__orb"></div>
    <div class="gradient-bg__orb"></div>
    <div class="gradient-bg__orb"></div>
    <div class="gradient-bg__orb"></div>
  </div>
  <AiAssistant v-if="isLoggedIn" />
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useAuthStore } from "@/stores/auth"
import ParticlesBackground from "@/components/particles-background.vue"
import AiAssistant from "@/components/ai-assistant.vue"

const authStore = useAuthStore()
const isLoggedIn = computed(() => authStore.isLoggedIn)
</script>

<style>
#app {
  width: 100%;
  height: 100vh;
}
</style>
