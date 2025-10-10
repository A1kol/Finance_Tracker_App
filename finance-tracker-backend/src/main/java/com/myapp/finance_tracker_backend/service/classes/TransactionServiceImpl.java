package com.myapp.finance_tracker_backend.service.classes;

import com.myapp.finance_tracker_backend.dto.FinancialSummaryDTO;
import com.myapp.finance_tracker_backend.dto.TransactionDTO;
import com.myapp.finance_tracker_backend.model.Transaction;
import com.myapp.finance_tracker_backend.model.User;
import com.myapp.finance_tracker_backend.model.enums.TransactionType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import com.myapp.finance_tracker_backend.repository.TransactionRepository;
import com.myapp.finance_tracker_backend.service.interfaces.TransactionService;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class TransactionServiceImpl implements TransactionService {
    private final TransactionRepository transactionRepository;

    @Autowired
    public TransactionServiceImpl(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public Transaction addTransaction(Transaction transaction, User user) {
        if(transaction == null) {
            return null;
        }

        transaction.setUser(user);

        if(transaction.getType() == TransactionType.EXPENSE) {
            BigDecimal currentBalance = transactionRepository.calculateTotalBalance(user.getId());

            if (currentBalance.compareTo(transaction.getAmount()) < 0) {
                return null;
            }
        }

            return transactionRepository.save(transaction);

    }

    @Transactional
    public boolean deleteTransaction(Long transactionId, User user) {
        Optional<Transaction> optionalTransaction = transactionRepository.findById(transactionId);

        if(optionalTransaction.isPresent() && optionalTransaction.get().getUser().getId().equals(user.getId())) {
            transactionRepository.deleteById(transactionId);
            return true;
        }
        return false;
    }

    public Page<TransactionDTO> getAllTransactionsForUser(User user, int page, int size) {
        Pageable pageable = PageRequest.of(page, size,  Sort.by(Sort.Direction.DESC, "date", "id"));
        Page<Transaction> pageResult = transactionRepository.findByUserWithUserEagerly(user, pageable);
        return pageResult.map(TransactionDTO::fromEntity);
    }

    public List<TransactionDTO> getLastTransactionsForUser(User user, int limit) {
        Pageable pageable = PageRequest.of(
                0,
                limit,
                Sort.by(Sort.Direction.DESC, "date")
        );

        List<Transaction> transactions = transactionRepository.findByUserWithUserEagerly(user, pageable).getContent();

        return transactions.stream().map(TransactionDTO::fromEntity).toList();
    }

    public FinancialSummaryDTO getFinanceSummary(User user) {
        BigDecimal income = transactionRepository.calculateTotalIncome(user.getId());
        BigDecimal expense = transactionRepository.calculateTotalExpense(user.getId());
        BigDecimal balance = income.subtract(expense);

        FinancialSummaryDTO summary = new FinancialSummaryDTO();
        summary.setIncome(income);
        summary.setExpense(expense);
        summary.setBalance(balance);

        return summary;
    }
}
