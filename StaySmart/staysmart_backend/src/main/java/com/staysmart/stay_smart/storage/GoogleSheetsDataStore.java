package com.staysmart.stay_smart.storage;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.sheets.v4.Sheets;
import com.google.api.services.sheets.v4.SheetsScopes;
import com.google.api.services.sheets.v4.model.ValueRange;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.GoogleCredentials;
import com.staysmart.stay_smart.entity.FeedbackEntity;
import com.staysmart.stay_smart.entity.OrderEntity;
import com.staysmart.stay_smart.entity.UserEntity;
import org.springframework.context.annotation.Primary;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Repository;

import java.io.InputStream;
import java.math.BigDecimal;
import java.net.URL;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Repository
@Primary
public class GoogleSheetsDataStore implements DataStore {

    private final GoogleSheetsProperties properties;
    private final Sheets sheetsService;

    public GoogleSheetsDataStore(GoogleSheetsProperties properties) {
        this.properties = properties;
        this.sheetsService = createSheetsService();
    }

    private Sheets createSheetsService() {
        try {
            String credentialsLocation = resolveCredentialsLocation();
            if (credentialsLocation == null || credentialsLocation.isBlank()) {
                throw new IllegalStateException("staysmart.google-sheet.credentials-file is missing");
            }

            Resource resource;
            if (credentialsLocation.startsWith("classpath:")) {
                resource = new org.springframework.core.io.ClassPathResource(credentialsLocation.substring("classpath:".length()));
            } else {
                String normalized = credentialsLocation;
                if (normalized.startsWith("file:")) {
                    resource = new UrlResource(new URL(normalized));
                } else {
                    resource = new UrlResource(new URL("file:" + normalized));
                }
            }

            try (InputStream inputStream = resource.getInputStream()) {
                GoogleCredentials credentials = GoogleCredentials.fromStream(inputStream)
                        .createScoped(Collections.singletonList(SheetsScopes.SPREADSHEETS));

                return new Sheets.Builder(
                        GoogleNetHttpTransport.newTrustedTransport(),
                        GsonFactory.getDefaultInstance(),
                        new HttpCredentialsAdapter(credentials)
                ).setApplicationName("StaySmart").build();
            }
        } catch (Exception e) {
            throw new IllegalStateException("Failed to initialize Google Sheets service with credentials file: " + properties.getCredentialsFile(), e);
        }
    }

    private String resolveCredentialsLocation() {
        String configured = properties.getCredentialsFile();
        if (configured != null && !configured.isBlank()) {
            return configured;
        }

        String envPath = System.getenv("GOOGLE_APPLICATION_CREDENTIALS");
        if (envPath != null && !envPath.isBlank()) {
            return envPath;
        }

        String systemProp = System.getProperty("GOOGLE_APPLICATION_CREDENTIALS");
        if (systemProp != null && !systemProp.isBlank()) {
            return systemProp;
        }

        return null;
    }

    private static final String[] ORDER_COLUMNS = {
            "id",
            "customerName",
            "email",
            "phone",
            "productName",
            "quantity",
            "totalPrice",
            "status",
            "createdAt"
    };

    private static final String[] FEEDBACK_COLUMNS = {
            "id",
            "customerName",
            "email",
            "message",
            "rating",
            "createdAt"
    };

    private static final String[] USER_COLUMNS = {
            "id",
            "User_Name",
            "User_Email",
            "Phone",
            "Address",
            "UserId",
            "Password",
            "Status"
    };

    private List<Object> buildOrderRow(OrderEntity order) {
        List<Object> row = new ArrayList<>(ORDER_COLUMNS.length);
        row.add(normalizeCellValue(order.getId()));
        row.add(normalizeCellValue(order.getCustomerName()));
        row.add(normalizeCellValue(order.getEmail()));
        row.add(normalizeCellValue(order.getPhone()));
        row.add(normalizeCellValue(order.getProductName()));
        row.add(normalizeCellValue(order.getQuantity()));
        row.add(normalizeCellValue(order.getTotalPrice() == null ? null : order.getTotalPrice().toPlainString()));
        row.add(normalizeCellValue(order.getStatus()));
        row.add(normalizeCellValue(order.getCreatedAt() == null ? null : order.getCreatedAt().toString()));
        return row;
    }

    private List<Object> buildFeedbackRow(FeedbackEntity feedback) {
        List<Object> row = new ArrayList<>(FEEDBACK_COLUMNS.length);
        row.add(normalizeCellValue(feedback.getId()));
        row.add(normalizeCellValue(feedback.getCustomerName()));
        row.add(normalizeCellValue(feedback.getEmail()));
        row.add(normalizeCellValue(feedback.getMessage()));
        row.add(normalizeCellValue(feedback.getRating()));
        row.add(normalizeCellValue(feedback.getCreatedAt() == null ? null : feedback.getCreatedAt().toString()));
        return row;
    }

