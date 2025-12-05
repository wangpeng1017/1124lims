package com.lims.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.lims.entity.Entrustment;

/**
 * 委托单Service接口
 */
public interface EntrustmentService extends IService<Entrustment> {

    /**
     * 分页查询委托单
     */
    Page<Entrustment> pageList(Integer current, Integer size, String entrustmentNo, String clientName, String status);

    /**
     * 创建委托单
     */
    Entrustment createEntrustment(Entrustment entrustment);

    /**
     * 审核委托单
     */
    void approve(Long id, boolean approved, String comment);

    /**
     * 生成委托编号
     */
    String generateEntrustmentNo();
}
