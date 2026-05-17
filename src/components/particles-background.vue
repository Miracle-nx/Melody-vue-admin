<template>
  <div ref="container" class="particles-background" />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue"
import * as THREE from "three"

const container = ref<HTMLDivElement>()

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let particles: THREE.Points
let mouseX = 0
let mouseY = 0
let animationId: number

function init() {
  if (!container.value) return

  const width = container.value.clientWidth
  const height = container.value.clientHeight

  scene = new THREE.Scene()
  scene.fog = new THREE.Fog(0x0a0a1a, 100, 300)

  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
  camera.position.z = 150

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  container.value.appendChild(renderer.domElement)

  // Particles
  const geometry = new THREE.BufferGeometry()
  const count = 2000
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)

  const color1 = new THREE.Color(0x6366f1)
  const color2 = new THREE.Color(0x06b6d4)

  for (let i = 0; i < count; i++) {
    const radius = 80 + Math.random() * 60
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = radius * Math.cos(phi)

    const c = color1.clone().lerp(color2, Math.random())
    colors[i * 3] = c.r
    colors[i * 3 + 1] = c.g
    colors[i * 3 + 2] = c.b

    sizes[i] = 0.5 + Math.random() * 1.5
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1))

  const material = new THREE.PointsMaterial({
    size: 0.8,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
  })

  particles = new THREE.Points(geometry, material)
  scene.add(particles)

  // Connection lines
  const lineGeometry = new THREE.BufferGeometry()
  const linePositions: number[] = []
  const pos = positions
  for (let i = 0; i < count; i++) {
    for (let j = i + 1; j < count; j++) {
      const dx = pos[i * 3] - pos[j * 3]
      const dy = pos[i * 3 + 1] - pos[j * 3 + 1]
      const dz = pos[i * 3 + 2] - pos[j * 3 + 2]
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
      if (dist < 18 && Math.random() > 0.97) {
        linePositions.push(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2])
        linePositions.push(pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2])
      }
    }
  }

  lineGeometry.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3))
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x6366f1,
    transparent: true,
    opacity: 0.15
  })
  const lines = new THREE.LineSegments(lineGeometry, lineMaterial)
  scene.add(lines)

  // Mouse interaction
  document.addEventListener("mousemove", onMouseMove)
  animate()
}

function animate() {
  if (!particles) return
  particles.rotation.y += 0.0003
  particles.rotation.x += Math.sin(Date.now() * 0.0001) * 0.0001
  particles.rotation.z += Math.cos(Date.now() * 0.0001) * 0.0001

  // Subtle mouse parallax
  particles.rotation.y += (mouseX * 0.00002 - particles.rotation.y) * 0.01

  renderer.render(scene, camera)
  animationId = requestAnimationFrame(animate)
}

function onMouseMove(e: MouseEvent) {
  mouseX = e.clientX - window.innerWidth / 2
  mouseY = e.clientY - window.innerHeight / 2
}

function onResize() {
  if (!container.value) return
  const width = container.value.clientWidth
  const height = container.value.clientHeight
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

onMounted(() => {
  init()
  window.addEventListener("resize", onResize)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationId)
  document.removeEventListener("mousemove", onMouseMove)
  window.removeEventListener("resize", onResize)
  renderer?.dispose()
})
</script>

<style scoped>
.particles-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  pointer-events: none;
}
</style>
