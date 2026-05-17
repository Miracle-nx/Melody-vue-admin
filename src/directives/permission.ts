import type { App } from 'vue'
import { useAuthStore } from '@/stores/auth'

export function setupPermissionDirective(app: App) {
    app.directive('permission', {
        mounted(el: HTMLElement, binding) {
            const authStore = useAuthStore()
            const { value } = binding

            if (!value) return

            const permissions = Array.isArray(value) ? value : [value]
            const hasPermission = authStore.hasAnyPermission(permissions)

            if (!hasPermission) {
                el.parentNode?.removeChild(el)
            }
        },
    })
}
