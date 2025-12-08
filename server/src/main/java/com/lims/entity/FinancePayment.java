package com.lims.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 收款记录实体类
 */
@Data
@TableName("fin_payment")
public class FinancePayment {

    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 收款编号
     */
    private String paymentNo;
    
    /**
     * 关联应收记录ID
     */
    private Long receivableId;
    
    /**
     * 关联委托单ID
     */
    private Long entrustmentId;
    
    /**
     * 客户ID
     */
    private Long clientId;
    
    /**
     * 客户名称
     */
    private String clientName;
    
    /**
     * 收款金额
     */
    private BigDecimal amount;
    
    /**
     * 收款日期
     */
    private LocalDate paymentDate;
    
    /**
     * 收款方式：bank银行/cash现金/check支票/other其他
     */
    private String paymentMethod;
    
    /**
     * 银行账号
     */
    private String bankAccount;
    
    /**
     * 经办人ID
     */
    private Long handlerId;
    
    /**
     * 经办人
     */
    private String handler;
    
    /**
     * 备注
     */
    private String remark;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
}
