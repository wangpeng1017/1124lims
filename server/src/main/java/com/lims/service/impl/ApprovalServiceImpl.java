package com.lims.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.lims.entity.ApprovalFlow;
import com.lims.entity.ApprovalLog;
import com.lims.entity.ApprovalNode;
import com.lims.entity.ApprovalRecord;
import com.lims.exception.BusinessException;
import com.lims.mapper.ApprovalFlowMapper;
import com.lims.mapper.ApprovalLogMapper;
import com.lims.mapper.ApprovalNodeMapper;
import com.lims.mapper.ApprovalRecordMapper;
import com.lims.service.ApprovalService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 审批流程Service实现
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ApprovalServiceImpl extends ServiceImpl<ApprovalFlowMapper, ApprovalFlow> implements ApprovalService {

    private final ApprovalNodeMapper nodeMapper;
    private final ApprovalRecordMapper recordMapper;
    private final ApprovalLogMapper logMapper;

    @Override
    @Transactional
    public ApprovalFlow createFlow(ApprovalFlow flow, List<ApprovalNode> nodes) {
        flow.setStatus(1);
        save(flow);
        
        // 保存节点
        for (int i = 0; i < nodes.size(); i++) {
            ApprovalNode node = nodes.get(i);
            node.setFlowId(flow.getId());
            node.setNodeOrder(i + 1);
            nodeMapper.insert(node);
        }
        
        return flow;
    }

    @Override
    @Transactional
    public void updateFlow(ApprovalFlow flow, List<ApprovalNode> nodes) {
        updateById(flow);
        
        // 删除旧节点
        nodeMapper.delete(new LambdaQueryWrapper<ApprovalNode>()
                .eq(ApprovalNode::getFlowId, flow.getId()));
        
        // 保存新节点
        for (int i = 0; i < nodes.size(); i++) {
            ApprovalNode node = nodes.get(i);
            node.setFlowId(flow.getId());
            node.setNodeOrder(i + 1);
            nodeMapper.insert(node);
        }
    }

    @Override
    public List<ApprovalNode> getFlowNodes(Long flowId) {
        return nodeMapper.selectList(new LambdaQueryWrapper<ApprovalNode>()
                .eq(ApprovalNode::getFlowId, flowId)
                .orderByAsc(ApprovalNode::getNodeOrder));
    }

    @Override
    public ApprovalFlow getFlowByBusinessType(String businessType) {
        return getOne(new LambdaQueryWrapper<ApprovalFlow>()
                .eq(ApprovalFlow::getBusinessType, businessType)
                .eq(ApprovalFlow::getStatus, 1));
    }

    @Override
    @Transactional
    public ApprovalRecord startApproval(String businessType, Long businessId, String businessNo, 
                                        Long initiatorId, String initiatorName) {
        // 获取流程定义
        ApprovalFlow flow = getFlowByBusinessType(businessType);
        if (flow == null) {
            throw new BusinessException("未找到对应的审批流程配置");
        }
        
        // 获取第一个节点
        List<ApprovalNode> nodes = getFlowNodes(flow.getId());
        if (nodes.isEmpty()) {
            throw new BusinessException("审批流程未配置节点");
        }
        
        ApprovalNode firstNode = nodes.get(0);
        
        // 创建审批记录
        ApprovalRecord record = new ApprovalRecord();
        record.setFlowId(flow.getId());
        record.setBusinessType(businessType);
        record.setBusinessId(businessId);
        record.setBusinessNo(businessNo);
        record.setCurrentNodeId(firstNode.getId());
        record.setCurrentNodeOrder(1);
        record.setStatus("pending");
        record.setInitiatorId(initiatorId);
        record.setInitiatorName(initiatorName);
        recordMapper.insert(record);
        
        // 记录发起日志
        ApprovalLog initLog = new ApprovalLog();
        initLog.setRecordId(record.getId());
        initLog.setApproverId(initiatorId);
        initLog.setApproverName(initiatorName);
        initLog.setAction("submit");
        initLog.setComment("发起审批");
        logMapper.insert(initLog);
        
        return record;
    }

    @Override
    @Transactional
    public void doApproval(Long recordId, Long approverId, String approverName, String action, String comment) {
        ApprovalRecord record = recordMapper.selectById(recordId);
        if (record == null) {
            throw new BusinessException("审批记录不存在");
        }
        
        if (!"pending".equals(record.getStatus())) {
            throw new BusinessException("该审批已处理");
        }
        
        // 获取当前节点
        ApprovalNode currentNode = nodeMapper.selectById(record.getCurrentNodeId());
        
        // 记录操作日志
        ApprovalLog logEntry = new ApprovalLog();
        logEntry.setRecordId(recordId);
        logEntry.setNodeId(currentNode.getId());
        logEntry.setNodeName(currentNode.getNodeName());
        logEntry.setApproverId(approverId);
        logEntry.setApproverName(approverName);
        logEntry.setAction(action);
        logEntry.setComment(comment);
        logMapper.insert(logEntry);
        
        if ("reject".equals(action)) {
            // 拒绝
            record.setStatus("rejected");
            recordMapper.updateById(record);
        } else if ("approve".equals(action)) {
            // 通过，查找下一个节点
            List<ApprovalNode> nodes = getFlowNodes(record.getFlowId());
            ApprovalNode nextNode = nodes.stream()
                    .filter(n -> n.getNodeOrder() > record.getCurrentNodeOrder())
                    .findFirst()
                    .orElse(null);
            
            if (nextNode == null) {
                // 没有下一个节点，审批完成
                record.setStatus("approved");
            } else {
                // 流转到下一个节点
                record.setCurrentNodeId(nextNode.getId());
                record.setCurrentNodeOrder(nextNode.getNodeOrder());
            }
            recordMapper.updateById(record);
        }
    }

    @Override
    public Page<ApprovalRecord> getMyPendingApprovals(Integer current, Integer size, Long userId, List<String> roleCodes) {
        // 简化实现：查询所有待审批记录
        // 实际应该根据节点的审批人配置来过滤
        Page<ApprovalRecord> page = new Page<>(current, size);
        return recordMapper.selectPage(page, new LambdaQueryWrapper<ApprovalRecord>()
                .eq(ApprovalRecord::getStatus, "pending")
                .orderByDesc(ApprovalRecord::getCreateTime));
    }

    @Override
    public Page<ApprovalRecord> getMyInitiatedApprovals(Integer current, Integer size, Long userId) {
        Page<ApprovalRecord> page = new Page<>(current, size);
        return recordMapper.selectPage(page, new LambdaQueryWrapper<ApprovalRecord>()
                .eq(ApprovalRecord::getInitiatorId, userId)
                .orderByDesc(ApprovalRecord::getCreateTime));
    }

    @Override
    public ApprovalRecord getRecordDetail(Long recordId) {
        return recordMapper.selectById(recordId);
    }

    @Override
    @Transactional
    public void cancelApproval(Long recordId) {
        ApprovalRecord record = recordMapper.selectById(recordId);
        if (record != null && "pending".equals(record.getStatus())) {
            record.setStatus("cancelled");
            recordMapper.updateById(record);
        }
    }
}
