package com.lims.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 签名盖章配置实体
 */
@Data
@TableName("sys_signature")
public class Signature implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 名称
     */
    private String name;

    /**
     * 类型: signature-签名 stamp-盖章
     */
    private String type;

    /**
     * 图片路径
     */
    private String imagePath;

    /**
     * 关联用户ID（签名用）
     */
    private Long userId;

    /**
     * 关联用户姓名
     */
    private String userName;

    /**
     * 关联角色编码（盖章用）
     */
    private String roleCode;

    /**
     * 状态 0-禁用 1-启用
     */
    private Integer status;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    @TableLogic
    @TableField(fill = FieldFill.INSERT)
    private Integer deleted;
}
