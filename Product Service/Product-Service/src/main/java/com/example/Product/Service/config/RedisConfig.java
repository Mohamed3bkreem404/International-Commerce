package com.example.Product.Service.config;

import org.springframework.boot.cache.autoconfigure.RedisCacheManagerBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;

import java.time.Duration;

@Configuration
public class RedisConfig {

    @Bean
    public RedisCacheManagerBuilderCustomizer redisCacheManagerBuilderCustomizer() {
        RedisCacheConfiguration baseConfig = RedisCacheConfiguration
                .defaultCacheConfig()
                .disableCachingNullValues()
                .computePrefixWith(cacheName -> "product-service::" + cacheName + "::")
                .serializeValuesWith(
                        RedisSerializationContext
                                .SerializationPair
                                .fromSerializer(new GenericJackson2JsonRedisSerializer())
                );

        return builder -> builder
                .cacheDefaults(baseConfig.entryTtl(Duration.ofMinutes(5)))
                .withCacheConfiguration(CacheNames.PRODUCTS_LIST, baseConfig.entryTtl(Duration.ofMinutes(2)))
                .withCacheConfiguration(CacheNames.PRODUCTS_BY_ID, baseConfig.entryTtl(Duration.ofMinutes(15)))
                .withCacheConfiguration(CacheNames.PRODUCTS_BY_NAME, baseConfig.entryTtl(Duration.ofMinutes(10)));
    }
}
