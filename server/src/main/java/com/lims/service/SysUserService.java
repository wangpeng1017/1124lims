package com.lims.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.lims.entity.SysUser;

/**
 * 用户Service接口
 */
public interface SysUserService extends IService<SysUser> {

    /**
     * 根据用户名查询用户
     */
    SysUser getByUsername(String username);

    /**
     * 用户登录
     */
    String login(String username, String password);

    /**
     * 创建用户
     */
    void createUser(SysUser user);

    /**
     * 更新用户
     */
    void updateUser(SysUser user);

    /**
     * 修改密码
     */
    void changePassword(Long userId, String oldPassword, String newPassword);
}
