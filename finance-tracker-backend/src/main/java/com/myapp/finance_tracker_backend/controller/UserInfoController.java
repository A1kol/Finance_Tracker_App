package com.myapp.finance_tracker_backend.controller;

import com.myapp.finance_tracker_backend.dto.FinancialSummaryDTO;
import com.myapp.finance_tracker_backend.model.User;
import com.myapp.finance_tracker_backend.service.classes.TransactionServiceImpl;
import com.myapp.finance_tracker_backend.service.classes.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/api/userInfo")
public class UserInfoController {

    private final TransactionServiceImpl transactionService;

    @Autowired
    public UserInfoController(TransactionServiceImpl transactionService) {
        this.transactionService = transactionService;
    }

    @GetMapping("/getName")
    public String getName(@AuthenticationPrincipal User user) {
        return user.getName();
    }

    @GetMapping("/getSummary")
    public FinancialSummaryDTO getFinancialSummaryForUser(@AuthenticationPrincipal User user) {
        return transactionService.getFinanceSummary(user);
    }
}
