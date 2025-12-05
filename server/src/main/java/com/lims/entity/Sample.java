package com.lims.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 样品实体
 */
@Data
@TableName("biz_sample")
public class Sample implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 样品编号
     */
    private String sampleNo;

    /**
     * 委托单ID
     */
    private Long entrustmentId;

    /**
     * 委托单号
     */
    private String entrustmentNo;

    /**
     * 样品名称
     */
    private String name;

    /**
     * 规格型号
     */
    private String spec;

    /**
     * 材质
     */
    private String material;

    /**
     * 数量
     */
    private Integer quantity;

    /**
     * 单位
     */
    private String unit;

    /**
     * 收样日期
     */
    private LocalDate receiptDate;

    /**
     * 收样人
     */
    private String receiptPerson;

    /**
     * 收样人ID
     */
    private Long receiptPersonId;

    /**
     * 存放位置
     */
    private String storageLocation;

    /**
     * 照片路径
     */
    private String photos;

    /**
     * 状态: pending-待检测, testing-检测中, completed-已完成, returned-已归还, destroyed-已销毁
     */
    private String status;

    /**
     * 是否委外
     */
    private Boolean isOutsourced;

    /**
     * 委外供应商ID
     */
    private Long outsourceSupplierId;

    /**
     * 委外供应商名称
     */
    private String outsourceSupplierName;

    /**
     * 备注
     */
    private String remark;

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
