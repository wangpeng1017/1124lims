package com.lims.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 设备信息实体
 */
@Data
@TableName("biz_device")
public class Device implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 设备编号
     */
    private String code;

    /**
     * 设备名称
     */
    private String name;

    /**
     * 型号
     */
    private String model;

    /**
     * 生产厂家
     */
    private String manufacturer;

    /**
     * 出厂编号
     */
    private String serialNumber;

    /**
     * 资产类型: instrument-仪器 device-设备 glassware-玻璃器皿
     */
    private String assetType;

    /**
     * 状态: running-运行中 maintenance-保养中 repair-维修中 idle-闲置 scrapped-报废
     */
    private String status;

    /**
     * 存放位置
     */
    private String location;

    /**
     * 所属部门
     */
    private String department;

    /**
     * 购入日期
     */
    private LocalDate purchaseDate;

    /**
     * 投运日期
     */
    private LocalDate commissioningDate;

    /**
     * 下次定检日期
     */
    private LocalDate nextCalibrationDate;

    /**
     * 负责人
     */
    private String responsiblePerson;

    /**
     * 负责人ID
     */
    private Long responsiblePersonId;

    /**
     * 利用率
     */
    private BigDecimal utilization;

    /**
     * 运行工时
     */
    private BigDecimal operatingHours;

    /**
     * 技术参数
     */
    private String specifications;

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
