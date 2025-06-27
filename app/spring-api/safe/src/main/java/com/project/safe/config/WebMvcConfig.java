// 📁 com/project/safe/config/WebMvcConfig.java

package com.project.safe.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
@Override
public void addViewControllers(ViewControllerRegistry registry) {
    registry.addViewController("/").setViewName("forward:/index.html");

    // api, assets, index.html 이외의 모든 경로를 SPA로 포워딩
    registry.addViewController("/{path:^(?!api|assets|index\\.html$).*$}")
            .setViewName("forward:/index.html");
}
}
