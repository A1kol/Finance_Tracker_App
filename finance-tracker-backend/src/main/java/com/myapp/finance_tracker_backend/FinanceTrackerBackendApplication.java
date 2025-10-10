package com.myapp.finance_tracker_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class FinanceTrackerBackendApplication {

	public static void main(String[] args) {
        System.out.println("✅ Сервер запустился");
        SpringApplication.run(FinanceTrackerBackendApplication.class, args);
	}
}
