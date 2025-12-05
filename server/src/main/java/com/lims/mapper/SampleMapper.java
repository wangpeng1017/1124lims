package com.lims.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.lims.entity.Sample;
import org.apache.ibatis.annotations.Mapper;

/**
 * 样品Mapper
 */
@Mapper
public interface SampleMapper extends BaseMapper<Sample> {
}
