package com.lims.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.lims.entity.TestTask;
import org.apache.ibatis.annotations.Mapper;

/**
 * 检测任务Mapper
 */
@Mapper
public interface TestTaskMapper extends BaseMapper<TestTask> {
}
