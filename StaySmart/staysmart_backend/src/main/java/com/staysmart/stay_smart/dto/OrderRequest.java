package com.staysmart.stay_smart.dto;

import java.math.BigDecimal;

public class OrderRequest {
    private Long userSkSeq;
    private String userId;
    private String customerName;
    private String email;
    private String phone;
    private String productName;
    private Integer quantity;
    private BigDecimal totalPrice;
    private String status;

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
}
