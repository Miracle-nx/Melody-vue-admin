import { mockAuth } from './auth';

type MockHandler = (config: { url: string; method: string; data?: any }) => Promise<any>;

// URL pattern -> mock handler map
const mockHandlers: Map<string, MockHandler> = new Map();

export function registerMock(pattern: string, handler: MockHandler) {
    mockHandlers.set(pattern, handler);
}

export function getMockHandler(url: string, method: string): MockHandler | undefined {
    const key = `${method}:${url}`;
    return mockHandlers.get(key);
}

// Helper to create a response in axios-compatible format
export function createMockResponse(data: any) {
    return {
        data: { code: 0, data, message: 'success' },
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
    };
}

export function createMockError(message: string, status = 400) {
    return {
        data: { code: status, data: null, message },
        status,
        statusText: message,
        headers: { 'content-type': 'application/json' },
    };
}

// Register all mock handlers
export function initMocks() {
    // Auth mocks
    registerMock('post:/auth/login', async (config) => {
        const params = JSON.parse(config.data || '{}');
        const result = await mockAuth.login(params);
        return createMockResponse(result);
    });

    registerMock('post:/auth/logout', async () => {
        await mockAuth.logout();
        return createMockResponse(null);
    });

    registerMock('get:/auth/userinfo', async () => {
        const result = await mockAuth.getUserInfo();
        return createMockResponse(result);
    });

    registerMock('post:/auth/refresh', async () => {
        const result = await mockAuth.refreshToken();
        return createMockResponse(result);
    });
}