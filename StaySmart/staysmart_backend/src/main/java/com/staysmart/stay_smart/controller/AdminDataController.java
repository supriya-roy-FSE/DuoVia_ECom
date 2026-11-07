package com.staysmart.stay_smart.controller;

import com.staysmart.stay_smart.dto.CheckoutResponse;
import com.staysmart.stay_smart.dto.FeedbackRequest;
import com.staysmart.stay_smart.dto.OrderRequest;
import com.staysmart.stay_smart.entity.FeedbackEntity;
import com.staysmart.stay_smart.entity.OrderEntity;
import com.staysmart.stay_smart.exception.CheckoutException;
import com.staysmart.stay_smart.storage.DataStore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class AdminDataController {

    private final DataStore dataStore;

    @Autowired
    public AdminDataController(DataStore dataStore) {
        this.dataStore = dataStore;
    }

    @PostMapping("/orders")
    public ResponseEntity<CheckoutResponse> createOrder(@RequestBody OrderRequest request) {
        if (request == null) {
            throw new CheckoutException("VALIDATION_FAILED", "Please provide valid order details.", "Request body was empty");
        }

        if (request.getCustomerName() == null || request.getCustomerName().isBlank() ||
                request.getEmail() == null || request.getEmail().isBlank() ||
                request.getPhone() == null || request.getPhone().isBlank()) {
            throw new CheckoutException("VALIDATION_FAILED", "Please complete your contact details before checkout.", "Missing required customer fields");
        }

        if (request.getProductName() == null || request.getProductName().isBlank()) {
            throw new CheckoutException("VALIDATION_FAILED", "Please select a valid product before checkout.", "Missing product name");
        }

        OrderEntity order = new OrderEntity(
                request.getCustomerName(),
                request.getEmail(),
                request.getPhone(),
                request.getProductName(),
                request.getQuantity() == null ? 1 : request.getQuantity(),
                request.getTotalPrice() == null ? java.math.BigDecimal.ZERO : request.getTotalPrice(),
                request.getStatus() == null ? "PENDING" : request.getStatus()
        );

        try {
            OrderEntity saved = dataStore.saveOrder(order);
            String orderId = saved.getId() == null ? "ORD-UNKNOWN" : String.valueOf(saved.getId());
            return ResponseEntity.ok(new CheckoutResponse(
                    true,
                    orderId,
                    "Order placed successfully.",
                    null,
                    null
            ));
        } catch (Exception ex) {
            String rootCause = ex.getMessage() == null ? "Unknown storage error" : ex.getMessage();
            if (rootCause.contains("404") || rootCause.contains("not found")) {
                throw new CheckoutException("GOOGLE_SHEETS_404", "We could not place your order right now. Please try again later.", "Spreadsheet or sheet not found or not shared with service account");
            }
            if (rootCause.contains("401") || rootCause.contains("403") || rootCause.contains("authentication") || rootCause.contains("credentials")) {
                throw new CheckoutException("GOOGLE_AUTH_FAILED", "We could not place your order right now. Please try again later.", "Google authentication or service account access issue");
            }
            throw new CheckoutException("CHECKOUT_FAILED", "We could not place your order right now. Please try again later.", rootCause);
        }
    }

    @GetMapping("/orders")
    public ResponseEntity<List<OrderEntity>> getOrders() {
        return ResponseEntity.ok(dataStore.findAllOrders());
    }

    @GetMapping("/orders/{id}")
    public ResponseEntity<OrderEntity> getOrderById(@PathVariable Long id) {
        OrderEntity order = dataStore.findOrderById(id);
        return order == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(order);
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<OrderEntity> updateOrderStatus(@PathVariable Long id, @RequestParam String status) {
        OrderEntity updated = dataStore.updateOrderStatus(id, status);
        return updated == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(updated);
    }

    @PostMapping("/feedback")
    public ResponseEntity<FeedbackEntity> createFeedback(@RequestBody FeedbackRequest request) {
        FeedbackEntity feedback = new FeedbackEntity(
                request.getCustomerName(),
                request.getEmail(),
                request.getMessage(),
                request.getRating()
        );

        FeedbackEntity saved = dataStore.saveFeedback(feedback);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/feedback")
    public ResponseEntity<List<FeedbackEntity>> getFeedbacks() {
        return ResponseEntity.ok(dataStore.findAllFeedback());
    }
}
