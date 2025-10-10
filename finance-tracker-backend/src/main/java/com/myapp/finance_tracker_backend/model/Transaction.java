package com.myapp.finance_tracker_backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import com.myapp.finance_tracker_backend.model.enums.Category;
import com.myapp.finance_tracker_backend.model.enums.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "user_transactions")
@Getter @Setter
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;
    private BigDecimal amount;
    private LocalDate date;

    @Enumerated(EnumType.STRING)
    private TransactionType type;

    @Enumerated(EnumType.STRING)
    private Category category;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @PrePersist
    public void prePersist() {
        this.date = LocalDate.now();
    }
}
