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

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
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

            String credentialsJson = System.getenv("GOOGLE_CREDENTIALS_JSON");

            if (credentialsJson != null && !credentialsJson.isBlank()) {
                // Render environment

                try (InputStream inputStream = new ByteArrayInputStream(
                        credentialsJson.getBytes(StandardCharsets.UTF_8))) {

                    GoogleCredentials credentials = GoogleCredentials
                            .fromStream(inputStream)
                            .createScoped(
                                    Collections.singletonList(
                                            SheetsScopes.SPREADSHEETS));

                    return new Sheets.Builder(
                            GoogleNetHttpTransport.newTrustedTransport(),
                            GsonFactory.getDefaultInstance(),
                            new HttpCredentialsAdapter(credentials))
                            .setApplicationName("StaySmart")
                            .build();

                } catch (Exception e) {
                    throw new IllegalStateException(
                            "Failed to initialize Google Sheets service from Render", e);
                }
            } else {
                // Existing file path logic
                String credentialsLocation = resolveCredentialsLocation();
                if (credentialsLocation == null || credentialsLocation.isBlank()) {
                    throw new IllegalStateException("staysmart.google-sheet.credentials-file is missing");
                }

                Resource resource;
                if (credentialsLocation.startsWith("classpath:")) {
                    resource = new org.springframework.core.io.ClassPathResource(
                            credentialsLocation.substring("classpath:".length()));
                } else {
                    String normalized = credentialsLocation;
                    if (normalized.startsWith("file:")) {
                        resource = new UrlResource(java.net.URI.create(normalized).toURL());
                    } else {
                        resource = new UrlResource(new java.io.File(normalized).toURI().toURL());
                    }
                }

                try (InputStream inputStream = resource.getInputStream()) {
                    GoogleCredentials credentials = GoogleCredentials.fromStream(inputStream)
                            .createScoped(Collections.singletonList(SheetsScopes.SPREADSHEETS));

                    return new Sheets.Builder(
                            GoogleNetHttpTransport.newTrustedTransport(),
                            GsonFactory.getDefaultInstance(),
                            new HttpCredentialsAdapter(credentials)).setApplicationName("StaySmart").build();
                }
            }
        } catch (Exception e) {
            throw new IllegalStateException("Failed to initialize Google Sheets service with credentials file: "
                    + properties.getCredentialsFile(), e);
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
            "User_sk_seq",
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
            "photoUrl",
            "createdAt"
    };

    private static final String[] USER_COLUMNS = {
            "User_sk_seq",
            "User_Name",
            "User_Email",
            "Phone",
            "Address",
            "UserId",
            "Password",
            "Status",
            "Create_date"
    };

    private List<Object> buildOrderRow(OrderEntity order) {
        List<Object> row = new ArrayList<>(ORDER_COLUMNS.length);
        row.add(normalizeCellValue(order.getId()));
        row.add(normalizeCellValue(order.getUserSkSeq()));
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
        row.add(normalizeCellValue(feedback.getPhotoUrl()));
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
        row.add(normalizeCellValue(user.getCreateDate() == null ? java.time.LocalDateTime.now().toString() : user.getCreateDate()));
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

    private String parseStringCell(List<Object> row, int index) {
        if (row.size() <= index || row.get(index) == null) {
            return null;
        }
        String value = String.valueOf(row.get(index)).trim();
        return value.isBlank() ? null : value;
    }

    private Long parseLongCell(List<Object> row, int index) {
        String value = parseStringCell(row, index);
        if (value == null) {
            return null;
        }
        try {
            return Long.valueOf(value);
        } catch (NumberFormatException ex) {
            return null;
        }
    }

    private Integer parseIntegerCell(List<Object> row, int index) {
        String value = parseStringCell(row, index);
        if (value == null) {
            return null;
        }
        try {
            return Integer.valueOf(value);
        } catch (NumberFormatException ex) {
            return null;
        }
    }

    private BigDecimal parseBigDecimalCell(List<Object> row, int index) {
        String value = parseStringCell(row, index);
        if (value == null) {
            return null;
        }
        try {
            return new BigDecimal(value);
        } catch (NumberFormatException ex) {
            return null;
        }
    }

    private LocalDateTime parseDateTimeCell(List<Object> row, int index) {
        String value = parseStringCell(row, index);
        if (value == null) {
            return LocalDateTime.now();
        }
        try {
            return LocalDateTime.parse(value);
        } catch (Exception ex) {
            return LocalDateTime.now();
        }
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

        if (order.getUserSkSeq() == null && order.getUserId() != null && !order.getUserId().isBlank()) {
            UserEntity user = findUserByUserId(order.getUserId());
            if (user != null && user.getId() != null) {
                order.setUserSkSeq(user.getId());
            }
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
                order.setId(parseLongCell(row, 0));
                order.setUserSkSeq(parseLongCell(row, 1));
                order.setEmail(parseStringCell(row, 2));
                order.setPhone(parseStringCell(row, 3));
                order.setProductName(parseStringCell(row, 4));
                order.setQuantity(parseIntegerCell(row, 5));
                order.setTotalPrice(parseBigDecimalCell(row, 6));
                order.setStatus(parseStringCell(row, 7));
                order.setCreatedAt(parseDateTimeCell(row, 8));
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
                            item.getUserSkSeq(),
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
                    .append(properties.getSpreadsheetId(), properties.getFeedbackSheet() + "!A:G", new ValueRange().setValues(List.of(row)))
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
                    .get(properties.getSpreadsheetId(), properties.getFeedbackSheet() + "!A2:G")
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
                feedback.setPhotoUrl(row.size() > 5 && row.get(5) != null ? String.valueOf(row.get(5)) : null);

                String createdAt = row.size() > 6 && row.get(6) != null ? String.valueOf(row.get(6)) : null;
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
        if (user.getCreateDate() == null || user.getCreateDate().isBlank()) {
            user.setCreateDate(java.time.LocalDateTime.now().toString());
        }

        List<Object> row = buildUserRow(user);

        try {
            sheetsService.spreadsheets().values()
                    .append(properties.getSpreadsheetId(), properties.getUsersSheet() + "!A:I", new ValueRange().setValues(List.of(row)))
                    .setValueInputOption("USER_ENTERED")
                    .setInsertDataOption("INSERT_ROWS")
                    .execute();
        } catch (Exception e) {
            throw new IllegalStateException("Failed to save user to Google Sheets", e);
        }

        return user;
    }

    @Override
    public UserEntity findUserByUserSkSeq(Long userSkSeq) {
        if (userSkSeq == null) {
            return null;
        }

        return findAllUsers().stream()
                .filter(user -> user.getId() != null && userSkSeq.equals(user.getId()))
                .findFirst()
                .orElse(null);
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
                    .get(properties.getSpreadsheetId(), properties.getUsersSheet() + "!A2:I")
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
                user.setCreateDate(row.size() > 8 && row.get(8) != null ? String.valueOf(row.get(8)) : java.time.LocalDateTime.now().toString());
                users.add(user);
            }
            return users;
        } catch (Exception e) {
            throw new IllegalStateException("Failed to read users from Google Sheets", e);
        }
    }
}
