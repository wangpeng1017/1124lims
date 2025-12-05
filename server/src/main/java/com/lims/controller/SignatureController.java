package com.lims.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.lims.common.Result;
import com.lims.entity.Signature;
import com.lims.mapper.SignatureMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 签名盖章管理Controller
 */
@Tag(name = "签名盖章管理", description = "签名和盖章图片管理")
@RestController
@RequestMapping("/signature")
@RequiredArgsConstructor
public class SignatureController {

    private final SignatureMapper signatureMapper;

    @Operation(summary = "获取所有签名盖章")
    @GetMapping("/list")
    public Result<List<Signature>> list(@RequestParam(required = false) String type) {
        LambdaQueryWrapper<Signature> wrapper = new LambdaQueryWrapper<>();
        if (type != null) {
            wrapper.eq(Signature::getType, type);
        }
        wrapper.eq(Signature::getStatus, 1)
               .orderByDesc(Signature::getCreateTime);
        return Result.success(signatureMapper.selectList(wrapper));
    }

    @Operation(summary = "获取签名列表")
    @GetMapping("/signatures")
    public Result<List<Signature>> getSignatures() {
        List<Signature> list = signatureMapper.selectList(new LambdaQueryWrapper<Signature>()
                .eq(Signature::getType, "signature")
                .eq(Signature::getStatus, 1));
        return Result.success(list);
    }

    @Operation(summary = "获取盖章列表")
    @GetMapping("/stamps")
    public Result<List<Signature>> getStamps() {
        List<Signature> list = signatureMapper.selectList(new LambdaQueryWrapper<Signature>()
                .eq(Signature::getType, "stamp")
                .eq(Signature::getStatus, 1));
        return Result.success(list);
    }

    @Operation(summary = "获取用户签名")
    @GetMapping("/user/{userId}")
    public Result<Signature> getUserSignature(@PathVariable Long userId) {
        Signature signature = signatureMapper.selectOne(new LambdaQueryWrapper<Signature>()
                .eq(Signature::getUserId, userId)
                .eq(Signature::getType, "signature")
                .eq(Signature::getStatus, 1));
        return Result.success(signature);
    }

    @Operation(summary = "新增签名/盖章")
    @PostMapping
    public Result<Void> create(@RequestBody Signature signature) {
        signature.setStatus(1);
        signatureMapper.insert(signature);
        return Result.successMsg("创建成功");
    }

    @Operation(summary = "更新签名/盖章")
    @PutMapping
    public Result<Void> update(@RequestBody Signature signature) {
        signatureMapper.updateById(signature);
        return Result.successMsg("更新成功");
    }

    @Operation(summary = "删除签名/盖章")
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        signatureMapper.deleteById(id);
        return Result.successMsg("删除成功");
    }

    @Operation(summary = "切换状态")
    @PutMapping("/{id}/status")
    public Result<Void> toggleStatus(@PathVariable Long id, @RequestParam Integer status) {
        Signature signature = new Signature();
        signature.setId(id);
        signature.setStatus(status);
        signatureMapper.updateById(signature);
        return Result.successMsg("状态更新成功");
    }

    @Operation(summary = "上传签名图片")
    @PostMapping("/upload/signature")
    public Result<String> uploadSignature(
            @RequestParam Long userId,
            @RequestParam String userName,
            @RequestParam String imagePath) {
        // 先检查是否已存在
        Signature existing = signatureMapper.selectOne(new LambdaQueryWrapper<Signature>()
                .eq(Signature::getUserId, userId)
                .eq(Signature::getType, "signature"));
        
        if (existing != null) {
            existing.setImagePath(imagePath);
            signatureMapper.updateById(existing);
        } else {
            Signature signature = new Signature();
            signature.setName(userName + "的签名");
            signature.setType("signature");
            signature.setImagePath(imagePath);
            signature.setUserId(userId);
            signature.setUserName(userName);
            signature.setStatus(1);
            signatureMapper.insert(signature);
        }
        
        return Result.success("上传成功", imagePath);
    }

    @Operation(summary = "上传盖章图片")
    @PostMapping("/upload/stamp")
    public Result<String> uploadStamp(
            @RequestParam String name,
            @RequestParam String imagePath,
            @RequestParam(required = false) String roleCode) {
        Signature stamp = new Signature();
        stamp.setName(name);
        stamp.setType("stamp");
        stamp.setImagePath(imagePath);
        stamp.setRoleCode(roleCode);
        stamp.setStatus(1);
        signatureMapper.insert(stamp);
        
        return Result.success("上传成功", imagePath);
    }
}