    private List<Object> buildUserRow(UserEntity user) {
        List<Object> row = new ArrayList<>(USER_COLUMNS.length);
        row.add(normalizeCellValue(user.getId()));
        row.add(normalizeCellValue(user.getUserName()));
        row.add(normalizeCellValue(user.getUserEmail()));
        row.add(normalizeCellValue(user.getPhone()));
        row.add(normalizeCellValue(user.getAddress()));
        row.add(normalizeCellValue(user.getUserId()));
        row.add(normalizeCellValue(user.getPassword()));
        row.add(normalizeCellValue(user.getStatus() == null ? "ACTIVE" : user.getStatus()));
        return row;
    }

    private Object normalizeCellValue(Object value) {
        if (value == null) {
            return "";
        }

        String text = String.valueOf(value).trim();
        if (text.startsWith("=")) {
            text = "'" + text;
        }
        return text;
    }

    @Override
    public OrderEntity saveOrder(OrderEntity order) {
        if (order.getId() == null) {
            order.setId(System.currentTimeMillis());
        }
        if (order.getStatus() == null || order.getStatus().isBlank()) {
            order.setStatus("PENDING");
        }
        if (order.getCreatedAt() == null) {
            order.setCreatedAt(LocalDateTime.now());
        }

        List<Object> row = buildOrderRow(order);

        try {
            sheetsService.spreadsheets().values()
                    .append(properties.getSpreadsheetId(), properties.getOrdersSheet() + "!A:I", new ValueRange().setValues(List.of(row)))
                    .setValueInputOption("USER_ENTERED")
                    .setInsertDataOption("INSERT_ROWS")
                    .execute();
        } catch (Exception e) {
            throw new IllegalStateException("Failed to save order to Google Sheets", e);
        }

        return order;
    }

    @Override
    public List<OrderEntity> findAllOrders() {
        try {
            ValueRange response = sheetsService.spreadsheets().values()
                    .get(properties.getSpreadsheetId(), properties.getOrdersSheet() + "!A2:I")
                    .execute();

            List<OrderEntity> orders = new ArrayList<>();
            List<List<Object>> rows = response.getValues();
            if (rows == null) {
                return orders;
            }

            for (List<Object> row : rows) {
                if (row == null || row.isEmpty()) continue;
                OrderEntity order = new OrderEntity();
                order.setId(row.size() > 0 && row.get(0) != null ? Long.valueOf(String.valueOf(row.get(0))) : null);
                order.setCustomerName(row.size() > 1 && row.get(1) != null ? String.valueOf(row.get(1)) : null);
                order.setEmail(row.size() > 2 && row.get(2) != null ? String.valueOf(row.get(2)) : null);
                order.setPhone(row.size() > 3 && row.get(3) != null ? String.valueOf(row.get(3)) : null);
                order.setProductName(row.size() > 4 && row.get(4) != null ? String.valueOf(row.get(4)) : null);
                order.setQuantity(row.size() > 5 && row.get(5) != null ? Integer.valueOf(String.valueOf(row.get(5))) : null);
                order.setTotalPrice(row.size() > 6 && row.get(6) != null ? new BigDecimal(String.valueOf(row.get(6))) : null);
                order.setStatus(row.size() > 7 && row.get(7) != null ? String.valueOf(row.get(7)) : null);

                String createdAt = row.size() > 8 && row.get(8) != null ? String.valueOf(row.get(8)) : null;
                order.setCreatedAt(createdAt != null ? LocalDateTime.parse(createdAt) : LocalDateTime.now());
                orders.add(order);
            }
            return orders;
        } catch (Exception e) {
            throw new IllegalStateException("Failed to read orders from Google Sheets", e);
        }
    }

    @Override
    public OrderEntity findOrderById(Long id) {
        return findAllOrders().stream()
                .filter(order -> id.equals(order.getId()))
                .findFirst()
                .orElse(null);
    }

    @Override
    public OrderEntity updateOrderStatus(Long id, String status) {
        List<OrderEntity> orders = findAllOrders();
        for (OrderEntity order : orders) {
            if (id.equals(order.getId())) {
                order.setStatus(status);
                List<List<Object>> rows = new ArrayList<>();
                for (OrderEntity item : orders) {
                    rows.add(List.of(
                            item.getId(),
                            item.getCustomerName(),
                            item.getEmail(),
                            item.getPhone(),
                            item.getProductName(),
                            item.getQuantity(),
                            item.getTotalPrice(),
                            item.getStatus(),
                            item.getCreatedAt().toString()
                    ));
                }

                try {
                    sheetsService.spreadsheets().values()
                            .update(properties.getSpreadsheetId(), properties.getOrdersSheet() + "!A2:I", new ValueRange().setValues(rows))
                            .setValueInputOption("USER_ENTERED")
                            .execute();
                    return order;
                } catch (Exception e) {
                    throw new IllegalStateException("Failed to update order status in Google Sheets", e);
                }
            }
        }
        return null;
    }

