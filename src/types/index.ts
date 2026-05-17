export interface UserInfo {
    id: number
    username: string
    nickname: string
    avatar: string
    email: string
    roles: string[]
    permissions: string[]
    orgId: number
    orgName: string
}

export interface LoginParams {
    username: string
    password: string
}

export interface LoginResult {
    token: string
    user: UserInfo
}

export interface MenuItem {
    path: string
    name: string
    title: string
    icon: string
    children?: MenuItem[]
    meta?: {
        keepAlive?: boolean
        hidden?: boolean
        permission?: string
        badge?: number
    }
}

export interface PaginationParams {
    page: number
    pageSize: number
}

export interface PaginatedResult<T> {
    list: T[]
    total: number
    page: number
    pageSize: number
}

export interface TableColumn {
    prop: string
    label: string
    width?: number | string
    fixed?: 'left' | 'right'
    sortable?: boolean
    align?: 'left' | 'center' | 'right'
    format?: string
    dictKey?: string
    component?: string
}

export interface BusinessStatus {
    key: string
    label: string
    color: string
    icon?: string
}

export interface Attachment {
    id: number
    fileName: string
    fileSize: number
    fileType: string
    url: string
    uploadTime: string
    uploader: string
}

export interface Supplier {
    id: number
    code: string
    name: string
    status: string
    level: string
    category: string
    region: string
    contacts: string
    phone: string
    email: string
    address: string
    businessScope: string
    creditCode: string
    registerCapital: string
    establishDate: string
    employeeCount: number
    qualification: string[]
    riskLevel: string
    cooperationCount: number
    complaintCount: number
    createTime: string
    updateTime: string
}

export interface PurchaseOrder {
    id: number
    code: string
    title: string
    supplierName: string
    supplierId: number
    totalAmount: number
    status: string
    orderType: string
    deliveryDate: string
    createTime: string
    items: PurchaseOrderItem[]
}

export interface PurchaseOrderItem {
    id: number
    materialName: string
    materialCode: string
    spec: string
    unit: string
    quantity: number
    unitPrice: number
    totalPrice: number
    deliveryDate: string
    remark: string
}

export interface QualityIssue {
    id: number
    issueNo: string
    title: string
    supplierId: number
    supplierName: string
    type: string
    level: string
    status: string
    description: string
    discoveryDate: string
    rectificationDeadline: string
    responsiblePerson: string
    attachmentCount: number
    createTime: string
    updateTime: string
}

export interface ApiLog {
    id: number
    traceId: string
    systemName: string
    interfaceNo: string
    interfaceName: string
    method: string
    url: string
    status: string
    duration: number
    requestTime: string
    responseTime: string
    errorMsg: string
    retryCount: number
}
