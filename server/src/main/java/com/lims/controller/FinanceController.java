package com.lims.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.lims.common.PageResult;
import com.lims.common.Result;
import com.lims.entity.FinanceReceivable;
import com.lims.entity.FinancePayment;
import com.lims.entity.FinanceInvoice;
import com.lims.mapper.FinanceReceivableMapper;
import com.lims.mapper.FinancePaymentMapper;
import com.lims.mapper.FinanceInvoiceMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 财务管理Controller
 */
@Tag(name = "财务管理", description = "应收/收款/发票管理接口")
@RestController
@RequestMapping("/finance")
@RequiredArgsConstructor
public class FinanceController {

    private final FinanceReceivableMapper receivableMapper;
    private final FinancePaymentMapper paymentMapper;
    private final FinanceInvoiceMapper invoiceMapper;

    // ==================== 应收管理 ====================

    @Operation(summary = "分页查询应收记录")
    @GetMapping("/receivable/page")
    @PreAuthorize("@ss.hasPermission('finance:receivable:list')")
    public Result<PageResult<FinanceReceivable>> receivablePage(
            @RequestParam(defaultValue = "1") Integer current,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String clientName,
            @RequestParam(required = false) String status) {
        
        Page<FinanceReceivable> page = new Page<>(current, size);
        LambdaQueryWrapper<FinanceReceivable> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(StringUtils.hasText(clientName), FinanceReceivable::getClientName, clientName)
               .eq(StringUtils.hasText(status), FinanceReceivable::getStatus, status)
               .orderByDesc(FinanceReceivable::getCreateTime);
        
        Page<FinanceReceivable> result = receivableMapper.selectPage(page, wrapper);
        
        return Result.success(new PageResult<>(
                result.getRecords(),
                result.getTotal(),
                result.getSize(),
                result.getCurrent()
        ));
    }

    @Operation(summary = "新增应收记录")
    @PostMapping("/receivable")
    @PreAuthorize("@ss.hasPermission('finance:receivable:create')")
    public Result<FinanceReceivable> createReceivable(@RequestBody FinanceReceivable receivable) {
        if (receivable.getPaidAmount() == null) {
            receivable.setPaidAmount(BigDecimal.ZERO);
        }
        receivable.setUnpaidAmount(receivable.getAmount().subtract(receivable.getPaidAmount()));
        receivable.setStatus(receivable.getUnpaidAmount().compareTo(BigDecimal.ZERO) == 0 ? "paid" : "pending");
        receivableMapper.insert(receivable);
        return Result.success("创建成功", receivable);
    }

    @Operation(summary = "更新应收记录")
    @PutMapping("/receivable")
    @PreAuthorize("@ss.hasPermission('finance:receivable:update')")
    public Result<Void> updateReceivable(@RequestBody FinanceReceivable receivable) {
        receivableMapper.updateById(receivable);
        return Result.successMsg("更新成功");
    }

    @Operation(summary = "删除应收记录")
    @DeleteMapping("/receivable/{id}")
    @PreAuthorize("@ss.hasPermission('finance:receivable:delete')")
    public Result<Void> deleteReceivable(@PathVariable Long id) {
        receivableMapper.deleteById(id);
        return Result.successMsg("删除成功");
    }

