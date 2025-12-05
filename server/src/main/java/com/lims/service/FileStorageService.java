package com.lims.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.List;

/**
 * 文件存储Service接口
 */
public interface FileStorageService {

    /**
     * 上传文件
     * @param file 文件
     * @param folder 文件夹路径
     * @return 文件访问路径
     */
    String upload(MultipartFile file, String folder);

    /**
     * 上传文件（指定文件名）
     */
    String upload(MultipartFile file, String folder, String filename);

    /**
     * 上传文件流
     */
    String upload(InputStream inputStream, String folder, String filename, String contentType);

    /**
     * 下载文件
     */
    InputStream download(String filePath);

    /**
     * 删除文件
     */
    void delete(String filePath);

    /**
     * 批量删除
     */
    void deleteBatch(List<String> filePaths);

    /**
     * 获取文件访问URL
     */
    String getPresignedUrl(String filePath);

    /**
     * 获取文件访问URL（指定过期时间）
     */
    String getPresignedUrl(String filePath, int expiry);

    /**
     * 检查文件是否存在
     */
    boolean exists(String filePath);
}
