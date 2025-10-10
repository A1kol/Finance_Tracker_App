package com.myapp.finance_tracker_backend.dto;

import com.myapp.finance_tracker_backend.model.Transaction;
import com.myapp.finance_tracker_backend.model.enums.Category;
import com.myapp.finance_tracker_backend.model.enums.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionDTO {
        private Long id;
        private String description;
        private BigDecimal amount;
        private LocalDate date;
        private TransactionType type;
        private Category category;

        public static TransactionDTO fromEntity(Transaction transaction) {
            TransactionDTO transactionDTO = new TransactionDTO();

            transactionDTO.setId(transaction.getId());
            transactionDTO.setDescription(transaction.getDescription());
            transactionDTO.setAmount(transaction.getAmount());
            transactionDTO.setDate(transaction.getDate());
            transactionDTO.setType(transaction.getType());
            transactionDTO.setCategory(transaction.getCategory());

            return transactionDTO;
        }
}