    @Operation(summary = "应收统计")
    @GetMapping("/receivable/statistics")
    @PreAuthorize("@ss.hasPermission('finance:receivable:list')")
    public Result<Map<String, Object>> receivableStatistics() {
        List<FinanceReceivable> all = receivableMapper.selectList(null);
        
        BigDecimal totalAmount = all.stream()
                .map(FinanceReceivable::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal paidTotal = all.stream()
                .map(FinanceReceivable::getPaidAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal unpaidTotal = all.stream()
                .map(FinanceReceivable::getUnpaidAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        long overdueCount = all.stream()
                .filter(r -> "overdue".equals(r.getStatus()) || 
                        (r.getDueDate() != null && r.getDueDate().isBefore(LocalDate.now()) && !"paid".equals(r.getStatus())))
                .count();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalAmount", totalAmount);
        stats.put("paidTotal", paidTotal);
        stats.put("unpaidTotal", unpaidTotal);
        stats.put("overdueCount", overdueCount);
        stats.put("totalCount", all.size());
        
        return Result.success(stats);
    }

    // ==================== 收款管理 ====================

    @Operation(summary = "分页查询收款记录")
    @GetMapping("/payment/page")
    @PreAuthorize("@ss.hasPermission('finance:payment:list')")
    public Result<PageResult<FinancePayment>> paymentPage(
            @RequestParam(defaultValue = "1") Integer current,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String clientName,
            @RequestParam(required = false) String paymentMethod) {
        
        Page<FinancePayment> page = new Page<>(current, size);
        LambdaQueryWrapper<FinancePayment> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(StringUtils.hasText(clientName), FinancePayment::getClientName, clientName)
               .eq(StringUtils.hasText(paymentMethod), FinancePayment::getPaymentMethod, paymentMethod)
               .orderByDesc(FinancePayment::getPaymentDate);
        
        Page<FinancePayment> result = paymentMapper.selectPage(page, wrapper);
        
        return Result.success(new PageResult<>(
                result.getRecords(),
                result.getTotal(),
                result.getSize(),
                result.getCurrent()
        ));
    }

    @Operation(summary = "新增收款记录")
    @PostMapping("/payment")
    @PreAuthorize("@ss.hasPermission('finance:payment:create')")
    public Result<FinancePayment> createPayment(@RequestBody FinancePayment payment) {
        payment.setPaymentNo(generatePaymentNo());
        paymentMapper.insert(payment);
        
        // 更新关联应收记录
        if (payment.getReceivableId() != null) {
            FinanceReceivable receivable = receivableMapper.selectById(payment.getReceivableId());
            if (receivable != null) {
                BigDecimal newPaid = receivable.getPaidAmount().add(payment.getAmount());
                receivable.setPaidAmount(newPaid);
                receivable.setUnpaidAmount(receivable.getAmount().subtract(newPaid));
                if (receivable.getUnpaidAmount().compareTo(BigDecimal.ZERO) <= 0) {
                    receivable.setStatus("paid");
                } else {
                    receivable.setStatus("partial");
                }
                receivableMapper.updateById(receivable);
            }
        }
        
        return Result.success("收款成功", payment);
    }

    @Operation(summary = "删除收款记录")
    @DeleteMapping("/payment/{id}")
    @PreAuthorize("@ss.hasPermission('finance:payment:delete')")
    public Result<Void> deletePayment(@PathVariable Long id) {
        paymentMapper.deleteById(id);
        return Result.successMsg("删除成功");
    }

    // ==================== 发票管理 ====================

    @Operation(summary = "分页查询发票记录")
    @GetMapping("/invoice/page")
    @PreAuthorize("@ss.hasPermission('finance:invoice:list')")
    public Result<PageResult<FinanceInvoice>> invoicePage(
            @RequestParam(defaultValue = "1") Integer current,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String invoiceNo,
            @RequestParam(required = false) String clientName,
            @RequestParam(required = false) String status) {
        
        Page<FinanceInvoice> page = new Page<>(current, size);
        LambdaQueryWrapper<FinanceInvoice> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(StringUtils.hasText(invoiceNo), FinanceInvoice::getInvoiceNo, invoiceNo)
               .like(StringUtils.hasText(clientName), FinanceInvoice::getClientName, clientName)
               .eq(StringUtils.hasText(status), FinanceInvoice::getStatus, status)
               .orderByDesc(FinanceInvoice::getInvoiceDate);
        
        Page<FinanceInvoice> result = invoiceMapper.selectPage(page, wrapper);
        
        return Result.success(new PageResult<>(
                result.getRecords(),
                result.getTotal(),
                result.getSize(),
                result.getCurrent()
        ));
    }

    @Operation(summary = "新增发票")
    @PostMapping("/invoice")
    @PreAuthorize("@ss.hasPermission('finance:invoice:create')")
    public Result<FinanceInvoice> createInvoice(@RequestBody FinanceInvoice invoice) {
        invoice.setInvoiceNo(generateInvoiceNo());
        invoice.setStatus("draft");
        // 计算税额
        if (invoice.getAmount() != null && invoice.getTaxRate() != null) {
            invoice.setTaxAmount(invoice.getAmount().multiply(invoice.getTaxRate()).divide(BigDecimal.valueOf(100)));
        }
        invoiceMapper.insert(invoice);
        return Result.success("创建成功", invoice);
    }

    @Operation(summary = "更新发票")
    @PutMapping("/invoice")
    @PreAuthorize("@ss.hasPermission('finance:invoice:update')")
    public Result<Void> updateInvoice(@RequestBody FinanceInvoice invoice) {
        invoiceMapper.updateById(invoice);
        return Result.successMsg("更新成功");
    }

    @Operation(summary = "删除发票")
    @DeleteMapping("/invoice/{id}")
    @PreAuthorize("@ss.hasPermission('finance:invoice:delete')")
    public Result<Void> deleteInvoice(@PathVariable Long id) {
        invoiceMapper.deleteById(id);
        return Result.successMsg("删除成功");
    }

    @Operation(summary = "开具发票")
    @PostMapping("/invoice/{id}/issue")
    @PreAuthorize("@ss.hasPermission('finance:invoice:update')")
    public Result<Void> issueInvoice(@PathVariable Long id) {
        FinanceInvoice invoice = new FinanceInvoice();
        invoice.setId(id);
        invoice.setStatus("issued");
        invoice.setInvoiceDate(LocalDate.now());
        invoiceMapper.updateById(invoice);
        return Result.successMsg("发票已开具");
    }

    @Operation(summary = "作废发票")
    @PostMapping("/invoice/{id}/cancel")
    @PreAuthorize("@ss.hasPermission('finance:invoice:update')")
    public Result<Void> cancelInvoice(@PathVariable Long id) {
        FinanceInvoice invoice = new FinanceInvoice();
        invoice.setId(id);
        invoice.setStatus("cancelled");
        invoiceMapper.updateById(invoice);
        return Result.successMsg("发票已作废");
    }

    // ==================== 工具方法 ====================

    private String generatePaymentNo() {
        String prefix = "SK" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        Long count = paymentMapper.selectCount(new LambdaQueryWrapper<FinancePayment>()
                .likeRight(FinancePayment::getPaymentNo, prefix));
        return prefix + String.format("%04d", count + 1);
    }

    private String generateInvoiceNo() {
        String prefix = "FP" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        Long count = invoiceMapper.selectCount(new LambdaQueryWrapper<FinanceInvoice>()
                .likeRight(FinanceInvoice::getInvoiceNo, prefix));
        return prefix + String.format("%04d", count + 1);
    }
}
