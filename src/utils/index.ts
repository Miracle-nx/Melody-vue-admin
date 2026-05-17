export function formatDate(date: string | Date, fmt = 'YYYY-MM-DD HH:mm:ss'): string {
    const d = new Date(date)
    const pad = (n: number) => String(n).padStart(2, '0')

    const map: Record<string, () => string> = {
        'YYYY': () => String(d.getFullYear()),
        'MM': () => pad(d.getMonth() + 1),
        'DD': () => pad(d.getDate()),
        'HH': () => pad(d.getHours()),
        'mm': () => pad(d.getMinutes()),
        'ss': () => pad(d.getSeconds()),
    }

    let result = fmt
    for (const [key, fn] of Object.entries(map)) {
        result = result.replace(key, fn())
    }
    return result
}

export function formatRelativeTime(date: string | Date): string {
    const now = Date.now()
    const d = new Date(date).getTime()
    const diff = now - d

    const units = [
        { name: '年', ms: 365 * 24 * 60 * 60 * 1000 },
        { name: '月', ms: 30 * 24 * 60 * 60 * 1000 },
        { name: '天', ms: 24 * 60 * 60 * 1000 },
        { name: '小时', ms: 60 * 60 * 1000 },
        { name: '分钟', ms: 60 * 1000 },
        { name: '秒', ms: 1000 },
    ]

    for (const unit of units) {
        const count = Math.floor(diff / unit.ms)
        if (count >= 1) {
            return `${count}${unit.name}前`
        }
    }
    return '刚刚'
}

export function formatNumber(num: number, decimals = 2): string {
    return num.toLocaleString('zh-CN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    })
}

export function formatMoney(amount: number, currency = '¥'): string {
    return `${currency}${formatNumber(amount, 2)}`
}

export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B'
    const units = ['B', 'KB', 'MB', 'GB', 'TB']
    const k = 1024
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${units[i]}`
}

export function maskPhone(phone: string): string {
    if (!phone || phone.length < 7) return phone
    return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

export function maskEmail(email: string): string {
    if (!email || !email.includes('@')) return email
    const [name, domain] = email.split('@')
    return `${name.slice(0, 2)}***@${domain}`
}

export function getDictLabel(value: string, dict: Record<string, { label: string; color: string }>): string {
    return dict[value]?.label || value
}

export function getDictColor(value: string, dict: Record<string, { label: string; color: string }>): string {
    return dict[value]?.color || '#6b7280'
}

export function downloadFile(url: string, filename?: string) {
    const a = document.createElement('a')
    a.href = url
    a.download = filename || url.split('/').pop() || 'download'
    a.click()
}

export function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob)
    downloadFile(url, filename)
    URL.revokeObjectURL(url)
}

export function copyToClipboard(text: string): Promise<void> {
    if (navigator.clipboard) {
        return navigator.clipboard.writeText(text)
    }
    return new Promise((resolve, reject) => {
        try {
            const textarea = document.createElement('textarea')
            textarea.value = text
            document.body.appendChild(textarea)
            textarea.select()
            document.execCommand('copy')
            document.body.removeChild(textarea)
            resolve()
        } catch (e) {
            reject(e)
        }
    })
}

export function treeToArray<T extends { children?: T[] }>(tree: T[]): T[] {
    const result: T[] = []
    function traverse(nodes: T[]) {
        for (const node of nodes) {
            result.push(node)
            if (node.children) {
                traverse(node.children)
            }
        }
    }
    traverse(tree)
    return result
}

export function arrayToTree<T extends { id: number; parentId?: number | null }>(items: T[]): (T & { children?: T[] })[] {
    const map = new Map<number, T & { children?: T[] }>()
    const roots: (T & { children?: T[] })[] = []

    items.forEach(item => {
        map.set(item.id, { ...item, children: [] })
    })

    items.forEach(item => {
        const node = map.get(item.id)!
        if (item.parentId && map.has(item.parentId)) {
            map.get(item.parentId)!.children!.push(node)
        } else {
            roots.push(node)
        }
    })

    return roots
}
