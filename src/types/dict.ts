export const STATUS_MAP: Record<string, { label: string; color: string }> = {
    active: { label: '启用', color: '#22c55e' },
    inactive: { label: '停用', color: '#ef4444' },
    pending: { label: '待审核', color: '#f59e0b' },
    approved: { label: '已通过', color: '#22c55e' },
    rejected: { label: '已驳回', color: '#ef4444' },
    draft: { label: '草稿', color: '#6b7280' },
    submitted: { label: '已提交', color: '#3b82f6' },
    in_progress: { label: '进行中', color: '#3b82f6' },
    completed: { label: '已完成', color: '#22c55e' },
    closed: { label: '已关闭', color: '#6b7280' },
}

export const SUPPLIER_STATUS = {
    draft: { label: '草稿', color: '#6b7280', icon: 'edit' },
    pending: { label: '待准入', color: '#f59e0b', icon: 'clock' },
    approved: { label: '已准入', color: '#22c55e', icon: 'check-circle' },
    blacklisted: { label: '黑名单', color: '#ef4444', icon: 'ban' },
    eliminated: { label: '已淘汰', color: '#6b7280', icon: 'x-circle' },
    whitelisted: { label: '白名单', color: '#3b82f6', icon: 'star' },
}

export const QUALITY_LEVELS = {
    critical: { label: '致命', color: '#7c3aed', severity: 5 },
    severe: { label: '严重', color: '#ef4444', severity: 4 },
    major: { label: '主要', color: '#f59e0b', severity: 3 },
    minor: { label: '轻微', color: '#3b82f6', severity: 2 },
    suggestion: { label: '建议', color: '#22c55e', severity: 1 },
}

export const ISSUE_STATUS: Record<string, { label: string; color: string }> = {
    open: { label: '待处理', color: '#f59e0b' },
    in_progress: { label: '处理中', color: '#3b82f6' },
    rectification: { label: '整改中', color: '#8b5cf6' },
    closed: { label: '已闭环', color: '#22c55e' },
    rejected: { label: '已驳回', color: '#ef4444' },
}

export const ORDER_STATUS = {
    draft: { label: '草稿', color: '#6b7280' },
    confirmed: { label: '已确认', color: '#3b82f6' },
    delivering: { label: '交付中', color: '#f59e0b' },
    received: { label: '已收货', color: '#22c55e' },
    invoiced: { label: '已开票', color: '#8b5cf6' },
    closed: { label: '已关闭', color: '#6b7280' },
}

export const LOG_LEVELS = {
    info: { label: 'Info', color: '#3b82f6' },
    warning: { label: 'Warning', color: '#f59e0b' },
    error: { label: 'Error', color: '#ef4444' },
}

export const ORG_TYPES = [
    { value: 'group', label: '集团' },
    { value: 'company', label: '公司' },
    { value: 'dept', label: '部门' },
]
