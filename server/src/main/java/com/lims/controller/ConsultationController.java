package com.lims.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.lims.common.PageResult;
import com.lims.common.Result;
import com.lims.entity.Consultation;
import com.lims.mapper.ConsultationMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * 委托咨询Controller
 */
@Tag(name = "委托咨询", description = "咨询单CRUD接口")
@RestController
@RequestMapping("/consultation")
@RequiredArgsConstructor
public class ConsultationController {

    private final ConsultationMapper consultationMapper;

    @Operation(summary = "分页查询咨询单")
    @GetMapping("/page")
    @PreAuthorize("@ss.hasPermission('consultation:query')")
    public Result<PageResult<Consultation>> page(
            @RequestParam(defaultValue = "1") Integer current,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String consultationNo,
            @RequestParam(required = false) String clientCompany,
            @RequestParam(required = false) String status) {

        Page<Consultation> page = new Page<>(current, size);
        LambdaQueryWrapper<Consultation> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(StringUtils.hasText(consultationNo), Consultation::getConsultationNo, consultationNo)
               .like(StringUtils.hasText(clientCompany), Consultation::getClientCompany, clientCompany)
               .eq(StringUtils.hasText(status), Consultation::getStatus, status)
               .orderByDesc(Consultation::getCreateTime);

        Page<Consultation> result = consultationMapper.selectPage(page, wrapper);

        return Result.success(new PageResult<>(
                result.getRecords(),
                result.getTotal(),
                result.getSize(),
                result.getCurrent()
        ));
    }

    @Operation(summary = "获取咨询单详情")
    @GetMapping("/{id}")
    @PreAuthorize("@ss.hasPermission('consultation:query')")
    public Result<Consultation> getById(@PathVariable Long id) {
        return Result.success(consultationMapper.selectById(id));
    }

    @Operation(summary = "新增咨询单")
    @PostMapping
    @PreAuthorize("@ss.hasPermission('consultation:create')")
    public Result<Consultation> create(@RequestBody Consultation consultation) {
        consultation.setConsultationNo(generateConsultationNo());
        consultation.setStatus("following");
        consultationMapper.insert(consultation);
        return Result.success("创建成功", consultation);
    }

    @Operation(summary = "更新咨询单")
    @PutMapping
    @PreAuthorize("@ss.hasPermission('consultation:update')")
    public Result<Void> update(@RequestBody Consultation consultation) {
        consultationMapper.updateById(consultation);
        return Result.successMsg("更新成功");
    }

    @Operation(summary = "删除咨询单")
    @DeleteMapping("/{id}")
    @PreAuthorize("@ss.hasPermission('consultation:delete')")
    public Result<Void> delete(@PathVariable Long id) {
        consultationMapper.deleteById(id);
        return Result.successMsg("删除成功");
    }

    @Operation(summary = "关闭咨询")
    @PostMapping("/{id}/close")
    @PreAuthorize("@ss.hasPermission('consultation:update')")
    public Result<Void> close(@PathVariable Long id) {
        Consultation consultation = new Consultation();
        consultation.setId(id);
        consultation.setStatus("closed");
        consultationMapper.updateById(consultation);
        return Result.successMsg("咨询已关闭");
    }

    @Operation(summary = "添加跟进记录")
    @PostMapping("/{id}/follow-up")
    @PreAuthorize("@ss.hasPermission('consultation:update')")
    public Result<Void> addFollowUp(
            @PathVariable Long id,
            @RequestBody FollowUpRecord followUp) {
        Consultation consultation = consultationMapper.selectById(id);
        if (consultation != null) {
            String existingRecords = consultation.getFollowUpRecords();
            String newRecord = String.format(
                "{\"id\":\"%s\",\"date\":\"%s\",\"type\":\"%s\",\"content\":\"%s\",\"nextAction\":\"%s\",\"operator\":\"%s\"}",
                followUp.getId(),
                followUp.getDate(),
                followUp.getType(),
                followUp.getContent(),
                followUp.getNextAction() != null ? followUp.getNextAction() : "",
                followUp.getOperator()
            );

            String updatedRecords;
            if (StringUtils.hasText(existingRecords)) {
                updatedRecords = existingRecords.substring(0, existingRecords.length() - 1) + "," + newRecord + "]";
            } else {
                updatedRecords = "[" + newRecord + "]";
            }

            consultation.setFollowUpRecords(updatedRecords);
            consultationMapper.updateById(consultation);
        }
        return Result.successMsg("跟进记录已添加");
    }

    @Operation(summary = "更新可行性评估")
    @PostMapping("/{id}/feasibility")
    @PreAuthorize("@ss.hasPermission('consultation:update')")
    public Result<Void> updateFeasibility(
            @PathVariable Long id,
            @RequestParam String feasibility,
            @RequestParam(required = false) String feasibilityNote,
            @RequestParam(required = false) Long estimatedPrice) {
        Consultation consultation = new Consultation();
        consultation.setId(id);
        consultation.setFeasibility(feasibility);
        consultation.setFeasibilityNote(feasibilityNote);
        consultation.setEstimatedPrice(estimatedPrice);
        consultationMapper.updateById(consultation);
        return Result.successMsg("可行性评估已更新");
    }

    @Operation(summary = "关联报价单")
    @PostMapping("/{id}/link-quotation")
    @PreAuthorize("@ss.hasPermission('consultation:update')")
    public Result<Void> linkQuotation(
            @PathVariable Long id,
            @RequestParam Long quotationId,
            @RequestParam String quotationNo) {
        Consultation consultation = new Consultation();
        consultation.setId(id);
        consultation.setQuotationId(quotationId);
        consultation.setQuotationNo(quotationNo);
        consultation.setStatus("quoted");
        consultationMapper.updateById(consultation);
        return Result.successMsg("报价单已关联");
    }

    @Operation(summary = "获取所有咨询单列表")
    @GetMapping("/list")
    public Result<List<Consultation>> list() {
        List<Consultation> list = consultationMapper.selectList(new LambdaQueryWrapper<Consultation>()
                .orderByDesc(Consultation::getCreateTime));
        return Result.success(list);
    }

    /**
     * 生成咨询单号
     */
    private String generateConsultationNo() {
        String prefix = "ZX" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        Long count = consultationMapper.selectCount(new LambdaQueryWrapper<Consultation>()
                .likeRight(Consultation::getConsultationNo, prefix));
        return prefix + String.format("%04d", count + 1);
    }

    /**
     * 跟进记录内部类
     */
    public static class FollowUpRecord {
        private String id;
        private String date;
        private String type;
        private String content;
        private String nextAction;
        private String operator;

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
        public String getNextAction() { return nextAction; }
        public void setNextAction(String nextAction) { this.nextAction = nextAction; }
        public String getOperator() { return operator; }
        public void setOperator(String operator) { this.operator = operator; }
    }
}
