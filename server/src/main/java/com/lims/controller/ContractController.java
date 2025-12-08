package com.lims.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.lims.common.PageResult;
import com.lims.common.Result;
import com.lims.entity.Contract;
import com.lims.mapper.ContractMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * 合同管理Controller
 */
@Tag(name = "合同管理", description = "合同CRUD接口")
@RestController
@RequestMapping("/contract")
@RequiredArgsConstructor
public class ContractController {

    private final ContractMapper contractMapper;

    @Operation(summary = "分页查询合同")
    @GetMapping("/page")
    @PreAuthorize("@ss.hasPermission('contract:list')")
    public Result<PageResult<Contract>> page(
            @RequestParam(defaultValue = "1") Integer current,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String contractNo,
            @RequestParam(required = false) String clientName,
            @RequestParam(required = false) String status) {
        
        Page<Contract> page = new Page<>(current, size);
        LambdaQueryWrapper<Contract> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(StringUtils.hasText(contractNo), Contract::getContractNo, contractNo)
               .like(StringUtils.hasText(clientName), Contract::getClientName, clientName)
               .eq(StringUtils.hasText(status), Contract::getStatus, status)
               .orderByDesc(Contract::getCreateTime);
        
        Page<Contract> result = contractMapper.selectPage(page, wrapper);
        
        return Result.success(new PageResult<>(
                result.getRecords(),
                result.getTotal(),
                result.getSize(),
                result.getCurrent()
        ));
    }

    @Operation(summary = "获取合同详情")
    @GetMapping("/{id}")
    @PreAuthorize("@ss.hasPermission('contract:query')")
    public Result<Contract> getById(@PathVariable Long id) {
        return Result.success(contractMapper.selectById(id));
    }

    @Operation(summary = "根据委托单获取合同")
    @GetMapping("/by-entrustment/{entrustmentId}")
    public Result<Contract> getByEntrustment(@PathVariable Long entrustmentId) {
        Contract contract = contractMapper.selectOne(new LambdaQueryWrapper<Contract>()
                .eq(Contract::getEntrustmentId, entrustmentId));
        return Result.success(contract);
    }

    @Operation(summary = "根据客户获取合同列表")
    @GetMapping("/by-client/{clientId}")
    public Result<List<Contract>> getByClient(@PathVariable Long clientId) {
        List<Contract> list = contractMapper.selectList(new LambdaQueryWrapper<Contract>()
                .eq(Contract::getClientId, clientId)
                .orderByDesc(Contract::getCreateTime));
        return Result.success(list);
    }

    @Operation(summary = "新增合同")
    @PostMapping
    @PreAuthorize("@ss.hasPermission('contract:create')")
    public Result<Contract> create(@RequestBody Contract contract) {
        contract.setContractNo(generateContractNo());
        contract.setStatus("draft");
        contractMapper.insert(contract);
        return Result.success("创建成功", contract);
    }

    @Operation(summary = "更新合同")
    @PutMapping
    @PreAuthorize("@ss.hasPermission('contract:update')")
    public Result<Void> update(@RequestBody Contract contract) {
        contractMapper.updateById(contract);
        return Result.successMsg("更新成功");
    }

    @Operation(summary = "删除合同")
    @DeleteMapping("/{id}")
    @PreAuthorize("@ss.hasPermission('contract:delete')")
    public Result<Void> delete(@PathVariable Long id) {
        contractMapper.deleteById(id);
        return Result.successMsg("删除成功");
    }

    @Operation(summary = "提交审批")
    @PostMapping("/{id}/submit")
    @PreAuthorize("@ss.hasPermission('contract:update')")
    public Result<Void> submit(@PathVariable Long id) {
        Contract contract = new Contract();
        contract.setId(id);
        contract.setStatus("pending");
        contractMapper.updateById(contract);
        return Result.successMsg("已提交审批");
    }

    @Operation(summary = "审批合同")
    @PostMapping("/{id}/approve")
    @PreAuthorize("@ss.hasPermission('contract:approve')")
    public Result<Void> approve(
            @PathVariable Long id,
            @RequestParam boolean approved,
            @RequestParam(required = false) String comment) {
        Contract contract = new Contract();
        contract.setId(id);
        contract.setStatus(approved ? "active" : "draft");
        if (!approved) {
            contract.setRemark(comment);
        }
        contractMapper.updateById(contract);
        return Result.successMsg(approved ? "审批通过" : "审批拒绝");
    }

    @Operation(summary = "完成合同")
    @PostMapping("/{id}/complete")
    public Result<Void> complete(@PathVariable Long id) {
        Contract contract = new Contract();
        contract.setId(id);
        contract.setStatus("completed");
        contractMapper.updateById(contract);
        return Result.successMsg("合同已完成");
    }

    @Operation(summary = "统计合同数据")
    @GetMapping("/statistics")
    public Result<Object> statistics() {
        // TODO: 实现统计逻辑
        return Result.success();
    }

    private String generateContractNo() {
        String prefix = "HT" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        Long count = contractMapper.selectCount(new LambdaQueryWrapper<Contract>()
                .likeRight(Contract::getContractNo, prefix));
        return prefix + String.format("%04d", count + 1);
    }
}
