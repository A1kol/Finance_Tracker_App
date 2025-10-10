package com.myapp.finance_tracker_backend.controller;

import com.myapp.finance_tracker_backend.dto.TransactionDTO;
import com.myapp.finance_tracker_backend.model.Transaction;
import com.myapp.finance_tracker_backend.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.myapp.finance_tracker_backend.service.classes.TransactionServiceImpl;
import com.myapp.finance_tracker_backend.service.classes.UserServiceImpl;
import java.util.List;

@RestController
@RequestMapping("/api/user/transactions")
public class TransactionController {
    private final TransactionServiceImpl transactionService;
    private final UserServiceImpl userService;

    @Autowired
    public TransactionController(TransactionServiceImpl transactionService, UserServiceImpl userService) {
        this.transactionService = transactionService;
        this.userService = userService;
    }

    @PostMapping("/add")
    public ResponseEntity<Transaction> add(@RequestBody Transaction transaction, @AuthenticationPrincipal User user) {

        Transaction addedTransaction = transactionService.addTransaction(transaction, user);

        if(addedTransaction != null) {
            return ResponseEntity.ok(addedTransaction);
        } else return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).build();
    }

    @DeleteMapping("/{transactionId}")
    public ResponseEntity<Void> delete(@PathVariable Long transactionId, @AuthenticationPrincipal User user) {

        if (transactionService.deleteTransaction(transactionId, user)) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @GetMapping
    public ResponseEntity<Page<TransactionDTO>> getTransactions(@AuthenticationPrincipal User user, @RequestParam(defaultValue = "0") int page, @RequestParam int size) {

        Page<TransactionDTO> transactions = transactionService.getAllTransactionsForUser(user, page, size);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/latest")
    public ResponseEntity<List<TransactionDTO>> getLastTransactions(@AuthenticationPrincipal User user, @RequestParam(defaultValue = "4") int limit) {

        List<TransactionDTO> transactions = transactionService.getLastTransactionsForUser(user, limit);
        return ResponseEntity.ok(transactions);
    }

}
