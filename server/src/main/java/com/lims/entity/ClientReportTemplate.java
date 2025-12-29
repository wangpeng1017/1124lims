package com.lims.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 客户报告模板实体
 * 用于存储可视化编辑器设计的报告模板
 */
@Data
@TableName("biz_client_report_template")
public class ClientReportTemplate implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 模板编码（唯一标识）
     */
    private String templateCode;

    /**
     * 模板名称
     */
    private String name;

    /**
     * 关联客户ID（可选，为空表示通用模板）
     */
    private Long clientId;

    /**
     * 关联客户名称
     */
    private String clientName;

    /**
     * 继承自哪个模板ID
     */
    private Long baseTemplateId;

    /**
     * 是否默认模板 0-否 1-是
     */
    private Integer isDefault;

    /**
     * 公司信息（JSON格式）
     * 包含：logoUrl, nameCn, nameEn, address, postalCode, phone
     */
    @TableField(typeHandler = com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler.class)
    private String companyInfo;

    /**
     * 客户Logo URL
     */
    private String clientLogoUrl;

    /**
     * 页面配置（JSON格式）
     * 包含多个页面，每个页面有：id, type, name, layout[]
     */
    @TableField(typeHandler = com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler.class)
    private String pages;

    /**
     * 声明内容（JSON数组格式）
     */
    @TableField(typeHandler = com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler.class)
    private String declarations;

    /**
     * 状态 0-禁用 1-启用
     */
    private Integer status;

    /**
     * 版本号
     */
    private String version;

    /**
     * 描述
     */
    private String description;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    private String createBy;

    private String updateBy;

    @TableLogic
    @TableField(fill = FieldFill.INSERT)
    private Integer deleted;
}
