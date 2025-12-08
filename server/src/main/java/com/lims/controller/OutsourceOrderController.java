package com.lims.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.lims.common.PageResult;
import com.lims.common.Result;
import com.lims.entity.OutsourceOrder;
import com.lims.mapper.OutsourceOrderMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * 委外订单管理Controller
 */
@Tag(name = "委外管理", description = "委外订单CRUD接口")
@RestController
@RequestMapping("/outsource")
@RequiredArgsConstructor
public class OutsourceOrderController {

    private final OutsourceOrderMapper orderMapper;

    @Operation(summary = "分页查询委外订单")
    @GetMapping("/page")
    @PreAuthorize("@ss.hasPermission('outsource:list')")
    public Result<PageResult<OutsourceOrder>> page(
            @RequestParam(defaultValue = "1") Integer current,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String orderNo,
            @RequestParam(required = false) String supplierName,
            @RequestParam(required = false) String status) {
        
        Page<OutsourceOrder> page = new Page<>(current, size);
        LambdaQueryWrapper<OutsourceOrder> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(StringUtils.hasText(orderNo), OutsourceOrder::getOrderNo, orderNo)
               .like(StringUtils.hasText(supplierName), OutsourceOrder::getSupplierName, supplierName)
               .eq(StringUtils.hasText(status), OutsourceOrder::getStatus, status)
               .orderByDesc(OutsourceOrder::getCreateTime);
        
        Page<OutsourceOrder> result = orderMapper.selectPage(page, wrapper);
        
        return Result.success(new PageResult<>(
                result.getRecords(),
                result.getTotal(),
                result.getSize(),
                result.getCurrent()
        ));
    }

    @Operation(summary = "获取委外订单详情")
    @GetMapping("/{id}")
    @PreAuthorize("@ss.hasPermission('outsource:query')")
    public Result<OutsourceOrder> getById(@PathVariable Long id) {
        return Result.success(orderMapper.selectById(id));
    }

    @Operation(summary = "根据委托单获取委外订单")
    @GetMapping("/by-entrustment/{entrustmentId}")
    public Result<List<OutsourceOrder>> getByEntrustment(@PathVariable Long entrustmentId) {
        List<OutsourceOrder> list = orderMapper.selectList(new LambdaQueryWrapper<OutsourceOrder>()
                .eq(OutsourceOrder::getEntrustmentId, entrustmentId));
        return Result.success(list);
    }

    @Operation(summary = "根据供应商获取委外订单")
    @GetMapping("/by-supplier/{supplierId}")
    public Result<List<OutsourceOrder>> getBySupplier(@PathVariable Long supplierId) {
        List<OutsourceOrder> list = orderMapper.selectList(new LambdaQueryWrapper<OutsourceOrder>()
                .eq(OutsourceOrder::getSupplierId, supplierId)
                .orderByDesc(OutsourceOrder::getCreateTime));
        return Result.success(list);
    }

    @Operation(summary = "新增委外订单")
    @PostMapping
    @PreAuthorize("@ss.hasPermission('outsource:create')")
    public Result<OutsourceOrder> create(@RequestBody OutsourceOrder order) {
        order.setOrderNo(generateOrderNo());
        order.setStatus("draft");
        orderMapper.insert(order);
        return Result.success("创建成功", order);
    }

    @Operation(summary = "更新委外订单")
    @PutMapping
    @PreAuthorize("@ss.hasPermission('outsource:update')")
    public Result<Void> update(@RequestBody OutsourceOrder order) {
        orderMapper.updateById(order);
        return Result.successMsg("更新成功");
    }

    @Operation(summary = "删除委外订单")
    @DeleteMapping("/{id}")
    @PreAuthorize("@ss.hasPermission('outsource:delete')")
    public Result<Void> delete(@PathVariable Long id) {
        orderMapper.deleteById(id);
        return Result.successMsg("删除成功");
    }

    @Operation(summary = "提交审批")
    @PostMapping("/{id}/submit")
    @PreAuthorize("@ss.hasPermission('outsource:update')")
    public Result<Void> submit(@PathVariable Long id) {
        OutsourceOrder order = new OutsourceOrder();
        order.setId(id);
        order.setStatus("pending");
        orderMapper.updateById(order);
        return Result.successMsg("已提交审批");
    }

    @Operation(summary = "审批委外订单")
    @PostMapping("/{id}/approve")
    @PreAuthorize("@ss.hasPermission('outsource:approve')")
    public Result<Void> approve(
            @PathVariable Long id,
            @RequestParam Long approverId,
            @RequestParam String approverName,
            @RequestParam boolean approved,
            @RequestParam(required = false) String comment) {
        OutsourceOrder order = orderMapper.selectById(id);
        if (order != null) {
            order.setApproverId(approverId);
            order.setApprover(approverName);
            order.setApproveTime(LocalDateTime.now());
            order.setStatus(approved ? "approved" : "draft");
            if (!approved) {
                order.setRemark(comment);
            }
            orderMapper.updateById(order);
        }
        return Result.successMsg(approved ? "审批通过" : "审批拒绝");
    }

    @Operation(summary = "开始执行")
    @PostMapping("/{id}/start")
    public Result<Void> start(@PathVariable Long id) {
        OutsourceOrder order = new OutsourceOrder();
        order.setId(id);
        order.setStatus("in_progress");
        orderMapper.updateById(order);
        return Result.successMsg("已开始执行");
    }

    @Operation(summary = "完成订单")
    @PostMapping("/{id}/complete")
    public Result<Void> complete(@PathVariable Long id, @RequestParam(required = false) String resultAttachment) {
        OutsourceOrder order = new OutsourceOrder();
        order.setId(id);
        order.setStatus("completed");
        order.setCompletedDate(LocalDate.now());
        order.setResultAttachment(resultAttachment);
        orderMapper.updateById(order);
        return Result.successMsg("订单已完成");
    }

    @Operation(summary = "取消订单")
    @PostMapping("/{id}/cancel")
    public Result<Void> cancel(@PathVariable Long id, @RequestParam(required = false) String reason) {
        OutsourceOrder order = new OutsourceOrder();
        order.setId(id);
        order.setStatus("cancelled");
        order.setRemark(reason);
        orderMapper.updateById(order);
        return Result.successMsg("订单已取消");
    }

    private String generateOrderNo() {
        String prefix = "WW" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        Long count = orderMapper.selectCount(new LambdaQueryWrapper<OutsourceOrder>()
                .likeRight(OutsourceOrder::getOrderNo, prefix));
        return prefix + String.format("%04d", count + 1);
    }
}
