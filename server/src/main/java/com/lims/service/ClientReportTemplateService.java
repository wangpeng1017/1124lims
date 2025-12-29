package com.lims.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.lims.entity.ClientReportTemplate;

import java.util.List;

/**
 * 客户报告模板 Service 接口
 */
public interface ClientReportTemplateService {

    /**
     * 分页查询模板
     */
    Page<ClientReportTemplate> page(Integer current, Integer size, String name, Long clientId);

    /**
     * 获取所有启用的模板
     */
    List<ClientReportTemplate> listActive();

    /**
     * 根据ID获取模板
     */
    ClientReportTemplate getById(Long id);

    /**
     * 根据模板编码获取模板
     */
    ClientReportTemplate getByTemplateCode(String templateCode);

    /**
     * 根据客户ID获取模板列表
     */
    List<ClientReportTemplate> getByClientId(Long clientId);

    /**
     * 获取默认模板
     */
    ClientReportTemplate getDefaultTemplate();

    /**
     * 为客户获取最合适的模板（优先客户专属，其次默认）
     */
    ClientReportTemplate getTemplateForClient(Long clientId);

    /**
     * 创建模板
     */
    ClientReportTemplate create(ClientReportTemplate template);

    /**
     * 更新模板
     */
    void update(ClientReportTemplate template);

    /**
     * 删除模板
     */
    void delete(Long id);

    /**
     * 切换模板状态
     */
    void toggleStatus(Long id, Integer status);

    /**
     * 设置为默认模板
     */
    void setAsDefault(Long id);

    /**
     * 复制模板
     */
    ClientReportTemplate copy(Long id);
}
