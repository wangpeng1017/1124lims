package com.lims.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 供应商实体
 */
@Data
@TableName("biz_supplier")
public class Supplier implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 供应商编码
     */
    private String code;

    /**
     * 供应商名称
     */
    private String name;

    /**
     * 供应商简称
     */
    private String shortName;

    /**
     * 供应商类型: lab-检测机构 manufacturer-生产商 service-服务商
     */
    private String type;

    /**
     * 资质等级: A/B/C
     */
    private String qualificationLevel;

    /**
     * 资质证书
     */
    private String qualificationCert;

    /**
     * 资质有效期
     */
    private String qualificationExpiry;

    /**
     * 服务能力（JSON格式，检测参数列表）
     */
    private String capabilities;

    /**
     * 联系人
     */
    private String contactPerson;

    /**
     * 联系电话
     */
    private String phone;

    /**
     * 邮箱
     */
    private String email;

    /**
     * 地址
     */
    private String address;

    /**
     * 评价分数
     */
    private Integer score;

    /**
     * 状态 0-禁用 1-正常
     */
    private Integer status;

    /**
     * 备注
     */
    private String remark;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    @TableLogic
    @TableField(fill = FieldFill.INSERT)
    private Integer deleted;
}
