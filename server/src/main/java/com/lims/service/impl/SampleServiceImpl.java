package com.lims.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.lims.entity.Entrustment;
import com.lims.entity.Sample;
import com.lims.mapper.EntrustmentMapper;
import com.lims.mapper.SampleMapper;
import com.lims.service.SampleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

/**
 * 样品Service实现
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SampleServiceImpl extends ServiceImpl<SampleMapper, Sample> implements SampleService {

    private final EntrustmentMapper entrustmentMapper;

    @Override
    public Page<Sample> pageList(Integer current, Integer size, String sampleNo, String name, String status) {
        Page<Sample> page = new Page<>(current, size);
        LambdaQueryWrapper<Sample> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(StringUtils.hasText(sampleNo), Sample::getSampleNo, sampleNo)
               .like(StringUtils.hasText(name), Sample::getName, name)
               .eq(StringUtils.hasText(status), Sample::getStatus, status)
               .orderByDesc(Sample::getCreateTime);
        return page(page, wrapper);
    }

    @Override
    public List<Sample> batchCreate(Long entrustmentId, List<Sample> samples) {
        Entrustment entrustment = entrustmentMapper.selectById(entrustmentId);
        List<Sample> result = new ArrayList<>();
        
        for (Sample sample : samples) {
            sample.setEntrustmentId(entrustmentId);
            if (entrustment != null) {
                sample.setEntrustmentNo(entrustment.getEntrustmentNo());
            }
            sample.setSampleNo(generateSampleNo());
            sample.setStatus("pending");
            save(sample);
            result.add(sample);
        }
        
        return result;
    }

    @Override
    public String generateSampleNo() {
        // 格式: YP + 年月日 + 4位序号，如 YP202412050001
        String prefix = "YP" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        
        LambdaQueryWrapper<Sample> wrapper = new LambdaQueryWrapper<>();
        wrapper.likeRight(Sample::getSampleNo, prefix)
               .orderByDesc(Sample::getSampleNo)
               .last("LIMIT 1");
        Sample last = getOne(wrapper);
        
        int seq = 1;
        if (last != null && last.getSampleNo() != null) {
            String lastNo = last.getSampleNo();
            seq = Integer.parseInt(lastNo.substring(lastNo.length() - 4)) + 1;
        }
        
        return prefix + String.format("%04d", seq);
    }

    @Override
    public void updateStatus(Long id, String status) {
        Sample sample = new Sample();
        sample.setId(id);
        sample.setStatus(status);
        updateById(sample);
    }
}
