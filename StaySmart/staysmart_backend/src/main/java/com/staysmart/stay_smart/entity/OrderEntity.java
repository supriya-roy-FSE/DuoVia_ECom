package com.staysmart.stay_smart.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
public class OrderEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = true)
    private Long userSkSeq;

    @Column(nullable = true)
    private String userId;

    @Column(nullable = true)
    private String customerName;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private String productName;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal totalPrice;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public OrderEntity() {
        this.createdAt = LocalDateTime.now();
    }

    public OrderEntity(Long userSkSeq, String userId, String customerName, String email, String phone,
                      String productName, Integer quantity, BigDecimal totalPrice, String status) {
        this.userSkSeq = userSkSeq;
        this.userId = userId;
        this.customerName = customerName;
        this.email = email;
        this.phone = phone;
        this.productName = productName;
        this.quantity = quantity;
        this.totalPrice = totalPrice;
        this.status = status;
        this.createdAt = LocalDateTime.now();
    }

    public OrderEntity(String userId, String customerName, String email, String phone, String productName,
                      Integer quantity, BigDecimal totalPrice, String status) {
        this(null, userId, customerName, email, phone, productName, quantity, totalPrice, status);
    }

    public OrderEntity(String customerName, String email, String phone, String productName,
                      Integer quantity, BigDecimal totalPrice, String status) {
        this(null, null, customerName, email, phone, productName, quantity, totalPrice, status);
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserSkSeq() { return userSkSeq; }
    public void setUserSkSeq(Long userSkSeq) { this.userSkSeq = userSkSeq; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public BigDecimal getTotalPrice() { return totalPrice; }
    public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
