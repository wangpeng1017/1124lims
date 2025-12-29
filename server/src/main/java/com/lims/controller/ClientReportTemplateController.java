package com.lims.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.lims.common.PageResult;
import com.lims.common.Result;
import com.lims.entity.ClientReportTemplate;
import com.lims.service.ClientReportTemplateService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 客户报告模板管理 Controller
 */
@Tag(name = "客户报告模板管理", description = "报告模板的可视化配置")
@RestController
@RequestMapping("/client-report-template")
@RequiredArgsConstructor
public class ClientReportTemplateController {

    private final ClientReportTemplateService templateService;

    @Operation(summary = "分页查询模板")
    @GetMapping("/page")
    public Result<PageResult<ClientReportTemplate>> page(
            @RequestParam(defaultValue = "1") Integer current,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Long clientId) {

        Page<ClientReportTemplate> result = templateService.page(current, size, name, clientId);

        return Result.success(new PageResult<>(
                result.getRecords(),
                result.getTotal(),
                result.getSize(),
                result.getCurrent()
        ));
    }

    @Operation(summary = "获取所有启用的模板")
    @GetMapping("/list")
    public Result<List<ClientReportTemplate>> list() {
        return Result.success(templateService.listActive());
    }

    @Operation(summary = "获取模板详情")
    @GetMapping("/{id}")
    public Result<ClientReportTemplate> getById(@PathVariable Long id) {
        return Result.success(templateService.getById(id));
    }

    @Operation(summary = "根据模板编码获取模板")
    @GetMapping("/code/{templateCode}")
    public Result<ClientReportTemplate> getByCode(@PathVariable String templateCode) {
        return Result.success(templateService.getByTemplateCode(templateCode));
    }

    @Operation(summary = "根据客户ID获取模板列表")
    @GetMapping("/client/{clientId}")
    public Result<List<ClientReportTemplate>> getByClientId(@PathVariable Long clientId) {
        return Result.success(templateService.getByClientId(clientId));
    }

    @Operation(summary = "获取默认模板")
    @GetMapping("/default")
    public Result<ClientReportTemplate> getDefault() {
        return Result.success(templateService.getDefaultTemplate());
    }

    @Operation(summary = "为客户获取最合适的模板")
    @GetMapping("/for-client")
    public Result<ClientReportTemplate> getForClient(@RequestParam(required = false) Long clientId) {
        return Result.success(templateService.getTemplateForClient(clientId));
    }

    @Operation(summary = "创建模板")
    @PostMapping
    public Result<ClientReportTemplate> create(@RequestBody ClientReportTemplate template) {
        ClientReportTemplate created = templateService.create(template);
        return Result.success("创建成功", created);
    }

    @Operation(summary = "更新模板")
    @PutMapping
    public Result<Void> update(@RequestBody ClientReportTemplate template) {
        templateService.update(template);
        return Result.successMsg("更新成功");
    }

    @Operation(summary = "删除模板")
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        templateService.delete(id);
        return Result.successMsg("删除成功");
    }

    @Operation(summary = "切换模板状态")
    @PutMapping("/{id}/status")
    public Result<Void> toggleStatus(@PathVariable Long id, @RequestParam Integer status) {
        templateService.toggleStatus(id, status);
        return Result.successMsg("状态更新成功");
    }

    @Operation(summary = "设置为默认模板")
    @PutMapping("/{id}/set-default")
    public Result<Void> setAsDefault(@PathVariable Long id) {
        templateService.setAsDefault(id);
        return Result.successMsg("已设置为默认模板");
    }

    @Operation(summary = "复制模板")
    @PostMapping("/{id}/copy")
    public Result<ClientReportTemplate> copy(@PathVariable Long id) {
        ClientReportTemplate copy = templateService.copy(id);
        return Result.success("复制成功", copy);
    }
}
