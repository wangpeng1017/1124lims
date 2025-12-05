package com.lims.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.lims.entity.Sample;

import java.util.List;

/**
 * 样品Service接口
 */
public interface SampleService extends IService<Sample> {

    /**
     * 分页查询样品
     */
    Page<Sample> pageList(Integer current, Integer size, String sampleNo, String name, String status);

    /**
     * 批量创建样品
     */
    List<Sample> batchCreate(Long entrustmentId, List<Sample> samples);

    /**
     * 生成样品编号
     */
    String generateSampleNo();

    /**
     * 更新样品状态
     */
    void updateStatus(Long id, String status);
}
