package com.lims.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.lims.entity.ApprovalFlow;
import com.lims.entity.ApprovalNode;
import com.lims.entity.ApprovalRecord;

import java.util.List;

/**
 * 审批流程Service接口
 */
public interface ApprovalService extends IService<ApprovalFlow> {

    /**
     * 创建流程定义
     */
    ApprovalFlow createFlow(ApprovalFlow flow, List<ApprovalNode> nodes);

    /**
     * 更新流程定义
     */
    void updateFlow(ApprovalFlow flow, List<ApprovalNode> nodes);

    /**
     * 获取流程节点
     */
    List<ApprovalNode> getFlowNodes(Long flowId);

    /**
     * 根据业务类型获取流程
     */
    ApprovalFlow getFlowByBusinessType(String businessType);

    /**
     * 发起审批
     */
    ApprovalRecord startApproval(String businessType, Long businessId, String businessNo, Long initiatorId, String initiatorName);

    /**
     * 审批操作
     */
    void doApproval(Long recordId, Long approverId, String approverName, String action, String comment);

    /**
     * 获取待我审批的记录
     */
    Page<ApprovalRecord> getMyPendingApprovals(Integer current, Integer size, Long userId, List<String> roleCodes);

    /**
     * 获取我发起的审批
     */
    Page<ApprovalRecord> getMyInitiatedApprovals(Integer current, Integer size, Long userId);

    /**
     * 获取审批记录详情（包含日志）
     */
    ApprovalRecord getRecordDetail(Long recordId);

    /**
     * 取消审批
     */
    void cancelApproval(Long recordId);
}
