package com.lims.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.lims.entity.TestReport;
import org.apache.ibatis.annotations.Mapper;

/**
 * 检测报告Mapper
 */
@Mapper
public interface TestReportMapper extends BaseMapper<TestReport> {
}
