package com.lims.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 检测数据录入记录实体
 */
@Data
@TableName("biz_test_data")
public class TestData implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 任务ID
     */
    private Long taskId;

    /**
     * 任务编号
     */
    private String taskNo;

    /**
     * 样品ID
     */
    private Long sampleId;

    /**
     * 样品编号
     */
    private String sampleNo;

    /**
     * 模板ID
     */
    private Long templateId;

    /**
     * 模板名称
     */
    private String templateName;

    /**
     * 录入数据（JSON格式）
     */
    private String dataContent;

    /**
     * 计算结果（JSON格式）
     */
    private String resultContent;

    /**
     * 设备ID
     */
    private Long deviceId;

    /**
     * 设备名称
     */
    private String deviceName;

    /**
     * 环境温度
     */
    private String envTemperature;

    /**
     * 环境湿度
     */
    private String envHumidity;

    /**
     * 检测员ID
     */
    private Long testerId;

    /**
     * 检测员
     */
    private String tester;

    /**
     * 检测时间
     */
    private LocalDateTime testTime;

    /**
     * 状态: draft-草稿 submitted-已提交 approved-已审核 rejected-已驳回
     */
    private String status;

    /**
     * 审核员ID
     */
    private Long reviewerId;

    /**
     * 审核员
     */
    private String reviewer;

    /**
     * 审核时间
     */
    private LocalDateTime reviewTime;

    /**
     * 审核意见
     */
    private String reviewComment;

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
