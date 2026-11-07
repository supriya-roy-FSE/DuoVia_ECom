package com.staysmart.stay_smart.storage;

import org.springframework.context.annotation.Configuration;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@Configuration
@EnableConfigurationProperties(GoogleSheetsProperties.class)
public class StorageConfig {
}
