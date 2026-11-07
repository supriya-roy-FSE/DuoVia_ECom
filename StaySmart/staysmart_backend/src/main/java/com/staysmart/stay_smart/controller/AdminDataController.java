package com.staysmart.stay_smart.controller;

import com.staysmart.stay_smart.dto.FeedbackRequest;
import com.staysmart.stay_smart.dto.OrderRequest;
import com.staysmart.stay_smart.entity.FeedbackEntity;
import com.staysmart.stay_smart.entity.OrderEntity;
import com.staysmart.stay_smart.repository.FeedbackRepository;
import com.staysmart.stay_smart.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class AdminDataController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private FeedbackRepository feedbackRepository;

    @PostMapping("/orders")
    public ResponseEntity<OrderEntity> createOrder(@RequestBody OrderRequest request) {
        OrderEntity order = new OrderEntity(
                request.getCustomerName(),
                request.getEmail(),
                request.getPhone(),
                request.getProductName(),
                request.getQuantity(),
                request.getTotalPrice(),
                request.getStatus() == null ? "PENDING" : request.getStatus()
        );

        OrderEntity saved = orderRepository.save(order);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/orders")
    public ResponseEntity<List<OrderEntity>> getOrders() {
        return ResponseEntity.ok(orderRepository.findAll());
    }

    @PostMapping("/feedback")
    public ResponseEntity<FeedbackEntity> createFeedback(@RequestBody FeedbackRequest request) {
        FeedbackEntity feedback = new FeedbackEntity(
                request.getCustomerName(),
                request.getEmail(),
                request.getMessage(),
                request.getRating()
        );

        FeedbackEntity saved = feedbackRepository.save(feedback);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/feedback")
    public ResponseEntity<List<FeedbackEntity>> getFeedbacks() {
        return ResponseEntity.ok(feedbackRepository.findAll());
    }
}
