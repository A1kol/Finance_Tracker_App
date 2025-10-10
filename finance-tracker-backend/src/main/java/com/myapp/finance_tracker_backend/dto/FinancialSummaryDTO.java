package com.myapp.finance_tracker_backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Setter @Getter
public class FinancialSummaryDTO {
    private BigDecimal balance;
    private BigDecimal income;
    private BigDecimal expense;
}
