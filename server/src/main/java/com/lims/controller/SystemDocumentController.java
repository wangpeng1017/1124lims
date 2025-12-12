package com.lims.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.lims.common.PageResult;
import com.lims.common.Result;
import com.lims.entity.SystemDocument;
import com.lims.mapper.SystemDocumentMapper;
import com.lims.service.FileStorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * 体系文件Controller
 */
@Tag(name = "体系文件", description = "体系文件管理接口")
@RestController
@RequestMapping("/system-document")
@RequiredArgsConstructor
@Slf4j
public class SystemDocumentController {

    private final SystemDocumentMapper documentMapper;
    private final FileStorageService fileStorageService;

    private static final String DOCUMENT_PATH_PREFIX = "documents/";

    @Operation(summary = "分页查询体系文件")
    @GetMapping("/page")
    @PreAuthorize("@ss.hasPermission('system-document:list')")
    public Result<PageResult<SystemDocument>> page(
            @RequestParam(defaultValue = "1") Integer current,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String version) {

        Page<SystemDocument> page = new Page<>(current, size);
        LambdaQueryWrapper<SystemDocument> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(StringUtils.hasText(name), SystemDocument::getName, name)
                .eq(StringUtils.hasText(category), SystemDocument::getCategory, category)
                .like(StringUtils.hasText(version), SystemDocument::getVersion, version)
                .orderByDesc(SystemDocument::getUploadTime);

        Page<SystemDocument> result = documentMapper.selectPage(page, wrapper);

        return Result.success(new PageResult<>(
                result.getRecords(),
                result.getTotal(),
                result.getSize(),
                result.getCurrent()
        ));
    }

    @Operation(summary = "获取所有体系文件")
    @GetMapping("/list")
    @PreAuthorize("@ss.hasPermission('system-document:list')")
    public Result<List<SystemDocument>> list(
            @RequestParam(required = false) String category) {

        LambdaQueryWrapper<SystemDocument> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(StringUtils.hasText(category), SystemDocument::getCategory, category)
                .orderByDesc(SystemDocument::getUploadTime);

        List<SystemDocument> list = documentMapper.selectList(wrapper);
        return Result.success(list);
    }

    @Operation(summary = "获取体系文件详情")
    @GetMapping("/{id}")
    @PreAuthorize("@ss.hasPermission('system-document:query')")
    public Result<SystemDocument> getById(@PathVariable Long id) {
        SystemDocument document = documentMapper.selectById(id);
        return Result.success(document);
    }

