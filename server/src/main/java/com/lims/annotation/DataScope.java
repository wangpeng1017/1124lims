package com.lims.annotation;

import java.lang.annotation.*;

/**
 * 数据权限注解
 * 标记需要进行数据权限过滤的方法
 * 
 * 使用示例:
 * @DataScope(deptAlias = "d", userAlias = "u")
 * public List<Entrustment> selectList(...);
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface DataScope {

    /**
     * 部门表别名
     * 默认为空，使用主表
     */
    String deptAlias() default "";

    /**
     * 用户表别名
     * 默认为空，使用主表
     */
    String userAlias() default "";

    /**
     * 部门ID字段名
     * 默认为 dept_id
     */
    String deptIdColumn() default "dept_id";

    /**
     * 用户ID字段名
     * 默认为 create_by
     */
    String userIdColumn() default "create_by";
}
