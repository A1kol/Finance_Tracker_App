package com.myapp.finance_tracker_backend.service.interfaces;

import com.myapp.finance_tracker_backend.dto.TransactionDTO;
import com.myapp.finance_tracker_backend.model.Transaction;
import com.myapp.finance_tracker_backend.model.User;
import org.springframework.data.domain.Page;

import java.util.List;

public interface TransactionService {
    Transaction addTransaction(Transaction transaction, User user);
    boolean deleteTransaction(Long transactionId, User user);
    Page<TransactionDTO> getAllTransactionsForUser(User user, int page, int size);

}
