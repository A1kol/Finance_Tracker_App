package com.myapp.finance_tracker_backend.repository;

import com.myapp.finance_tracker_backend.model.Transaction;
import com.myapp.finance_tracker_backend.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    @Query("SELECT COALESCE(SUM(CASE WHEN t.type = 'INCOME' THEN t.amount ELSE -t.amount END), 0) FROM Transaction t WHERE t.user.id = :userId")
    BigDecimal calculateTotalBalance(@Param("userId") Long userid);

    // ✅ НОВЫЕ АГРЕГАЦИИ
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.user.id = :userId AND t.type = 'INCOME'")
    BigDecimal calculateTotalIncome(@Param("userId") Long userId);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.user.id = :userId AND t.type = 'EXPENSE'")
    BigDecimal calculateTotalExpense(@Param("userId") Long userId);


    List<Transaction> findByUser(User user);

    @Query("SELECT t FROM Transaction t JOIN FETCH t.user WHERE t.user = :user")
    Page<Transaction> findByUserWithUserEagerly(@Param("user") User user, Pageable pageable);

}
