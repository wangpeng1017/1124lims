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
    roles: IRole[];           // 支持多角色
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
    canDelete: boolean;      // 任何角色有删除权限
    canExport: boolean;
    canImport: boolean;
    canApprove: boolean;
    canPrint: boolean;

    // 权限检查方法
    hasPermission: (permission: string) => boolean;
    hasModuleAccess: (moduleKey: string, minAccess?: IModuleAccess['access']) => boolean;
    canDeleteModule: (moduleKey: string) => boolean;  // 新增: 按模块检查删除权限
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

    // 获取当前用户完整信息 (支持多角色)
    const user = useMemo<AuthUser | null>(() => {
        if (!userId) return null;
        const baseUser = userData.find(u => u.id === userId);
        if (!baseUser) return null;

        // 获取所有角色
        const roles = baseUser.roleIds
            .map(roleId => getRoleById(roleId))
            .filter(Boolean) as IRole[];
        const department = getDepartmentById(baseUser.departmentId);

        return {
            ...baseUser,
            roles,
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

    // ==================== 多角色权限合并 ====================

    // 合并所有角色的操作权限
    const mergedPermissions = useMemo(() => {
        const roles = user?.roles || [];
        const allPerms = new Set<string>();
        roles.forEach(role => {
            role.permissions.forEach(p => allPerms.add(p));
        });
        return Array.from(allPerms);
    }, [user]);

    // 合并所有角色的删除权限
    const mergedDeletePermissions = useMemo(() => {
        const roles = user?.roles || [];
        const allDeletePerms = new Set<string>();
        roles.forEach(role => {
            (role.deletePermissions || []).forEach(p => allDeletePerms.add(p));
        });
        return Array.from(allDeletePerms);
    }, [user]);

    // ==================== 角色检查 ====================

    const isLoggedIn = !!user;
    const isAdmin = user?.roles?.some(r => r.code === 'admin') || false;
    const isManager = isAdmin || user?.roles?.some(r =>
        ['lab_director', 'sales_manager', 'quality_manager', 'technical_director'].includes(r.code)
    ) || false;

    // ==================== 操作权限 ====================

    const canCreate = mergedPermissions.includes('create');
    const canRead = mergedPermissions.includes('read');
    const canUpdate = mergedPermissions.includes('update');
    const canDelete = mergedDeletePermissions.length > 0 || isAdmin; // 有任何删除权限或是管理员
    const canExport = mergedPermissions.includes('export');
    const canImport = mergedPermissions.includes('import');
    const canApprove = mergedPermissions.includes('approve');
    const canPrint = mergedPermissions.includes('print');

    // ==================== 权限检查方法 ====================

    /**
     * 检查是否有特定操作权限
     */
    const hasPermission = useCallback((permission: string): boolean => {
        if (isAdmin) return true;
        return mergedPermissions.includes(permission);
    }, [mergedPermissions, isAdmin]);

    /**
     * 检查模块访问权限 (多角色合并: 取最高权限)
     * @param moduleKey 模块标识
     * @param minAccess 最低访问级别，默认 'read'
     */
    const hasModuleAccess = useCallback((moduleKey: string, minAccess: IModuleAccess['access'] = 'read'): boolean => {
        if (isAdmin) return true;

        const accessLevels: IModuleAccess['access'][] = ['none', 'read', 'operate', 'approve', 'full'];
        const requiredLevel = accessLevels.indexOf(minAccess);

        // 遍历所有角色，取最高权限
        const roles = user?.roles || [];
        let maxLevel = 0;
        for (const role of roles) {
            const access = role.moduleAccess?.find(m => m.moduleKey === moduleKey);
            if (access) {
                const level = accessLevels.indexOf(access.access);
                if (level > maxLevel) maxLevel = level;
            }
        }

        return maxLevel >= requiredLevel;
    }, [user, isAdmin]);

    /**
     * 检查是否可以删除特定模块的数据 (新增)
     * @param moduleKey 模块标识
     */
    const canDeleteModule = useCallback((moduleKey: string): boolean => {
        if (isAdmin) return true;
        return mergedDeletePermissions.includes(moduleKey);
    }, [mergedDeletePermissions, isAdmin]);

    /**
     * 检查是否可以审批特定业务类型 (多角色合并)
     */
    const canApproveBusinessType = useCallback((businessType: string): boolean => {
        if (isAdmin) return true;

        const roles = user?.roles || [];
        for (const role of roles) {
            const perm = role.approvalPermissions?.find(p => p.businessType === businessType);
            if (perm?.canApprove) return true;
        }
        return false;
    }, [user, isAdmin]);

    /**
     * 获取数据权限范围 (多角色合并: 取最宽范围)
     */
    const getDataScope = useCallback((): 'all' | 'department' | 'self' => {
        if (isAdmin) return 'all';

        const scopeOrder: ('all' | 'department' | 'self')[] = ['self', 'department', 'all'];
        const roles = user?.roles || [];
        let maxScopeIndex = 0;

        for (const role of roles) {
            const scopeIndex = scopeOrder.indexOf(role.dataScope || 'self');
            if (scopeIndex > maxScopeIndex) maxScopeIndex = scopeIndex;
        }

        return scopeOrder[maxScopeIndex];
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
        canDeleteModule,
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
