package com.lims.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 发票记录实体类
 */
@Data
@TableName("fin_invoice")
public class FinanceInvoice {

    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 发票号码
     */
    private String invoiceNo;
    
    /**
     * 发票类型：normal普通/special专用
     */
    private String invoiceType;
    
    /**
     * 关联客户ID
     */
    private Long clientId;
    
    /**
     * 客户名称
     */
    private String clientName;
    
    /**
     * 纳税人识别号
     */
    private String taxNo;
    
    /**
     * 开票金额
     */
    private BigDecimal amount;
    
    /**
     * 税率
     */
    private BigDecimal taxRate;
    
    /**
     * 税额
     */
    private BigDecimal taxAmount;
    
    /**
     * 开票日期
     */
    private LocalDate invoiceDate;
    
    /**
     * 状态：draft草稿/issued已开/cancelled作废
     */
    private String status;
    
    /**
     * 关联委托单IDs
     */
    private String entrustmentIds;
    
    /**
     * 开票人
     */
    private String creator;
    
    /**
     * 备注
     */
    private String remark;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
}
