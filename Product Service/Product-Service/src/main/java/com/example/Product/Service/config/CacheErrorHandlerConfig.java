package com.example.Product.Service.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.Cache;
import org.springframework.cache.annotation.CachingConfigurer;
import org.springframework.cache.interceptor.CacheErrorHandler;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CacheErrorHandlerConfig implements CachingConfigurer {

    private static final Logger logger = LoggerFactory.getLogger(CacheErrorHandlerConfig.class);

    @Override
    public CacheErrorHandler errorHandler() {
        return new CacheErrorHandler() {
            @Override
            public void handleCacheGetError(RuntimeException exception, Cache cache, Object key) {
                logCacheError("GET", exception, cache, key);
            }

            @Override
            public void handleCachePutError(RuntimeException exception, Cache cache, Object key, Object value) {
                logCacheError("PUT", exception, cache, key);
            }

            @Override
            public void handleCacheEvictError(RuntimeException exception, Cache cache, Object key) {
                logCacheError("EVICT", exception, cache, key);
            }

            @Override
            public void handleCacheClearError(RuntimeException exception, Cache cache) {
                logCacheError("CLEAR", exception, cache, null);
            }
        };
    }

    private void logCacheError(String operation, RuntimeException exception, Cache cache, Object key) {
        String cacheName = cache == null ? "unknown" : cache.getName();
        logger.warn(
                "Redis cache {} failed for cache='{}', key='{}': {}",
                operation,
                cacheName,
                key,
                exception.getMessage()
        );
    }
}
