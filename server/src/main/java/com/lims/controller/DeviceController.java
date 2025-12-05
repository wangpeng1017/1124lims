package com.lims.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.lims.common.PageResult;
import com.lims.common.Result;
import com.lims.entity.Device;
import com.lims.mapper.DeviceMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * 设备管理Controller
 */
@Tag(name = "设备管理", description = "设备信息CRUD接口")
@RestController
@RequestMapping("/device")
@RequiredArgsConstructor
public class DeviceController {

    private final DeviceMapper deviceMapper;

    @Operation(summary = "分页查询设备")
    @GetMapping("/page")
    public Result<PageResult<Device>> page(
            @RequestParam(defaultValue = "1") Integer current,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String code,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String assetType) {
        
        Page<Device> page = new Page<>(current, size);
        LambdaQueryWrapper<Device> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(StringUtils.hasText(code), Device::getCode, code)
               .like(StringUtils.hasText(name), Device::getName, name)
               .eq(StringUtils.hasText(status), Device::getStatus, status)
               .eq(StringUtils.hasText(assetType), Device::getAssetType, assetType)
               .orderByDesc(Device::getCreateTime);
        
        Page<Device> result = deviceMapper.selectPage(page, wrapper);
        
        return Result.success(new PageResult<>(
                result.getRecords(),
                result.getTotal(),
                result.getSize(),
                result.getCurrent()
        ));
    }

    @Operation(summary = "获取设备详情")
    @GetMapping("/{id}")
    public Result<Device> getById(@PathVariable Long id) {
        return Result.success(deviceMapper.selectById(id));
    }

    @Operation(summary = "新增设备")
    @PostMapping
    public Result<Void> create(@RequestBody Device device) {
        device.setCode(generateDeviceCode());
        device.setStatus("idle");
        deviceMapper.insert(device);
        return Result.successMsg("创建成功");
    }

    @Operation(summary = "更新设备")
    @PutMapping
    public Result<Void> update(@RequestBody Device device) {
        deviceMapper.updateById(device);
        return Result.successMsg("更新成功");
    }

    @Operation(summary = "删除设备")
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        deviceMapper.deleteById(id);
        return Result.successMsg("删除成功");
    }

    @Operation(summary = "更新设备状态")
    @PutMapping("/{id}/status")
    public Result<Void> updateStatus(@PathVariable Long id, @RequestParam String status) {
        Device device = new Device();
        device.setId(id);
        device.setStatus(status);
        deviceMapper.updateById(device);
        return Result.successMsg("状态更新成功");
    }

    @Operation(summary = "查询可用设备")
    @GetMapping("/available")
    public Result<List<Device>> getAvailable() {
        List<Device> devices = deviceMapper.selectList(new LambdaQueryWrapper<Device>()
                .in(Device::getStatus, "running", "idle")
                .orderByAsc(Device::getName));
        return Result.success(devices);
    }

    @Operation(summary = "查询即将定检的设备")
    @GetMapping("/calibration-due")
    public Result<List<Device>> getCalibrationDue(@RequestParam(defaultValue = "30") Integer days) {
        LocalDate dueDate = LocalDate.now().plusDays(days);
        List<Device> devices = deviceMapper.selectList(new LambdaQueryWrapper<Device>()
                .le(Device::getNextCalibrationDate, dueDate)
                .orderByAsc(Device::getNextCalibrationDate));
        return Result.success(devices);
    }

    private String generateDeviceCode() {
        String prefix = "SB" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        Long count = deviceMapper.selectCount(new LambdaQueryWrapper<Device>()
                .likeRight(Device::getCode, prefix));
        return prefix + String.format("%04d", count + 1);
    }
}
