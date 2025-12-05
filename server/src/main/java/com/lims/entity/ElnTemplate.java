package com.lims.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * ELN检测模板实体
 */
@Data
@TableName("biz_eln_template")
public class ElnTemplate implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 模板名称
     */
    private String name;

    /**
     * 模板编码
     */
    private String code;

    /**
     * 检测方法
     */
    private String testMethod;

    /**
     * 检测标准
     */
    private String testStandard;

    /**
     * 检测参数
     */
    private String testParameter;

    /**
     * 模板内容（JSON格式）
     * 包含字段定义、计算公式、验证规则等
     */
    private String templateContent;

    /**
     * 版本号
     */
    private String version;

    /**
     * 状态 0-禁用 1-启用
     */
    private Integer status;

    /**
     * 描述
     */
    private String description;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    private String createBy;

    @TableLogic
    @TableField(fill = FieldFill.INSERT)
    private Integer deleted;
}
