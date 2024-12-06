package com.fpoly.config;


import com.cloudinary.Cloudinary;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
@SpringBootApplication
public class CloudConfig {

    @Bean
    public Cloudinary cloudinaryConfigs() {
        Cloudinary cloudinary = null;
        Map config = new HashMap();
        config.put("cloud_name", "drw7rw0op");
        config.put("api_key", "192921413145527");
        config.put("api_secret", "VAgJUMtLTjbCeEKbuv_9Wi_YWXg");
        cloudinary = new Cloudinary(config);
        return cloudinary;
    }

}
