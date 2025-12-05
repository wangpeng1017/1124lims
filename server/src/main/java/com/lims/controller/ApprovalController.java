package com.lims.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.lims.common.PageResult;
import com.lims.common.Result;
import com.lims.entity.ApprovalFlow;
import com.lims.entity.ApprovalLog;
import com.lims.entity.ApprovalNode;
import com.lims.entity.ApprovalRecord;
import com.lims.mapper.ApprovalLogMapper;
import com.lims.service.ApprovalService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 审批流程Controller
 */
@Tag(name = "审批流程", description = "审批流程配置和审批操作")
@RestController
@RequestMapping("/approval")
@RequiredArgsConstructor
public class ApprovalController {

    private final ApprovalService approvalService;
    private final ApprovalLogMapper logMapper;

    // ========== 流程配置 ==========

    @Operation(summary = "获取流程列表")
    @GetMapping("/flow/list")
    public Result<List<ApprovalFlow>> flowList() {
        return Result.success(approvalService.list());
    }

    @Operation(summary = "获取流程详情")
    @GetMapping("/flow/{id}")
    public Result<FlowDetailVO> getFlow(@PathVariable Long id) {
        ApprovalFlow flow = approvalService.getById(id);
        List<ApprovalNode> nodes = approvalService.getFlowNodes(id);
        
        FlowDetailVO vo = new FlowDetailVO();
        vo.setFlow(flow);
        vo.setNodes(nodes);
        return Result.success(vo);
    }

    @Operation(summary = "创建流程")
    @PostMapping("/flow")
    public Result<ApprovalFlow> createFlow(@RequestBody FlowCreateDTO dto) {
        ApprovalFlow flow = approvalService.createFlow(dto.getFlow(), dto.getNodes());
        return Result.success("创建成功", flow);
    }

    @Operation(summary = "更新流程")
    @PutMapping("/flow")
    public Result<Void> updateFlow(@RequestBody FlowCreateDTO dto) {
        approvalService.updateFlow(dto.getFlow(), dto.getNodes());
        return Result.successMsg("更新成功");
    }

    @Operation(summary = "删除流程")
    @DeleteMapping("/flow/{id}")
    public Result<Void> deleteFlow(@PathVariable Long id) {
        approvalService.removeById(id);
        return Result.successMsg("删除成功");
    }

    @Operation(summary = "切换流程状态")
    @PutMapping("/flow/{id}/status")
    public Result<Void> toggleFlowStatus(@PathVariable Long id, @RequestParam Integer status) {
        ApprovalFlow flow = new ApprovalFlow();
        flow.setId(id);
        flow.setStatus(status);
        approvalService.updateById(flow);
        return Result.successMsg("状态更新成功");
    }

    // ========== 审批操作 ==========

    @Operation(summary = "发起审批")
    @PostMapping("/start")
    public Result<ApprovalRecord> startApproval(
            @RequestParam String businessType,
            @RequestParam Long businessId,
            @RequestParam String businessNo,
            @RequestParam Long initiatorId,
            @RequestParam String initiatorName) {
        ApprovalRecord record = approvalService.startApproval(businessType, businessId, businessNo, initiatorId, initiatorName);
        return Result.success("审批已发起", record);
    }

    @Operation(summary = "执行审批")
    @PostMapping("/do")
    public Result<Void> doApproval(
            @RequestParam Long recordId,
            @RequestParam Long approverId,
            @RequestParam String approverName,
            @RequestParam String action,
            @RequestParam(required = false) String comment) {
        approvalService.doApproval(recordId, approverId, approverName, action, comment);
        return Result.successMsg("操作成功");
    }

    @Operation(summary = "取消审批")
    @PostMapping("/{recordId}/cancel")
    public Result<Void> cancelApproval(@PathVariable Long recordId) {
        approvalService.cancelApproval(recordId);
        return Result.successMsg("已取消");
    }

    @Operation(summary = "待我审批")
    @GetMapping("/pending")
    public Result<PageResult<ApprovalRecord>> myPending(
            @RequestParam(defaultValue = "1") Integer current,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam Long userId) {
        Page<ApprovalRecord> result = approvalService.getMyPendingApprovals(current, size, userId, null);
        return Result.success(new PageResult<>(result.getRecords(), result.getTotal(), result.getSize(), result.getCurrent()));
    }

    @Operation(summary = "我发起的")
    @GetMapping("/initiated")
    public Result<PageResult<ApprovalRecord>> myInitiated(
            @RequestParam(defaultValue = "1") Integer current,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam Long userId) {
        Page<ApprovalRecord> result = approvalService.getMyInitiatedApprovals(current, size, userId);
        return Result.success(new PageResult<>(result.getRecords(), result.getTotal(), result.getSize(), result.getCurrent()));
    }

    @Operation(summary = "审批记录详情")
    @GetMapping("/record/{id}")
    public Result<RecordDetailVO> getRecordDetail(@PathVariable Long id) {
        ApprovalRecord record = approvalService.getRecordDetail(id);
        List<ApprovalLog> logs = logMapper.selectList(
                new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<ApprovalLog>()
                        .eq(ApprovalLog::getRecordId, id)
                        .orderByAsc(ApprovalLog::getCreateTime));
        
        RecordDetailVO vo = new RecordDetailVO();
        vo.setRecord(record);
        vo.setLogs(logs);
        return Result.success(vo);
    }

    // ========== DTO/VO ==========

    @Data
    public static class FlowCreateDTO {
        private ApprovalFlow flow;
        private List<ApprovalNode> nodes;
    }

    @Data
    public static class FlowDetailVO {
        private ApprovalFlow flow;
        private List<ApprovalNode> nodes;
    }

    @Data
    public static class RecordDetailVO {
        private ApprovalRecord record;
        private List<ApprovalLog> logs;
    }
}
