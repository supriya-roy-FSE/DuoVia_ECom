package com.staysmart.stay_smart.storage;

import com.staysmart.stay_smart.entity.FeedbackEntity;
import com.staysmart.stay_smart.entity.OrderEntity;
import com.staysmart.stay_smart.entity.UserEntity;

import java.util.List;

public interface DataStore {
    OrderEntity saveOrder(OrderEntity order);
    List<OrderEntity> findAllOrders();
    OrderEntity findOrderById(Long id);
    OrderEntity updateOrderStatus(Long id, String status);

    FeedbackEntity saveFeedback(FeedbackEntity feedback);
    List<FeedbackEntity> findAllFeedback();

    UserEntity saveUser(UserEntity user);
    UserEntity findUserByUserSkSeq(Long userSkSeq);
    UserEntity findUserByUserId(String userId);
    UserEntity findUserByEmail(String email);
    List<UserEntity> findAllUsers();
}
