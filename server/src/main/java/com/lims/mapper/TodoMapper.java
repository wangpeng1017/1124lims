package com.lims.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.lims.entity.Todo;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.Map;

/**
 * 待办事项Mapper
 */
@Mapper
public interface TodoMapper extends BaseMapper<Todo> {

    /**
     * 统计各状态的待办数量
     */
    @Select("SELECT " +
            "COUNT(*) as total, " +
            "SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending, " +
            "SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as inProgress, " +
            "SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed, " +
            "SUM(CASE WHEN status = 'overdue' OR (status != 'completed' AND due_date < CURDATE()) THEN 1 ELSE 0 END) as overdue, " +
            "SUM(CASE WHEN priority = 'urgent' AND status != 'completed' THEN 1 ELSE 0 END) as urgent " +
            "FROM biz_todo WHERE deleted = 0 AND (#{assigneeId} IS NULL OR assignee_id = #{assigneeId})")
    Map<String, Object> getStatistics(@Param("assigneeId") Long assigneeId);
}
