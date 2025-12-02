// 简化版审批流程 - 硬编码三级审批

export interface ApprovalRecord {
    level: number;               // 审批级别 1/2/3
    role: 'sales_manager' | 'finance' | 'lab_director';  // 审批角色
    approver: string;            // 审批人姓名
    action: 'approve' | 'reject';
    comment: string;
    timestamp: string;
}

export interface ApprovalInstance {
    id: string;
    businessType: 'quotation';   // 业务类型(当前仅支持报价单)
    businessId: string;          // 业务单据ID
    businessNo: string;          // 业务单据号
    currentLevel: number;        // 当前审批级别 (0:未提交 1:销售 2:财务 3:实验室)
    status: 'pending' | 'approved' | 'rejected' | 'cancelled';
    approvalRecords: ApprovalRecord[];
    submittedBy: string;
    submittedAt: string;
    completedAt?: string;
}

// 审批级别配置(硬编码)
export const APPROVAL_WORKFLOW_CONFIG = {
    quotation: {
        levels: [
            { level: 1, role: 'sales_manager' as const, name: '销售经理' },
            { level: 2, role: 'finance' as const, name: '财务' },
            { level: 3, role: 'lab_director' as const, name: '实验室负责人' }
        ]
    }
};

// Mock审批实例数据
export const approvalInstances: ApprovalInstance[] = [];

// 生成审批实例ID
let instanceIdCounter = 1;
const generateInstanceId = (): string => {
    return `APPR${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(instanceIdCounter++).padStart(4, '0')}`;
};

// 审批服务
export class ApprovalService {
    /**
     * 提交审批
     */
    static submitApproval(
        businessType: 'quotation',
        businessId: string,
        businessNo: string,
        submittedBy: string
    ): ApprovalInstance {
        const instance: ApprovalInstance = {
            id: generateInstanceId(),
            businessType,
            businessId,
            businessNo,
            currentLevel: 1,  // 从第一级开始
            status: 'pending',
            approvalRecords: [],
            submittedBy,
            submittedAt: new Date().toISOString()
        };

        approvalInstances.push(instance);
        return instance;
    }

    /**
     * 执行审批动作
     */
    static executeApproval(
        instanceId: string,
        approver: string,
        action: 'approve' | 'reject',
        comment: string
    ): { success: boolean; message: string; instance: ApprovalInstance | null } {
        const instance = approvalInstances.find(i => i.id === instanceId);

        if (!instance) {
            return { success: false, message: '审批实例不存在', instance: null };
        }

        if (instance.status !== 'pending') {
            return { success: false, message: '该审批已完成', instance: null };
        }

        const config = APPROVAL_WORKFLOW_CONFIG.quotation;
        const currentLevelConfig = config.levels.find(l => l.level === instance.currentLevel);

        if (!currentLevelConfig) {
            return { success: false, message: '审批级别配置错误', instance: null };
        }

        // 记录审批
        const record: ApprovalRecord = {
            level: instance.currentLevel,
            role: currentLevelConfig.role,
            approver,
            action,
            comment,
            timestamp: new Date().toISOString()
        };

        instance.approvalRecords.push(record);

        if (action === 'reject') {
            // 拒绝,流程结束
            instance.status = 'rejected';
            instance.completedAt = new Date().toISOString();
            return {
                success: true,
                message: '审批已拒绝',
                instance
            };
        }

        // 批准,检查是否还有下一级
        if (instance.currentLevel < config.levels.length) {
            // 进入下一级
            instance.currentLevel += 1;
            return {
                success: true,
                message: `已批准,进入第${instance.currentLevel}级审批`,
                instance
            };
        } else {
            // 所有级别都通过,审批完成
            instance.status = 'approved';
            instance.completedAt = new Date().toISOString();
            return {
                success: true,
                message: '审批已全部通过',
                instance
            };
        }
    }

    /**
     * 获取待审批列表(按用户角色)
     */
    static getPendingApprovals(userRole: 'sales_manager' | 'finance' | 'lab_director'): ApprovalInstance[] {
        const config = APPROVAL_WORKFLOW_CONFIG.quotation;
        const levelConfig = config.levels.find(l => l.role === userRole);

        if (!levelConfig) {
            return [];
        }

        return approvalInstances.filter(
            i => i.status === 'pending' && i.currentLevel === levelConfig.level
        );
    }

    /**
     * 获取审批实例详情
     */
    static getApprovalInstance(instanceId: string): ApprovalInstance | null {
        return approvalInstances.find(i => i.id === instanceId) || null;
    }

    /**
     * 获取业务单据的审批实例
     */
    static getApprovalByBusinessId(businessId: string): ApprovalInstance | null {
        return approvalInstances.find(i => i.businessId === businessId) || null;
    }

    /**
     * 撤销审批
     */
    static cancelApproval(instanceId: string, userId: string): { success: boolean; message: string } {
        const instance = approvalInstances.find(i => i.id === instanceId);

        if (!instance) {
            return { success: false, message: '审批实例不存在' };
        }

        if (instance.submittedBy !== userId) {
            return { success: false, message: '只能撤销自己提交的审批' };
        }

        if (instance.status !== 'pending') {
            return { success: false, message: '只能撤销待审批的单据' };
        }

        instance.status = 'cancelled';
        instance.completedAt = new Date().toISOString();

        return { success: true, message: '审批已撤销' };
    }

    /**
     * 获取审批进度信息
     */
    static getApprovalProgress(instanceId: string): {
        totalLevels: number;
        currentLevel: number;
        completedLevels: number;
        currentLevelName: string;
        records: ApprovalRecord[];
    } | null {
        const instance = approvalInstances.find(i => i.id === instanceId);

        if (!instance) {
            return null;
        }

        const config = APPROVAL_WORKFLOW_CONFIG.quotation;
        const currentLevelConfig = config.levels.find(l => l.level === instance.currentLevel);

        return {
            totalLevels: config.levels.length,
            currentLevel: instance.currentLevel,
            completedLevels: instance.approvalRecords.filter(r => r.action === 'approve').length,
            currentLevelName: currentLevelConfig?.name || '',
            records: instance.approvalRecords
        };
    }
}
