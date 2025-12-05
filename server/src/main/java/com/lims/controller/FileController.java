package com.lims.controller;

import com.lims.common.Result;
import com.lims.service.FileStorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

/**
 * 文件上传Controller
 */
@Tag(name = "文件管理", description = "文件上传下载接口")
@RestController
@RequestMapping("/file")
@RequiredArgsConstructor
public class FileController {

    private final FileStorageService fileStorageService;

    @Operation(summary = "上传单个文件")
    @PostMapping("/upload")
    public Result<FileUploadResult> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam(defaultValue = "common") String folder) {
        
        String path = fileStorageService.upload(file, folder);
        String url = fileStorageService.getPresignedUrl(path);
        
        FileUploadResult result = new FileUploadResult();
        result.setPath(path);
        result.setUrl(url);
        result.setOriginalName(file.getOriginalFilename());
        result.setSize(file.getSize());
        result.setContentType(file.getContentType());
        
        return Result.success("上传成功", result);
    }

    @Operation(summary = "批量上传文件")
    @PostMapping("/upload/batch")
    public Result<List<FileUploadResult>> uploadBatch(
            @RequestParam("files") MultipartFile[] files,
            @RequestParam(defaultValue = "common") String folder) {
        
        List<FileUploadResult> results = new ArrayList<>();
        for (MultipartFile file : files) {
            String path = fileStorageService.upload(file, folder);
            String url = fileStorageService.getPresignedUrl(path);
            
            FileUploadResult result = new FileUploadResult();
            result.setPath(path);
            result.setUrl(url);
            result.setOriginalName(file.getOriginalFilename());
            result.setSize(file.getSize());
            result.setContentType(file.getContentType());
            results.add(result);
        }
        
        return Result.success("上传成功", results);
    }

    @Operation(summary = "上传样品照片")
    @PostMapping("/upload/sample-photo")
    public Result<FileUploadResult> uploadSamplePhoto(@RequestParam("file") MultipartFile file) {
        return upload(file, "samples");
    }

    @Operation(summary = "上传报告附件")
    @PostMapping("/upload/report")
    public Result<FileUploadResult> uploadReportFile(@RequestParam("file") MultipartFile file) {
        return upload(file, "reports");
    }

    @Operation(summary = "上传签名图片")
    @PostMapping("/upload/signature")
    public Result<FileUploadResult> uploadSignature(@RequestParam("file") MultipartFile file) {
        return upload(file, "signatures");
    }

    @Operation(summary = "上传盖章图片")
    @PostMapping("/upload/stamp")
    public Result<FileUploadResult> uploadStamp(@RequestParam("file") MultipartFile file) {
        return upload(file, "stamps");
    }

    @Operation(summary = "上传合同附件")
    @PostMapping("/upload/contract")
    public Result<FileUploadResult> uploadContract(@RequestParam("file") MultipartFile file) {
        return upload(file, "contracts");
    }

    @Operation(summary = "获取文件访问URL")
    @GetMapping("/url")
    public Result<String> getUrl(@RequestParam String path) {
        String url = fileStorageService.getPresignedUrl(path);
        return Result.success(url);
    }

    @Operation(summary = "下载文件")
    @GetMapping("/download")
    public ResponseEntity<InputStreamResource> download(
            @RequestParam String path,
            @RequestParam(required = false) String filename) {
        
        InputStream inputStream = fileStorageService.download(path);
        
        // 获取文件名
        String downloadName = filename;
        if (downloadName == null || downloadName.isEmpty()) {
            downloadName = path.substring(path.lastIndexOf("/") + 1);
        }
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, 
                        "attachment; filename=\"" + URLEncoder.encode(downloadName, StandardCharsets.UTF_8) + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(new InputStreamResource(inputStream));
    }

    @Operation(summary = "删除文件")
    @DeleteMapping
    public Result<Void> delete(@RequestParam String path) {
        fileStorageService.delete(path);
        return Result.successMsg("删除成功");
    }

    @Operation(summary = "批量删除文件")
    @DeleteMapping("/batch")
    public Result<Void> deleteBatch(@RequestBody List<String> paths) {
        fileStorageService.deleteBatch(paths);
        return Result.successMsg("删除成功");
    }

    @Operation(summary = "检查文件是否存在")
    @GetMapping("/exists")
    public Result<Boolean> exists(@RequestParam String path) {
        boolean exists = fileStorageService.exists(path);
        return Result.success(exists);
    }

    @Data
    public static class FileUploadResult {
        private String path;
        private String url;
        private String originalName;
        private Long size;
        private String contentType;
    }
}
