package com.lims.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.lims.entity.Entrustment;
import com.lims.mapper.EntrustmentMapper;
import com.lims.service.EntrustmentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

/**
 * 委托单Service实现
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class EntrustmentServiceImpl extends ServiceImpl<EntrustmentMapper, Entrustment> implements EntrustmentService {

    @Override
    public Page<Entrustment> pageList(Integer current, Integer size, String entrustmentNo, String clientName, String status) {
        Page<Entrustment> page = new Page<>(current, size);
        LambdaQueryWrapper<Entrustment> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(StringUtils.hasText(entrustmentNo), Entrustment::getEntrustmentNo, entrustmentNo)
               .like(StringUtils.hasText(clientName), Entrustment::getClientName, clientName)
               .eq(StringUtils.hasText(status), Entrustment::getStatus, status)
               .orderByDesc(Entrustment::getCreateTime);
        return page(page, wrapper);
    }

    @Override
    public Entrustment createEntrustment(Entrustment entrustment) {
        // 生成委托编号
        entrustment.setEntrustmentNo(generateEntrustmentNo());
        entrustment.setStatus("pending");
        save(entrustment);
        return entrustment;
    }

    @Override
    public void approve(Long id, boolean approved, String comment) {
        Entrustment entrustment = getById(id);
        if (entrustment != null) {
            entrustment.setStatus(approved ? "approved" : "rejected");
            updateById(entrustment);
        }
    }

    @Override
    public String generateEntrustmentNo() {
        // 格式: WT + 年月日 + 4位序号，如 WT202412050001
        String prefix = "WT" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        
        // 查询当天最大序号
        LambdaQueryWrapper<Entrustment> wrapper = new LambdaQueryWrapper<>();
        wrapper.likeRight(Entrustment::getEntrustmentNo, prefix)
               .orderByDesc(Entrustment::getEntrustmentNo)
               .last("LIMIT 1");
        Entrustment last = getOne(wrapper);
        
        int seq = 1;
        if (last != null && last.getEntrustmentNo() != null) {
            String lastNo = last.getEntrustmentNo();
            seq = Integer.parseInt(lastNo.substring(lastNo.length() - 4)) + 1;
        }
        
        return prefix + String.format("%04d", seq);
    }
}
