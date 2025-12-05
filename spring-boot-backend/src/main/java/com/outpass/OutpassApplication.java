package com.outpass;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.context.annotation.Bean;

/**
 * Main Spring Boot Application class for Outpass system.
 * This application manages student outpass requests with MongoDB backend.
 */
@SpringBootApplication
public class OutpassApplication {

    public static void main(String[] args) {
        SpringApplication.run(OutpassApplication.class, args);
    }

    /**
     * Configure CORS (Cross-Origin Resource Sharing) for frontend communication.
     * This allows the frontend to make requests from different origins.
     */
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins("http://localhost:3000", "http://localhost:8080")
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true)
                    .maxAge(3600);
            }
        };
    }
}
