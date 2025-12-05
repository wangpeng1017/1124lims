package com.lims.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.lims.common.PageResult;
import com.lims.common.Result;
import com.lims.entity.ElnTemplate;
import com.lims.mapper.ElnTemplateMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * ELN模板管理Controller
 */
@Tag(name = "ELN模板管理", description = "检测模板配置")
@RestController
@RequestMapping("/eln-template")
@RequiredArgsConstructor
public class ElnTemplateController {

    private final ElnTemplateMapper templateMapper;

    @Operation(summary = "分页查询模板")
    @GetMapping("/page")
    public Result<PageResult<ElnTemplate>> page(
            @RequestParam(defaultValue = "1") Integer current,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String testParameter) {
        
        Page<ElnTemplate> page = new Page<>(current, size);
        LambdaQueryWrapper<ElnTemplate> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(StringUtils.hasText(name), ElnTemplate::getName, name)
               .like(StringUtils.hasText(testParameter), ElnTemplate::getTestParameter, testParameter)
               .eq(ElnTemplate::getStatus, 1)
               .orderByDesc(ElnTemplate::getCreateTime);
        
        Page<ElnTemplate> result = templateMapper.selectPage(page, wrapper);
        
        return Result.success(new PageResult<>(
                result.getRecords(),
                result.getTotal(),
                result.getSize(),
                result.getCurrent()
        ));
    }

    @Operation(summary = "获取模板详情")
    @GetMapping("/{id}")
    public Result<ElnTemplate> getById(@PathVariable Long id) {
        return Result.success(templateMapper.selectById(id));
    }

    @Operation(summary = "根据检测参数获取模板")
    @GetMapping("/by-parameter")
    public Result<ElnTemplate> getByParameter(@RequestParam String testParameter) {
        ElnTemplate template = templateMapper.selectOne(new LambdaQueryWrapper<ElnTemplate>()
                .eq(ElnTemplate::getTestParameter, testParameter)
                .eq(ElnTemplate::getStatus, 1)
                .last("LIMIT 1"));
        return Result.success(template);
    }

    @Operation(summary = "获取所有可用模板")
    @GetMapping("/list")
    public Result<List<ElnTemplate>> list() {
        List<ElnTemplate> list = templateMapper.selectList(new LambdaQueryWrapper<ElnTemplate>()
                .eq(ElnTemplate::getStatus, 1)
                .orderByAsc(ElnTemplate::getName));
        return Result.success(list);
    }

    @Operation(summary = "新增模板")
    @PostMapping
    public Result<Void> create(@RequestBody ElnTemplate template) {
        template.setStatus(1);
        template.setVersion("1.0");
        templateMapper.insert(template);
        return Result.successMsg("创建成功");
    }

    @Operation(summary = "更新模板")
    @PutMapping
    public Result<Void> update(@RequestBody ElnTemplate template) {
        templateMapper.updateById(template);
        return Result.successMsg("更新成功");
    }

    @Operation(summary = "删除模板")
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        templateMapper.deleteById(id);
        return Result.successMsg("删除成功");
    }

    @Operation(summary = "切换状态")
    @PutMapping("/{id}/status")
    public Result<Void> toggleStatus(@PathVariable Long id, @RequestParam Integer status) {
        ElnTemplate template = new ElnTemplate();
        template.setId(id);
        template.setStatus(status);
        templateMapper.updateById(template);
        return Result.successMsg("状态更新成功");
    }

    @Operation(summary = "复制模板")
    @PostMapping("/{id}/copy")
    public Result<ElnTemplate> copy(@PathVariable Long id) {
        ElnTemplate original = templateMapper.selectById(id);
        if (original != null) {
            ElnTemplate copy = new ElnTemplate();
            copy.setName(original.getName() + " - 副本");
            copy.setCode(original.getCode() + "_copy");
            copy.setTestMethod(original.getTestMethod());
            copy.setTestStandard(original.getTestStandard());
            copy.setTestParameter(original.getTestParameter());
            copy.setTemplateContent(original.getTemplateContent());
            copy.setDescription(original.getDescription());
            copy.setVersion("1.0");
            copy.setStatus(0); // 副本默认禁用
            templateMapper.insert(copy);
            return Result.success("复制成功", copy);
        }
        return Result.error("原模板不存在");
    }
}
