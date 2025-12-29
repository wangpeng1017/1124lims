package com.lims.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.lims.common.BusinessException;
import com.lims.entity.ClientReportTemplate;
import com.lims.mapper.ClientReportTemplateMapper;
import com.lims.service.ClientReportTemplateService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * 客户报告模板 Service 实现类
 */
@Service
@RequiredArgsConstructor
public class ClientReportTemplateServiceImpl implements ClientReportTemplateService {

    private final ClientReportTemplateMapper templateMapper;

    @Override
    public Page<ClientReportTemplate> page(Integer current, Integer size, String name, Long clientId) {
        Page<ClientReportTemplate> page = new Page<>(current, size);
        LambdaQueryWrapper<ClientReportTemplate> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(StringUtils.hasText(name), ClientReportTemplate::getName, name)
               .eq(clientId != null, ClientReportTemplate::getClientId, clientId)
               .eq(ClientReportTemplate::getDeleted, 0)
               .orderByDesc(ClientReportTemplate::getIsDefault)
               .orderByDesc(ClientReportTemplate::getCreateTime);
        return templateMapper.selectPage(page, wrapper);
    }

    @Override
    public List<ClientReportTemplate> listActive() {
        LambdaQueryWrapper<ClientReportTemplate> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ClientReportTemplate::getStatus, 1)
               .eq(ClientReportTemplate::getDeleted, 0)
               .orderByDesc(ClientReportTemplate::getIsDefault)
               .orderByAsc(ClientReportTemplate::getName);
        return templateMapper.selectList(wrapper);
    }

    @Override
    public ClientReportTemplate getById(Long id) {
        return templateMapper.selectById(id);
    }

    @Override
    public ClientReportTemplate getByTemplateCode(String templateCode) {
        return templateMapper.selectByTemplateCode(templateCode);
    }

    @Override
    public List<ClientReportTemplate> getByClientId(Long clientId) {
        return templateMapper.selectByClientId(clientId);
    }

    @Override
    public ClientReportTemplate getDefaultTemplate() {
        return templateMapper.selectDefaultTemplate();
    }

    @Override
    public ClientReportTemplate getTemplateForClient(Long clientId) {
        // 优先查找客户专属模板
        if (clientId != null) {
            List<ClientReportTemplate> clientTemplates = getByClientId(clientId);
            if (!clientTemplates.isEmpty()) {
                return clientTemplates.get(0);
            }
        }
        // 返回默认模板
        return getDefaultTemplate();
    }

    @Override
    @Transactional
    public ClientReportTemplate create(ClientReportTemplate template) {
        // 生成模板编码
        if (!StringUtils.hasText(template.getTemplateCode())) {
            template.setTemplateCode("TPL-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        }

        // 设置默认值
        if (template.getStatus() == null) {
            template.setStatus(1);
        }
        if (template.getIsDefault() == null) {
            template.setIsDefault(0);
        }
        if (!StringUtils.hasText(template.getVersion())) {
            template.setVersion("1.0");
        }

        template.setCreateTime(LocalDateTime.now());
        template.setUpdateTime(LocalDateTime.now());
        template.setDeleted(0);

        templateMapper.insert(template);
        return template;
    }

    @Override
    @Transactional
    public void update(ClientReportTemplate template) {
        template.setUpdateTime(LocalDateTime.now());
        templateMapper.updateById(template);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        ClientReportTemplate template = templateMapper.selectById(id);
        if (template != null && template.getIsDefault() == 1) {
            throw new BusinessException("默认模板不能删除");
        }
        templateMapper.deleteById(id);
    }

    @Override
    @Transactional
    public void toggleStatus(Long id, Integer status) {
        ClientReportTemplate template = new ClientReportTemplate();
        template.setId(id);
        template.setStatus(status);
        template.setUpdateTime(LocalDateTime.now());
        templateMapper.updateById(template);
    }

    @Override
    @Transactional
    public void setAsDefault(Long id) {
        // 先取消所有默认
        LambdaUpdateWrapper<ClientReportTemplate> wrapper = new LambdaUpdateWrapper<>();
        wrapper.set(ClientReportTemplate::getIsDefault, 0)
               .eq(ClientReportTemplate::getIsDefault, 1);
        templateMapper.update(null, wrapper);

        // 设置新的默认模板
        ClientReportTemplate template = new ClientReportTemplate();
        template.setId(id);
        template.setIsDefault(1);
        template.setStatus(1); // 默认模板必须启用
        template.setUpdateTime(LocalDateTime.now());
        templateMapper.updateById(template);
    }

    @Override
    @Transactional
    public ClientReportTemplate copy(Long id) {
        ClientReportTemplate original = templateMapper.selectById(id);
        if (original == null) {
            throw new BusinessException("原模板不存在");
        }

        ClientReportTemplate copy = new ClientReportTemplate();
        copy.setTemplateCode("TPL-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        copy.setName(original.getName() + " - 副本");
        copy.setClientId(original.getClientId());
        copy.setClientName(original.getClientName());
        copy.setBaseTemplateId(original.getId());
        copy.setIsDefault(0);
        copy.setCompanyInfo(original.getCompanyInfo());
        copy.setClientLogoUrl(original.getClientLogoUrl());
        copy.setPages(original.getPages());
        copy.setDeclarations(original.getDeclarations());
        copy.setStatus(0); // 副本默认禁用
        copy.setVersion("1.0");
        copy.setDescription("复制自: " + original.getName());
        copy.setCreateTime(LocalDateTime.now());
        copy.setUpdateTime(LocalDateTime.now());
        copy.setDeleted(0);

        templateMapper.insert(copy);
        return copy;
    }
}
