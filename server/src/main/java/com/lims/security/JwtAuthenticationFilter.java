package com.lims.security;

import com.lims.util.JwtUtil;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * JWT 认证过滤器
 * 从请求头中提取 Token，验证后设置认证信息到 SecurityContext
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsServiceImpl userDetailsService;

    private static final String TOKEN_PREFIX = "Bearer ";
    private static final String HEADER_NAME = "Authorization";

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        try {
            String token = getTokenFromRequest(request);
            
            if (StringUtils.hasText(token) && jwtUtil.validateToken(token)) {
                // 从 Token 中获取用户信息
                Claims claims = jwtUtil.parseToken(token);
                Long userId = getUserIdFromClaims(claims);
                
                if (userId != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    // 加载用户详情
                    LoginUserDetails userDetails = userDetailsService.loadUserById(userId);
                    
                    if (userDetails != null && userDetails.isEnabled()) {
                        // 创建认证对象
                        UsernamePasswordAuthenticationToken authentication =
                                new UsernamePasswordAuthenticationToken(
                                        userDetails,
                                        null,
                                        userDetails.getAuthorities()
                                );
                        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        
                        // 设置到 SecurityContext
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                        
                        log.debug("用户 {} 认证成功", userDetails.getUsername());
                    }
                }
            }
        } catch (JwtException e) {
            log.warn("JWT 认证失败: {}", e.getMessage());
            // 不抛出异常，让请求继续，由后续的权限检查处理
        } catch (Exception e) {
            log.error("JWT 过滤器异常", e);
        }
        
        filterChain.doFilter(request, response);
    }

    /**
     * 从请求中提取 Token
     */
    private String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader(HEADER_NAME);
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith(TOKEN_PREFIX)) {
            return bearerToken.substring(TOKEN_PREFIX.length());
        }
        return null;
    }

    /**
     * 从 Claims 中获取用户ID
     */
    private Long getUserIdFromClaims(Claims claims) {
        Object userId = claims.get("userId");
        if (userId instanceof Integer) {
            return ((Integer) userId).longValue();
        } else if (userId instanceof Long) {
            return (Long) userId;
        } else if (userId instanceof String) {
            return Long.parseLong((String) userId);
        }
        return null;
    }

    /**
     * 判断是否应该跳过过滤
     */
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();
        // 白名单路径不需要过滤
        return path.startsWith("/auth/login") ||
               path.startsWith("/auth/register") ||
               path.startsWith("/doc.html") ||
               path.startsWith("/swagger-ui") ||
               path.startsWith("/v3/api-docs") ||
               path.startsWith("/webjars") ||
               path.equals("/favicon.ico");
    }
}

