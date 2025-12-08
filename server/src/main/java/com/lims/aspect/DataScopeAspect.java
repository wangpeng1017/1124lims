package com.lims.aspect;

import com.lims.annotation.DataScope;
import com.lims.security.LoginUserDetails;
import com.lims.security.PermissionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;

/**
 * 数据权限 AOP 切面
 * 在查询前根据用户的数据权限范围自动添加 SQL 过滤条件
 * 
 * 数据权限范围说明:
 * 1 - 全部数据: 不添加任何过滤条件
 * 2 - 本部门及以下: WHERE dept_id IN (用户部门ID, 子部门ID列表)
 * 3 - 本部门: WHERE dept_id = 用户部门ID
 * 4 - 仅本人: WHERE create_by = 用户ID
 * 5 - 自定义: WHERE dept_id IN (自定义部门ID列表)
 */
@Slf4j
@Aspect
@Component
@RequiredArgsConstructor
public class DataScopeAspect {

    private final PermissionService permissionService;

    /**
     * 数据权限过滤关键字 - 存储在 ThreadLocal 中供 SQL 拼接使用
     */
    private static final ThreadLocal<String> DATA_SCOPE_FILTER = new ThreadLocal<>();

    /**
     * 获取当前线程的数据权限过滤条件
     */
    public static String getDataScopeFilter() {
        return DATA_SCOPE_FILTER.get();
    }

    /**
     * 清除当前线程的数据权限过滤条件
     */
    public static void clearDataScopeFilter() {
        DATA_SCOPE_FILTER.remove();
    }

    /**
     * 数据范围过滤
     */
    @Before("@annotation(dataScope)")
    public void doBefore(JoinPoint point, DataScope dataScope) {
        clearDataScopeFilter();
        
        LoginUserDetails user = permissionService.getCurrentUser();
        if (user == null) {
            log.warn("数据权限过滤: 用户未登录");
            return;
        }

        // 管理员不限制
        if (user.isAdmin()) {
            log.debug("数据权限过滤: 管理员用户 {} 跳过过滤", user.getUsername());
            return;
        }

        Integer scope = user.getDataScope();
        if (scope == null) {
            scope = 4; // 默认仅本人
        }

        StringBuilder sqlFilter = new StringBuilder();
        String deptAlias = dataScope.deptAlias();
        String userAlias = dataScope.userAlias();
        String deptIdColumn = dataScope.deptIdColumn();
        String userIdColumn = dataScope.userIdColumn();

        // 构建字段前缀
        String deptField = deptAlias.isEmpty() ? deptIdColumn : deptAlias + "." + deptIdColumn;
        String userField = userAlias.isEmpty() ? userIdColumn : userAlias + "." + userIdColumn;

        switch (scope) {
            case 1: // 全部数据
                // 不添加过滤
                log.debug("数据权限过滤: 用户 {} 拥有全部数据权限", user.getUsername());
                break;

            case 2: // 本部门及以下
                // 需要递归查询子部门，这里简化处理，使用 ancestors LIKE 方式
                // 实际使用时需要结合 sys_dept 表的 ancestors 字段
                if (user.getDeptId() != null) {
                    sqlFilter.append(String.format(
                            " AND (%s = %d OR %s IN (SELECT id FROM sys_dept WHERE ancestors LIKE '%%,%d,%%' OR ancestors LIKE '%%,%d'))",
                            deptField, user.getDeptId(),
                            deptField, user.getDeptId(), user.getDeptId()
                    ));
                    log.debug("数据权限过滤: 用户 {} 本部门及以下 [deptId={}]", user.getUsername(), user.getDeptId());
                }
                break;

            case 3: // 本部门
                if (user.getDeptId() != null) {
                    sqlFilter.append(String.format(" AND %s = %d", deptField, user.getDeptId()));
                    log.debug("数据权限过滤: 用户 {} 本部门 [deptId={}]", user.getUsername(), user.getDeptId());
                }
                break;

            case 4: // 仅本人
                sqlFilter.append(String.format(" AND %s = %d", userField, user.getUserId()));
                log.debug("数据权限过滤: 用户 {} 仅本人 [userId={}]", user.getUsername(), user.getUserId());
                break;

            case 5: // 自定义部门
                if (user.getDataScopeDeptIds() != null && !user.getDataScopeDeptIds().isEmpty()) {
                    String deptIds = String.join(",", 
                            user.getDataScopeDeptIds().stream().map(String::valueOf).toArray(String[]::new));
                    sqlFilter.append(String.format(" AND %s IN (%s)", deptField, deptIds));
                    log.debug("数据权限过滤: 用户 {} 自定义部门 [deptIds={}]", user.getUsername(), deptIds);
                }
                break;

            default:
                // 默认只能看自己的数据
                sqlFilter.append(String.format(" AND %s = %d", userField, user.getUserId()));
                log.debug("数据权限过滤: 用户 {} 默认仅本人 [userId={}]", user.getUsername(), user.getUserId());
        }

        if (sqlFilter.length() > 0) {
            DATA_SCOPE_FILTER.set(sqlFilter.toString());
        }
    }
}
