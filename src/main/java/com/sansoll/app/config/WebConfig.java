package com.sansoll.app.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private static final String UPLOAD_ROOT = "file:" + System.getProperty("user.dir") + "/uploads/";

    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/avatars/**")
                .addResourceLocations(UPLOAD_ROOT + "avatars/");

        registry.addResourceHandler("/uploads/products/**")
                .addResourceLocations(UPLOAD_ROOT + "products/");

        registry.addResourceHandler("/uploads/certificates/**")
                .addResourceLocations(UPLOAD_ROOT + "certificates/");
    }
}