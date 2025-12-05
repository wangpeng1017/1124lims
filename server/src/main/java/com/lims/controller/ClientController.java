package com.lims.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.lims.common.PageResult;
import com.lims.common.Result;
import com.lims.entity.Client;
import com.lims.mapper.ClientMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * 客户单位管理Controller
 */
@Tag(name = "客户管理", description = "客户单位CRUD接口")
@RestController
@RequestMapping("/client")
@RequiredArgsConstructor
public class ClientController {

    private final ClientMapper clientMapper;

    @Operation(summary = "分页查询客户")
    @GetMapping("/page")
    public Result<PageResult<Client>> page(
            @RequestParam(defaultValue = "1") Integer current,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String creditLevel) {
        
        Page<Client> page = new Page<>(current, size);
        LambdaQueryWrapper<Client> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(StringUtils.hasText(name), Client::getName, name)
               .eq(StringUtils.hasText(type), Client::getType, type)
               .eq(StringUtils.hasText(creditLevel), Client::getCreditLevel, creditLevel)
               .eq(Client::getStatus, 1)
               .orderByDesc(Client::getCreateTime);
        
        Page<Client> result = clientMapper.selectPage(page, wrapper);
        
        return Result.success(new PageResult<>(
                result.getRecords(),
                result.getTotal(),
                result.getSize(),
                result.getCurrent()
        ));
    }

    @Operation(summary = "获取所有客户（下拉选择）")
    @GetMapping("/list")
    public Result<List<Client>> list() {
        List<Client> list = clientMapper.selectList(new LambdaQueryWrapper<Client>()
                .eq(Client::getStatus, 1)
                .orderByAsc(Client::getName));
        return Result.success(list);
    }

    @Operation(summary = "获取客户详情")
    @GetMapping("/{id}")
    public Result<Client> getById(@PathVariable Long id) {
        return Result.success(clientMapper.selectById(id));
    }

    @Operation(summary = "新增客户")
    @PostMapping
    public Result<Void> create(@RequestBody Client client) {
        client.setCode(generateClientCode());
        client.setStatus(1);
        clientMapper.insert(client);
        return Result.successMsg("创建成功");
    }

    @Operation(summary = "更新客户")
    @PutMapping
    public Result<Void> update(@RequestBody Client client) {
        clientMapper.updateById(client);
        return Result.successMsg("更新成功");
    }

    @Operation(summary = "删除客户")
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        clientMapper.deleteById(id);
        return Result.successMsg("删除成功");
    }

    @Operation(summary = "切换客户状态")
    @PutMapping("/{id}/status")
    public Result<Void> toggleStatus(@PathVariable Long id, @RequestParam Integer status) {
        Client client = new Client();
        client.setId(id);
        client.setStatus(status);
        clientMapper.updateById(client);
        return Result.successMsg("状态更新成功");
    }

    @Operation(summary = "根据名称搜索客户")
    @GetMapping("/search")
    public Result<List<Client>> search(@RequestParam String keyword) {
        List<Client> list = clientMapper.selectList(new LambdaQueryWrapper<Client>()
                .like(Client::getName, keyword)
                .or()
                .like(Client::getShortName, keyword)
                .eq(Client::getStatus, 1)
                .last("LIMIT 20"));
        return Result.success(list);
    }

    private String generateClientCode() {
        String prefix = "KH" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        Long count = clientMapper.selectCount(new LambdaQueryWrapper<Client>()
                .likeRight(Client::getCode, prefix));
        return prefix + String.format("%04d", count + 1);
    }
}
