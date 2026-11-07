package com.staysmart.stay_smart.storage;

import com.staysmart.stay_smart.entity.FeedbackEntity;
import com.staysmart.stay_smart.entity.OrderEntity;
import com.staysmart.stay_smart.entity.UserEntity;
import com.staysmart.stay_smart.repository.FeedbackRepository;
import com.staysmart.stay_smart.repository.OrderRepository;

import java.util.List;

// Intentionally not a Spring bean. The application is configured to use Google Sheets as the source of truth.
public class DatabaseDataStore implements DataStore {

    private final OrderRepository orderRepository;
    private final FeedbackRepository feedbackRepository;

    public DatabaseDataStore(OrderRepository orderRepository, FeedbackRepository feedbackRepository) {
        this.orderRepository = orderRepository;
        this.feedbackRepository = feedbackRepository;
    }

    @Override
    public OrderEntity saveOrder(OrderEntity order) {
        return orderRepository.save(order);
    }

    @Override
    public List<OrderEntity> findAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public OrderEntity findOrderById(Long id) {
        return orderRepository.findById(id).orElse(null);
    }

    @Override
    public OrderEntity updateOrderStatus(Long id, String status) {
        OrderEntity order = orderRepository.findById(id).orElse(null);
        if (order == null) {
            return null;
        }
        order.setStatus(status);
        return orderRepository.save(order);
    }

    @Override
    public FeedbackEntity saveFeedback(FeedbackEntity feedback) {
        return feedbackRepository.save(feedback);
    }

    @Override
    public List<FeedbackEntity> findAllFeedback() {
        return feedbackRepository.findAll();
    }

    @Override
    public UserEntity saveUser(UserEntity user) {
        throw new UnsupportedOperationException("DatabaseDataStore is intentionally disabled; user records are handled by Google Sheets.");
    }

    @Override
    public UserEntity findUserByUserId(String userId) {
        return null;
    }

    @Override
    public UserEntity findUserByEmail(String email) {
        return null;
    }

    @Override
    public List<UserEntity> findAllUsers() {
        return List.of();
    }
}
