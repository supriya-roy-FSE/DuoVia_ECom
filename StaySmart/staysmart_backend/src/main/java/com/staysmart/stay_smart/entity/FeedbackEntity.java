package com.staysmart.stay_smart.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "feedbacks")
public class FeedbackEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String customerName;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String message;

    @Column(nullable = false)
    private Integer rating;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public FeedbackEntity() {
        this.createdAt = LocalDateTime.now();
    }

    public FeedbackEntity(String customerName, String email, String message, Integer rating) {
        this.customerName = customerName;
        this.email = email;
        this.message = message;
        this.rating = rating;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
