package com.lims.common;

import lombok.Getter;

/**
 * 业务异常
 */
@Getter
public class BusinessException extends RuntimeException {

    private final Integer code;

    public BusinessException(String message) {
        super(message);
        this.code = 500;
    }

    public BusinessException(Integer code, String message) {
        super(message);
        this.code = code;
    }

    public BusinessException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.code = errorCode.getCode();
    }

    /**
     * 常用错误码
     */
    @Getter
    public enum ErrorCode {
        // 通用错误
        PARAM_ERROR(400, "参数错误"),
        UNAUTHORIZED(401, "未授权"),
        FORBIDDEN(403, "无权限访问"),
        NOT_FOUND(404, "资源不存在"),
        
        // 业务错误
        USER_NOT_FOUND(1001, "用户不存在"),
        PASSWORD_ERROR(1002, "密码错误"),
        USER_DISABLED(1003, "用户已禁用"),
        TOKEN_EXPIRED(1004, "Token已过期"),
        
        ENTRUSTMENT_NOT_FOUND(2001, "委托单不存在"),
        ENTRUSTMENT_STATUS_ERROR(2002, "委托单状态错误"),
        
        SAMPLE_NOT_FOUND(3001, "样品不存在"),
        SAMPLE_STATUS_ERROR(3002, "样品状态错误"),
        
        TASK_NOT_FOUND(4001, "任务不存在"),
        TASK_ALREADY_ASSIGNED(4002, "任务已分配"),
        TASK_STATUS_ERROR(4003, "任务状态错误"),
        
        REPORT_NOT_FOUND(5001, "报告不存在"),
        REPORT_STATUS_ERROR(5002, "报告状态错误"),
        
        FILE_UPLOAD_ERROR(6001, "文件上传失败"),
        FILE_NOT_FOUND(6002, "文件不存在");

        private final Integer code;
        private final String message;

        ErrorCode(Integer code, String message) {
            this.code = code;
            this.message = message;
        }
    }
}
