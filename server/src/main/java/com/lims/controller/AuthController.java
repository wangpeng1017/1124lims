package com.lims.controller;

import com.lims.common.Result;
import com.lims.dto.LoginRequest;
import com.lims.dto.LoginResponse;
import com.lims.entity.SysUser;
import com.lims.security.LoginUserDetails;
import com.lims.security.PermissionService;
import com.lims.service.SysUserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 认证Controller
 */
@Tag(name = "认证管理", description = "用户登录、注册、登出等接口")
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final SysUserService userService;
    private final PermissionService permissionService;

    @Operation(summary = "用户登录")
    @PostMapping("/login")
    public Result<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        String token = userService.login(request.getUsername(), request.getPassword());
        
        SysUser user = userService.getByUsername(request.getUsername());
        
        LoginResponse response = new LoginResponse();
        response.setToken(token);
        response.setUserId(user.getId());
        response.setUsername(user.getUsername());
        response.setRealName(user.getRealName());
        response.setAvatar(user.getAvatar());
        
        return Result.success("登录成功", response);
    }

    @Operation(summary = "获取当前用户信息")
    @GetMapping("/info")
    public Result<Map<String, Object>> getUserInfo() {
        LoginUserDetails user = permissionService.getCurrentUser();
        if (user == null) {
            return Result.error("用户未登录");
        }
        
        Map<String, Object> info = new HashMap<>();
        info.put("userId", user.getUserId());
        info.put("username", user.getUsername());
        info.put("realName", user.getRealName());
        info.put("deptId", user.getDeptId());
        info.put("roleIds", user.getRoleIds());
        info.put("roleCodes", user.getRoleCodes());
        info.put("permissions", user.getPermissions());
        info.put("dataScope", user.getDataScope());
        info.put("isAdmin", user.isAdmin());
        
        return Result.success(info);
    }

    @Operation(summary = "用户登出")
    @PostMapping("/logout")
    public Result<Void> logout() {
        // Token 是无状态的，客户端只需删除本地 Token 即可
        // 如需服务端黑名单，可将 Token 加入 Redis 黑名单
        return Result.successMsg("登出成功");
    }
}

