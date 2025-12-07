/**
 * 用户认证和权限控制 Hook
 * 
 * 功能：
 * - 用户登录状态管理
 * - 操作权限检查（增删改查等）
 * - 模块权限检查
 * - 数据权限检查
 * - 审批权限检查
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
    userData,
    roleData,
    departmentData,
    getRoleById,
    getDepartmentById,
    type IUser,
    type IRole,
    type IDepartment,
    type IModuleAccess,
} from '../mock/auth';

// ==================== 类型定义 ====================

export interface AuthUser extends IUser {
    role?: IRole;
    department?: IDepartment;
}

export interface AuthContextValue {
    // 用户信息
    user: AuthUser | null;
    isLoggedIn: boolean;

    // 角色检查
    isAdmin: boolean;
    isManager: boolean;

    // 操作权限
    canCreate: boolean;
    canRead: boolean;
    canUpdate: boolean;
    canDelete: boolean;      // 仅管理员
    canExport: boolean;
    canImport: boolean;
    canApprove: boolean;
    canPrint: boolean;

    // 权限检查方法
    hasPermission: (permission: string) => boolean;
    hasModuleAccess: (moduleKey: string, minAccess?: IModuleAccess['access']) => boolean;
    canApproveBusinessType: (businessType: string) => boolean;
    getDataScope: () => 'all' | 'department' | 'self';

    // 用户操作
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
    switchUser: (userId: string) => void;

    // 开发用 - 快速切换角色
    switchToAdmin: () => void;
    switchToUser: () => void;
    availableUsers: IUser[];
}

// ==================== 常量 ====================

const STORAGE_KEY = 'lims_current_user_id';

// ==================== Hook 实现 ====================

export const useAuth = (): AuthContextValue => {
    const [userId, setUserId] = useState<string | null>(() => {
        // 从 localStorage 读取用户ID，默认使用管理员
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored || 'user-001'; // 默认管理员
    });

    // 获取当前用户完整信息
    const user = useMemo<AuthUser | null>(() => {
        if (!userId) return null;
        const baseUser = userData.find(u => u.id === userId);
        if (!baseUser) return null;

        const role = getRoleById(baseUser.roleId);
        const department = getDepartmentById(baseUser.departmentId);

        return {
            ...baseUser,
            role,
            department,
        };
    }, [userId]);

    // 保存用户ID到localStorage
    useEffect(() => {
        if (userId) {
            localStorage.setItem(STORAGE_KEY, userId);
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
    }, [userId]);

    // ==================== 角色检查 ====================

    const isLoggedIn = !!user;
    const isAdmin = user?.role?.code === 'admin';
    const isManager = isAdmin || ['lab_director', 'sales_manager', 'quality_manager', 'technical_director'].includes(user?.role?.code || '');

    // ==================== 操作权限 ====================

    const permissions = user?.role?.permissions || [];

    const canCreate = permissions.includes('create');
    const canRead = permissions.includes('read');
    const canUpdate = permissions.includes('update');
    const canDelete = isAdmin; // 仅管理员可删除
    const canExport = permissions.includes('export');
    const canImport = permissions.includes('import');
    const canApprove = permissions.includes('approve');
    const canPrint = permissions.includes('print');

    // ==================== 权限检查方法 ====================

    /**
     * 检查是否有特定操作权限
     */
    const hasPermission = useCallback((permission: string): boolean => {
        // 删除权限特殊处理
        if (permission === 'delete') return isAdmin;
        return permissions.includes(permission);
    }, [permissions, isAdmin]);

    /**
     * 检查模块访问权限
     * @param moduleKey 模块标识
     * @param minAccess 最低访问级别，默认 'read'
     */
    const hasModuleAccess = useCallback((moduleKey: string, minAccess: IModuleAccess['access'] = 'read'): boolean => {
        if (isAdmin) return true;

        const moduleAccess = user?.role?.moduleAccess || [];
        const access = moduleAccess.find(m => m.moduleKey === moduleKey);

        if (!access || access.access === 'none') return false;

        const accessLevels: IModuleAccess['access'][] = ['none', 'read', 'operate', 'approve', 'full'];
        const currentLevel = accessLevels.indexOf(access.access);
        const requiredLevel = accessLevels.indexOf(minAccess);

        return currentLevel >= requiredLevel;
    }, [user, isAdmin]);

    /**
     * 检查是否可以审批特定业务类型
     */
    const canApproveBusinessType = useCallback((businessType: string): boolean => {
        if (isAdmin) return true;

        const approvalPerms = user?.role?.approvalPermissions || [];
        const perm = approvalPerms.find(p => p.businessType === businessType);

        return perm?.canApprove || false;
    }, [user, isAdmin]);

    /**
     * 获取数据权限范围
     */
    const getDataScope = useCallback((): 'all' | 'department' | 'self' => {
        if (isAdmin) return 'all';
        return user?.role?.dataScope || 'self';
    }, [user, isAdmin]);

    // ==================== 用户操作 ====================

    /**
     * 登录
     */
    const login = useCallback(async (username: string, _password: string): Promise<boolean> => {
        // 模拟登录验证
        const foundUser = userData.find(u => u.username === username && u.status === 'active');
        if (foundUser) {
            setUserId(foundUser.id);
            return true;
        }
        return false;
    }, []);

    /**
     * 登出
     */
    const logout = useCallback(() => {
        setUserId(null);
    }, []);

    /**
     * 切换用户（开发用）
     */
    const switchUser = useCallback((newUserId: string) => {
        setUserId(newUserId);
    }, []);

    /**
     * 快速切换到管理员
     */
    const switchToAdmin = useCallback(() => {
        setUserId('user-001');
    }, []);

    /**
     * 快速切换到普通用户
     */
    const switchToUser = useCallback(() => {
        setUserId('user-007');
    }, []);

    // ==================== 返回值 ====================

    return {
        // 用户信息
        user,
        isLoggedIn,

        // 角色检查
        isAdmin,
        isManager,

        // 操作权限
        canCreate,
        canRead,
        canUpdate,
        canDelete,
        canExport,
        canImport,
        canApprove,
        canPrint,

        // 权限检查方法
        hasPermission,
        hasModuleAccess,
        canApproveBusinessType,
        getDataScope,

        // 用户操作
        login,
        logout,
        switchUser,

        // 开发用
        switchToAdmin,
        switchToUser,
        availableUsers: userData,
    };
};

export default useAuth;