    @Override
    public FeedbackEntity saveFeedback(FeedbackEntity feedback) {
        if (feedback.getId() == null) {
            feedback.setId(System.currentTimeMillis());
        }
        if (feedback.getCreatedAt() == null) {
            feedback.setCreatedAt(LocalDateTime.now());
        }

        List<Object> row = buildFeedbackRow(feedback);

        try {
            sheetsService.spreadsheets().values()
                    .append(properties.getSpreadsheetId(), properties.getFeedbackSheet() + "!A:F", new ValueRange().setValues(List.of(row)))
                    .setValueInputOption("USER_ENTERED")
                    .setInsertDataOption("INSERT_ROWS")
                    .execute();
        } catch (Exception e) {
            throw new IllegalStateException("Failed to save feedback to Google Sheets", e);
        }

        return feedback;
    }

    @Override
    public List<FeedbackEntity> findAllFeedback() {
        try {
            ValueRange response = sheetsService.spreadsheets().values()
                    .get(properties.getSpreadsheetId(), properties.getFeedbackSheet() + "!A2:F")
                    .execute();

            List<FeedbackEntity> feedbacks = new ArrayList<>();
            List<List<Object>> rows = response.getValues();
            if (rows == null) {
                return feedbacks;
            }

            for (List<Object> row : rows) {
                if (row == null || row.isEmpty()) continue;
                FeedbackEntity feedback = new FeedbackEntity();
                feedback.setId(row.size() > 0 && row.get(0) != null ? Long.valueOf(String.valueOf(row.get(0))) : null);
                feedback.setCustomerName(row.size() > 1 && row.get(1) != null ? String.valueOf(row.get(1)) : null);
                feedback.setEmail(row.size() > 2 && row.get(2) != null ? String.valueOf(row.get(2)) : null);
                feedback.setMessage(row.size() > 3 && row.get(3) != null ? String.valueOf(row.get(3)) : null);
                feedback.setRating(row.size() > 4 && row.get(4) != null ? Integer.valueOf(String.valueOf(row.get(4))) : null);

                String createdAt = row.size() > 5 && row.get(5) != null ? String.valueOf(row.get(5)) : null;
                feedback.setCreatedAt(createdAt != null ? LocalDateTime.parse(createdAt) : LocalDateTime.now());
                feedbacks.add(feedback);
            }
            return feedbacks;
        } catch (Exception e) {
            throw new IllegalStateException("Failed to read feedback from Google Sheets", e);
        }
    }

    @Override
    public UserEntity saveUser(UserEntity user) {
        if (user.getId() == null) {
            user.setId(System.currentTimeMillis());
        }
        if (user.getStatus() == null || user.getStatus().isBlank()) {
            user.setStatus("ACTIVE");
        }

        List<Object> row = buildUserRow(user);

        try {
            sheetsService.spreadsheets().values()
                    .append(properties.getSpreadsheetId(), properties.getUsersSheet() + "!A:H", new ValueRange().setValues(List.of(row)))
                    .setValueInputOption("USER_ENTERED")
                    .setInsertDataOption("INSERT_ROWS")
                    .execute();
        } catch (Exception e) {
            throw new IllegalStateException("Failed to save user to Google Sheets", e);
        }

        return user;
    }

    @Override
    public UserEntity findUserByUserId(String userId) {
        if (userId == null || userId.isBlank()) {
            return null;
        }

        return findAllUsers().stream()
                .filter(user -> userId.equalsIgnoreCase(user.getUserId()))
                .findFirst()
                .orElse(null);
    }

    @Override
    public UserEntity findUserByEmail(String email) {
        if (email == null || email.isBlank()) {
            return null;
        }

        return findAllUsers().stream()
                .filter(user -> email.equalsIgnoreCase(user.getUserEmail()))
                .findFirst()
                .orElse(null);
    }

    @Override
    public List<UserEntity> findAllUsers() {
        try {
            ValueRange response = sheetsService.spreadsheets().values()
                    .get(properties.getSpreadsheetId(), properties.getUsersSheet() + "!A2:H")
                    .execute();

            List<UserEntity> users = new ArrayList<>();
            List<List<Object>> rows = response.getValues();
            if (rows == null) {
                return users;
            }

            for (List<Object> row : rows) {
                if (row == null || row.isEmpty()) continue;
                UserEntity user = new UserEntity();
                user.setId(row.size() > 0 && row.get(0) != null ? Long.valueOf(String.valueOf(row.get(0))) : null);
                user.setUserName(row.size() > 1 && row.get(1) != null ? String.valueOf(row.get(1)) : null);
                user.setUserEmail(row.size() > 2 && row.get(2) != null ? String.valueOf(row.get(2)) : null);
                user.setPhone(row.size() > 3 && row.get(3) != null ? String.valueOf(row.get(3)) : null);
                user.setAddress(row.size() > 4 && row.get(4) != null ? String.valueOf(row.get(4)) : null);
                user.setUserId(row.size() > 5 && row.get(5) != null ? String.valueOf(row.get(5)) : null);
                user.setPassword(row.size() > 6 && row.get(6) != null ? String.valueOf(row.get(6)) : null);
                user.setStatus(row.size() > 7 && row.get(7) != null ? String.valueOf(row.get(7)) : "ACTIVE");
                users.add(user);
            }
            return users;
        } catch (Exception e) {
            throw new IllegalStateException("Failed to read users from Google Sheets", e);
        }
    }
}
