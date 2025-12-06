/**
 * 用户认证和权限控制 Hook
 * 
 * 目前使用 localStorage 存储模拟用户信息
 * 实际生产环境应从后端获取用户信息
 */

import { useState, useEffect, useCallback } from 'react';

export interface User {
    id: string;
    username: string;
    name: string;
    role: 'admin' | 'manager' | 'user';
    department?: string;
    permissions: string[];
}

// 默认管理员用户（模拟）
const DEFAULT_ADMIN: User = {
    id: 'user-001',
    username: 'admin',
    name: '系统管理员',
    role: 'admin',
    department: '信息技术部',
    permissions: ['create', 'read', 'update', 'delete', 'manage_users', 'manage_system'],
};

// 默认普通用户（模拟）
const DEFAULT_USER: User = {
    id: 'user-002',
    username: 'user',
    name: '普通用户',
    role: 'user',
    department: '检测部',
    permissions: ['create', 'read', 'update'],
};

const STORAGE_KEY = 'lims_current_user';

/**
 * 获取当前用户
 */
const getCurrentUserFromStorage = (): User => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.error('Failed to parse stored user:', e);
    }
    // 默认使用管理员用户（开发模式）
    return DEFAULT_ADMIN;
};

/**
 * 用户认证 Hook
 */
export const useAuth = () => {
    const [user, setUser] = useState<User>(getCurrentUserFromStorage);

    // 检查是否是管理员
    const isAdmin = user.role === 'admin';

    // 检查是否是管理员或经理
    const isManager = user.role === 'admin' || user.role === 'manager';

    // 检查是否有特定权限
    const hasPermission = useCallback((permission: string): boolean => {
        return user.permissions.includes(permission);
    }, [user.permissions]);

    // 检查是否可以删除（只有管理员才能删除）
    const canDelete = isAdmin;

    // 切换用户（用于测试）
    const switchToAdmin = useCallback(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ADMIN));
        setUser(DEFAULT_ADMIN);
    }, []);

    const switchToUser = useCallback(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_USER));
        setUser(DEFAULT_USER);
    }, []);

    // 登出
    const logout = useCallback(() => {
        localStorage.removeItem(STORAGE_KEY);
        setUser(DEFAULT_USER);
    }, []);

    return {
        user,
        isAdmin,
        isManager,
        hasPermission,
        canDelete,
        switchToAdmin,
        switchToUser,
        logout,
    };
};

export default useAuth;
