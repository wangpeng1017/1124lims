package com.lims;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * LIMS 实验室信息管理系统
 * 启动类
 */
@SpringBootApplication
@MapperScan("com.lims.mapper")
public class LimsApplication {

    public static void main(String[] args) {
        SpringApplication.run(LimsApplication.class, args);
        System.out.println("========================================");
        System.out.println("   LIMS Server Started Successfully!    ");
        System.out.println("   API Docs: http://localhost:8080/api/doc.html");
        System.out.println("========================================");
    }
}
