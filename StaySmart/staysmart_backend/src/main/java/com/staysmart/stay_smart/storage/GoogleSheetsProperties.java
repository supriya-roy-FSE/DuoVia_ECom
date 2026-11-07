package com.staysmart.stay_smart.storage;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "staysmart.google-sheet")
public class GoogleSheetsProperties {
    private String spreadsheetId;
    private String credentialsFile;
    private String ordersSheet = "Order";
    private String feedbackSheet = "Feedback";
    private String usersSheet = "User";

    public String getSpreadsheetId() {
        return spreadsheetId;
    }

    public void setSpreadsheetId(String spreadsheetId) {
        this.spreadsheetId = spreadsheetId;
    }

    public String getCredentialsFile() {
        return credentialsFile;
    }

    public void setCredentialsFile(String credentialsFile) {
        this.credentialsFile = credentialsFile;
    }

    public String getOrdersSheet() {
        return ordersSheet;
    }

    public void setOrdersSheet(String ordersSheet) {
        this.ordersSheet = ordersSheet;
    }

    public String getFeedbackSheet() {
        return feedbackSheet;
    }

    public void setFeedbackSheet(String feedbackSheet) {
        this.feedbackSheet = feedbackSheet;
    }

    public String getUsersSheet() {
        return usersSheet;
    }

    public void setUsersSheet(String usersSheet) {
        this.usersSheet = usersSheet;
    }
}
