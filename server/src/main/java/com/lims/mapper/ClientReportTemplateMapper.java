package com.lims.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.lims.entity.ClientReportTemplate;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * 客户报告模板 Mapper 接口
 */
@Mapper
public interface ClientReportTemplateMapper extends BaseMapper<ClientReportTemplate> {

    /**
     * 根据客户ID查询模板
     */
    @Select("SELECT * FROM biz_client_report_template WHERE client_id = #{clientId} AND status = 1 AND deleted = 0")
    List<ClientReportTemplate> selectByClientId(@Param("clientId") Long clientId);

    /**
     * 查询默认模板
     */
    @Select("SELECT * FROM biz_client_report_template WHERE is_default = 1 AND status = 1 AND deleted = 0 LIMIT 1")
    ClientReportTemplate selectDefaultTemplate();

    /**
     * 根据模板编码查询
     */
    @Select("SELECT * FROM biz_client_report_template WHERE template_code = #{templateCode} AND deleted = 0")
    ClientReportTemplate selectByTemplateCode(@Param("templateCode") String templateCode);
}
