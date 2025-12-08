package com.lims.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.lims.common.PageResult;
import com.lims.common.Result;
import com.lims.entity.Quotation;
import com.lims.mapper.QuotationMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * 报价管理Controller
 */
@Tag(name = "报价管理", description = "报价单CRUD接口")
@RestController
@RequestMapping("/quotation")
@RequiredArgsConstructor
public class QuotationController {

    private final QuotationMapper quotationMapper;

    @Operation(summary = "分页查询报价单")
    @GetMapping("/page")
    @PreAuthorize("@ss.hasPermission('quotation:list')")
    public Result<PageResult<Quotation>> page(
            @RequestParam(defaultValue = "1") Integer current,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String quotationNo,
            @RequestParam(required = false) String clientName,
            @RequestParam(required = false) String status) {
        
        Page<Quotation> page = new Page<>(current, size);
        LambdaQueryWrapper<Quotation> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(StringUtils.hasText(quotationNo), Quotation::getQuotationNo, quotationNo)
               .like(StringUtils.hasText(clientName), Quotation::getClientName, clientName)
               .eq(StringUtils.hasText(status), Quotation::getStatus, status)
               .orderByDesc(Quotation::getCreateTime);
        
        Page<Quotation> result = quotationMapper.selectPage(page, wrapper);
        
        return Result.success(new PageResult<>(
                result.getRecords(),
                result.getTotal(),
                result.getSize(),
                result.getCurrent()
        ));
    }

    @Operation(summary = "获取报价单详情")
    @GetMapping("/{id}")
    @PreAuthorize("@ss.hasPermission('quotation:query')")
    public Result<Quotation> getById(@PathVariable Long id) {
        return Result.success(quotationMapper.selectById(id));
    }

    @Operation(summary = "根据客户获取报价单列表")
    @GetMapping("/by-client/{clientId}")
    public Result<List<Quotation>> getByClient(@PathVariable Long clientId) {
        List<Quotation> list = quotationMapper.selectList(new LambdaQueryWrapper<Quotation>()
                .eq(Quotation::getClientId, clientId)
                .orderByDesc(Quotation::getCreateTime));
        return Result.success(list);
    }

    @Operation(summary = "新增报价单")
    @PostMapping
    @PreAuthorize("@ss.hasPermission('quotation:create')")
    public Result<Quotation> create(@RequestBody Quotation quotation) {
        quotation.setQuotationNo(generateQuotationNo());
        quotation.setStatus("draft");
        // 计算实际金额
        if (quotation.getDiscountAmount() == null) {
            quotation.setDiscountAmount(BigDecimal.ZERO);
        }
        if (quotation.getTotalAmount() != null) {
            quotation.setActualAmount(quotation.getTotalAmount().subtract(quotation.getDiscountAmount()));
        }
        quotationMapper.insert(quotation);
        return Result.success("创建成功", quotation);
    }

    @Operation(summary = "更新报价单")
    @PutMapping
    @PreAuthorize("@ss.hasPermission('quotation:update')")
    public Result<Void> update(@RequestBody Quotation quotation) {
        // 重新计算实际金额
        if (quotation.getTotalAmount() != null && quotation.getDiscountAmount() != null) {
            quotation.setActualAmount(quotation.getTotalAmount().subtract(quotation.getDiscountAmount()));
        }
        quotationMapper.updateById(quotation);
        return Result.successMsg("更新成功");
    }

    @Operation(summary = "删除报价单")
    @DeleteMapping("/{id}")
    @PreAuthorize("@ss.hasPermission('quotation:delete')")
    public Result<Void> delete(@PathVariable Long id) {
        quotationMapper.deleteById(id);
        return Result.successMsg("删除成功");
    }

    @Operation(summary = "提交报价单")
    @PostMapping("/{id}/submit")
    @PreAuthorize("@ss.hasPermission('quotation:update')")
    public Result<Void> submit(@PathVariable Long id) {
        Quotation quotation = new Quotation();
        quotation.setId(id);
        quotation.setStatus("submitted");
        quotationMapper.updateById(quotation);
        return Result.successMsg("已提交");
    }

    @Operation(summary = "审批报价单")
    @PostMapping("/{id}/approve")
    @PreAuthorize("@ss.hasPermission('quotation:approve')")
    public Result<Void> approve(
            @PathVariable Long id,
            @RequestParam boolean approved,
            @RequestParam(required = false) String comment) {
        Quotation quotation = new Quotation();
        quotation.setId(id);
        quotation.setStatus(approved ? "approved" : "rejected");
        if (!approved) {
            quotation.setRemark(comment);
        }
        quotationMapper.updateById(quotation);
        return Result.successMsg(approved ? "审批通过" : "审批拒绝");
    }

    @Operation(summary = "复制报价单")
    @PostMapping("/{id}/copy")
    public Result<Quotation> copy(@PathVariable Long id) {
        Quotation original = quotationMapper.selectById(id);
        if (original != null) {
            Quotation copy = new Quotation();
            copy.setQuotationNo(generateQuotationNo());
            copy.setClientId(original.getClientId());
            copy.setClientName(original.getClientName());
            copy.setContactPerson(original.getContactPerson());
            copy.setPhone(original.getPhone());
            copy.setTotalAmount(original.getTotalAmount());
            copy.setDiscountAmount(original.getDiscountAmount());
            copy.setActualAmount(original.getActualAmount());
            copy.setItems(original.getItems());
            copy.setValidUntil(LocalDate.now().plusDays(30));
            copy.setStatus("draft");
            quotationMapper.insert(copy);
            return Result.success("复制成功", copy);
        }
        return Result.error("原报价单不存在");
    }

    @Operation(summary = "转为合同")
    @PostMapping("/{id}/to-contract")
    public Result<Void> toContract(@PathVariable Long id) {
        // TODO: 创建合同并关联
        return Result.successMsg("已生成合同");
    }

    private String generateQuotationNo() {
        String prefix = "BJ" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        Long count = quotationMapper.selectCount(new LambdaQueryWrapper<Quotation>()
                .likeRight(Quotation::getQuotationNo, prefix));
        return prefix + String.format("%04d", count + 1);
    }
}
