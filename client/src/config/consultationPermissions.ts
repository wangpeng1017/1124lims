/**
 * @file consultationPermissions.ts
 * @desc 委托咨询操作权限配置
 * @desc 统一管理各状态下的可执行操作，避免按钮显示与执行逻辑不一致
 * @see PRD: docs/PRD.md
 */

import type { IConsultation } from '../mock/consultation';

/**
 * 委托咨询操作权限配置
 *
 * @remarks
 * 各状态下的可执行操作定义：
 * - pending（待跟进）：可编辑、删除、关闭、添加跟进
 * - following（跟进中）：可编辑、关闭、生成报价单、添加跟进
 * - quoted（已报价）：只能查看
 * - rejected（已拒绝）：只能查看
 * - closed（已关闭）：只能查看
 */
export const CONSULTATION_PERMISSIONS = {
    /** 可编辑的状态 */
    canEdit: ['pending', 'following'],

    /** 可删除的状态（仅管理员，且只允许删除待跟进的） */
    canDelete: ['pending'],

    /** 可关闭的状态 */
    canClose: ['pending', 'following'],

    /** 可生成报价单的状态 */
    canGenerateQuotation: ['following'],

    /** 可添加跟进记录的状态 */
    canAddFollowUp: ['pending', 'following']
} as const;

/**
 * 判断是否可以编辑咨询
 */
export const canEdit = (status: IConsultation['status']): boolean => {
    return CONSULTATION_PERMISSIONS.canEdit.includes(status as any);
};

/**
 * 判断是否可以删除咨询
 */
export const canDelete = (status: IConsultation['status']): boolean => {
    return CONSULTATION_PERMISSIONS.canDelete.includes(status as any);
};

/**
 * 判断是否可以关闭咨询
 */
export const canClose = (status: IConsultation['status']): boolean => {
    return CONSULTATION_PERMISSIONS.canClose.includes(status as any);
};

/**
 * 判断是否可以生成报价单
 * @param status 咨询状态
 * @param hasQuotation 是否已有关联报价单
 */
export const canGenerateQuotation = (status: IConsultation['status'], hasQuotation = false): boolean => {
    return !hasQuotation && CONSULTATION_PERMISSIONS.canGenerateQuotation.includes(status as any);
};

/**
 * 判断是否可以添加跟进记录
 */
export const canAddFollowUp = (status: IConsultation['status']): boolean => {
    return CONSULTATION_PERMISSIONS.canAddFollowUp.includes(status as any);
};
