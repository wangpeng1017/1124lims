package com.lims.common;

import lombok.Getter;

/**
 * 响应状态码枚举
 */
@Getter
public enum ResultCode {
    
    // 成功
    SUCCESS(200, "操作成功"),
    
    // 客户端错误 4xx
    BAD_REQUEST(400, "请求参数错误"),
    UNAUTHORIZED(401, "未登录或登录已过期"),
    FORBIDDEN(403, "没有操作权限"),
    NOT_FOUND(404, "资源不存在"),
    METHOD_NOT_ALLOWED(405, "请求方法不支持"),
    
    // 业务错误 5xx
    INTERNAL_ERROR(500, "系统内部错误"),
    
    // 用户相关 1xxx
    USER_NOT_FOUND(1001, "用户不存在"),
    USERNAME_EXISTS(1002, "用户名已存在"),
    PASSWORD_ERROR(1003, "密码错误"),
    ACCOUNT_DISABLED(1004, "账号已被禁用"),
    TOKEN_EXPIRED(1005, "登录已过期，请重新登录"),
    TOKEN_INVALID(1006, "无效的Token"),
    
    // 业务相关 2xxx
    ENTRUSTMENT_NOT_FOUND(2001, "委托单不存在"),
    SAMPLE_NOT_FOUND(2002, "样品不存在"),
    TASK_NOT_FOUND(2003, "任务不存在"),
    REPORT_NOT_FOUND(2004, "报告不存在"),
    
    // 文件相关 3xxx
    FILE_UPLOAD_ERROR(3001, "文件上传失败"),
    FILE_NOT_FOUND(3002, "文件不存在"),
    FILE_TYPE_NOT_SUPPORT(3003, "不支持的文件类型"),
    FILE_SIZE_EXCEED(3004, "文件大小超过限制");

    private final int code;
    private final String message;

    ResultCode(int code, String message) {
        this.code = code;
        this.message = message;
    }
}
