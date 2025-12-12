package com.lims.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 体系文件实体
 */
@Data
@TableName("biz_system_document")
public class SystemDocument implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 文件名称
     */
    private String name;

    /**
     * 版本号，如 V1.0
     */
    private String version;

    /**
     * 文件描述
     */
    private String description;

    /**
     * 文件存储路径(MinIO)
     */
    private String filePath;

    /**
     * 原始文件名
     */
    private String originalName;

    /**
     * 文件大小(字节)
     */
    private Long fileSize;

    /**
     * 文件MIME类型
     */
    private String contentType;

    /**
     * 分类: manual-质量手册, procedure-程序文件, sop-作业指导书, regulation-管理制度, plan-计划
     */
    private String category;

    /**
     * 上传人ID
     */
    private Long uploaderId;

    /**
     * 上传人姓名
     */
    private String uploader;

    /**
     * 上传时间
     */
    private LocalDateTime uploadTime;

    /**
     * 创建时间
     */
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    /**
     * 逻辑删除
     */
    @TableLogic
    @TableField(fill = FieldFill.INSERT)
    private Integer deleted;
}
