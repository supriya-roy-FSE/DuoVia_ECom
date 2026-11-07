package com.staysmart.stay_smart.entity;

public class UserEntity {
    private Long id;
    private String userName;
    private String userEmail;
    private String phone;
    private String address;
    private String userId;
    private String password;
    private String status = "ACTIVE";

    public UserEntity() {
    }

    public UserEntity(String userName, String userEmail, String phone, String address, String userId, String password) {
        this.userName = userName;
        this.userEmail = userEmail;
        this.phone = phone;
        this.address = address;
        this.userId = userId;
        this.password = password;
        this.status = "ACTIVE";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
