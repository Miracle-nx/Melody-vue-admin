// Mock auth responses
export const mockAuth = {
    login: (params: { username: string; password: string }) => {
        // Simulate network delay
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (params.username === 'admin' && params.password === 'admin123') {
                    resolve({
                        token: 'mock-jwt-token-' + Math.random().toString(36).substr(2, 9),
                        user: {
                            id: 1,
                            username: 'admin',
                            nickname: '系统管理员',
                            avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
                            email: 'admin@example.com',
                            roles: ['admin'],
                            permissions: ['*'],
                            orgId: 1,
                            orgName: '总公司'
                        }
                    });
                } else {
                    reject(new Error('用户名或密码错误'));
                }
            }, 500);
        });
    },
    logout: () => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(undefined);
            }, 300);
        });
    },
    getUserInfo: () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const token = localStorage.getItem('token');
                if (token && token.startsWith('mock-jwt-token')) {
                    resolve({
                        id: 1,
                        username: 'admin',
                        nickname: '系统管理员',
                        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
                        email: 'admin@example.com',
                        roles: ['admin'],
                        permissions: ['*'],
                        orgId: 1,
                        orgName: '总公司'
                    });
                } else {
                    reject(new Error('未登录或登录已过期'));
                }
            }, 300);
        });
    },
    refreshToken: () => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    token: 'mock-jwt-token-' + Math.random().toString(36).substr(2, 9)
                });
            }, 300);
        });
    }
};