    @Operation(summary = "上传体系文件")
    @PostMapping("/upload")
    @PreAuthorize("@ss.hasPermission('system-document:create')")
    public Result<SystemDocument> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam String name,
            @RequestParam String version,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Long uploaderId,
            @RequestParam(required = false) String uploader) {

        try {
            // 生成存储路径
            String originalName = file.getOriginalFilename();
            String extension = originalName != null && originalName.contains(".")
                    ? originalName.substring(originalName.lastIndexOf("."))
                    : "";
            String storageName = UUID.randomUUID().toString() + extension;
            String filePath = DOCUMENT_PATH_PREFIX + storageName;

            // 上传文件到MinIO
            fileStorageService.uploadFile(file, filePath);

            // 保存文件记录
            SystemDocument document = new SystemDocument();
            document.setName(name);
            document.setVersion(version);
            document.setDescription(description);
            document.setFilePath(filePath);
            document.setOriginalName(originalName);
            document.setFileSize(file.getSize());
            document.setContentType(file.getContentType());
            document.setCategory(category);
            document.setUploaderId(uploaderId);
            document.setUploader(uploader);
            document.setUploadTime(LocalDateTime.now());

            documentMapper.insert(document);

            return Result.success("上传成功", document);
        } catch (Exception e) {
            log.error("上传体系文件失败", e);
            return Result.error("上传失败: " + e.getMessage());
        }
    }

    @Operation(summary = "下载体系文件")
    @GetMapping("/download/{id}")
    @PreAuthorize("@ss.hasPermission('system-document:download')")
    public ResponseEntity<InputStreamResource> download(@PathVariable Long id) {
        try {
            SystemDocument document = documentMapper.selectById(id);
            if (document == null) {
                return ResponseEntity.notFound().build();
            }

            InputStream inputStream = fileStorageService.downloadFile(document.getFilePath());

            String encodedFileName = URLEncoder.encode(document.getOriginalName(), StandardCharsets.UTF_8)
                    .replaceAll("\\+", "%20");

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename*=UTF-8''" + encodedFileName)
                    .contentType(MediaType.parseMediaType(document.getContentType() != null
                            ? document.getContentType()
                            : MediaType.APPLICATION_OCTET_STREAM_VALUE))
                    .contentLength(document.getFileSize() != null ? document.getFileSize() : -1)
                    .body(new InputStreamResource(inputStream));

        } catch (Exception e) {
            log.error("下载体系文件失败", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @Operation(summary = "更新体系文件信息")
    @PutMapping("/{id}")
    @PreAuthorize("@ss.hasPermission('system-document:update')")
    public Result<Void> update(
            @PathVariable Long id,
            @RequestBody SystemDocument document) {

        document.setId(id);
        // 不允许通过此接口更新文件路径等敏感字段
        document.setFilePath(null);
        document.setOriginalName(null);
        document.setFileSize(null);
        document.setContentType(null);

        documentMapper.updateById(document);
        return Result.successMsg("更新成功");
    }

    @Operation(summary = "更新体系文件（含文件替换）")
    @PostMapping("/{id}/replace")
    @PreAuthorize("@ss.hasPermission('system-document:update')")
    public Result<SystemDocument> replaceFile(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String version,
            @RequestParam(required = false) String description) {

        try {
            SystemDocument existingDoc = documentMapper.selectById(id);
            if (existingDoc == null) {
                return Result.error("文件不存在");
            }

            // 删除旧文件
            try {
                fileStorageService.deleteFile(existingDoc.getFilePath());
            } catch (Exception e) {
                log.warn("删除旧文件失败: {}", existingDoc.getFilePath());
            }

            // 上传新文件
            String originalName = file.getOriginalFilename();
            String extension = originalName != null && originalName.contains(".")
                    ? originalName.substring(originalName.lastIndexOf("."))
                    : "";
            String storageName = UUID.randomUUID().toString() + extension;
            String filePath = DOCUMENT_PATH_PREFIX + storageName;

            fileStorageService.uploadFile(file, filePath);

            // 更新记录
            existingDoc.setFilePath(filePath);
            existingDoc.setOriginalName(originalName);
            existingDoc.setFileSize(file.getSize());
            existingDoc.setContentType(file.getContentType());
            existingDoc.setUploadTime(LocalDateTime.now());

            if (StringUtils.hasText(name)) {
                existingDoc.setName(name);
            }
            if (StringUtils.hasText(version)) {
                existingDoc.setVersion(version);
            }
            if (description != null) {
                existingDoc.setDescription(description);
            }

            documentMapper.updateById(existingDoc);

            return Result.success("替换成功", existingDoc);
        } catch (Exception e) {
            log.error("替换体系文件失败", e);
            return Result.error("替换失败: " + e.getMessage());
        }
    }

    @Operation(summary = "删除体系文件")
    @DeleteMapping("/{id}")
    @PreAuthorize("@ss.hasPermission('system-document:delete')")
    public Result<Void> delete(@PathVariable Long id) {
        try {
            SystemDocument document = documentMapper.selectById(id);
            if (document != null && document.getFilePath() != null) {
                try {
                    fileStorageService.deleteFile(document.getFilePath());
                } catch (Exception e) {
                    log.warn("删除文件失败: {}", document.getFilePath());
                }
            }

            documentMapper.deleteById(id);
            return Result.successMsg("删除成功");
        } catch (Exception e) {
            log.error("删除体系文件失败", e);
            return Result.error("删除失败: " + e.getMessage());
        }
    }

    @Operation(summary = "搜索体系文件")
    @GetMapping("/search")
    @PreAuthorize("@ss.hasPermission('system-document:list')")
    public Result<List<SystemDocument>> search(@RequestParam String keyword) {
        LambdaQueryWrapper<SystemDocument> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(SystemDocument::getName, keyword)
                .or()
                .like(SystemDocument::getOriginalName, keyword)
                .or()
                .like(SystemDocument::getDescription, keyword)
                .orderByDesc(SystemDocument::getUploadTime);

        List<SystemDocument> list = documentMapper.selectList(wrapper);
        return Result.success(list);
    }
}
