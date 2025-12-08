package com.lims.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 财务应收记录实体类
 */
@Data
@TableName("fin_receivable")
public class FinanceReceivable {

    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 关联委托单ID
     */
    private Long entrustmentId;
    
    /**
     * 关联委托单号
     */
    private String entrustmentNo;
    
    /**
     * 关联合同ID
     */
    private Long contractId;
    
    /**
     * 合同编号
     */
    private String contractNo;
    
    /**
     * 客户ID
     */
    private Long clientId;
    
    /**
     * 客户名称
     */
    private String clientName;
    
    /**
     * 应收金额
     */
    private BigDecimal amount;
    
    /**
     * 已收金额
     */
    private BigDecimal paidAmount;
    
    /**
     * 未收金额
     */
    private BigDecimal unpaidAmount;
    
    /**
     * 账期类型：prepay预付/postpay后付
     */
    private String paymentType;
    
    /**
     * 到期日期
     */
    private LocalDate dueDate;
    
    /**
     * 状态：pending待收/partial部分/paid已收/overdue逾期
     */
    private String status;
    
    /**
     * 备注
     */
    private String remark;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
}
