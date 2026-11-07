package com.staysmart.stay_smart.controller;

import com.staysmart.stay_smart.dto.UserLoginRequest;
import com.staysmart.stay_smart.dto.UserLoginResponse;
import com.staysmart.stay_smart.dto.UserRequest;
import com.staysmart.stay_smart.entity.UserEntity;
import com.staysmart.stay_smart.storage.DataStore;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:4200", "http://127.0.0.1:4200", "http://0.0.0.0:4200"}, allowCredentials = "true")
public class UserController {

    private final DataStore dataStore;

    public UserController(DataStore dataStore) {
        this.dataStore = dataStore;
    }

    @PostMapping("/register")
    public ResponseEntity<UserLoginResponse> register(@RequestBody UserRequest request) {
        if (request == null || request.getUserId() == null || request.getUserId().isBlank()) {
            return ResponseEntity.badRequest().body(new UserLoginResponse(false, "User ID is required.", null));
        }

        if (request.getPassword() == null || request.getPassword().isBlank()) {
            return ResponseEntity.badRequest().body(new UserLoginResponse(false, "Password is required.", null));
        }

        if (dataStore.findUserByUserId(request.getUserId()) != null) {
            return ResponseEntity.status(409).body(new UserLoginResponse(false, "This user ID is already registered.", null));
        }

        if (request.getUserEmail() != null && !request.getUserEmail().isBlank() && dataStore.findUserByEmail(request.getUserEmail()) != null) {
            return ResponseEntity.status(409).body(new UserLoginResponse(false, "This email is already in use.", null));
        }

        UserEntity user = new UserEntity(
                request.getUserName(),
                request.getUserEmail(),
                request.getPhone(),
                request.getAddress(),
                request.getUserId(),
                request.getPassword()
        );

        UserEntity saved = dataStore.saveUser(user);
        return ResponseEntity.ok(new UserLoginResponse(true, "Registration successful.", saved));
    }

    @PostMapping("/login")
    public ResponseEntity<UserLoginResponse> login(@RequestBody UserLoginRequest request) {
        if (request == null || request.getUserId() == null || request.getUserId().isBlank()) {
            return ResponseEntity.badRequest().body(new UserLoginResponse(false, "User ID is required.", null));
        }

        UserEntity user = dataStore.findUserByUserId(request.getUserId());
        if (user == null) {
            return ResponseEntity.status(401).body(new UserLoginResponse(false, "User not found.", null));
        }

        if (!request.getPassword().equals(user.getPassword())) {
            return ResponseEntity.status(401).body(new UserLoginResponse(false, "Incorrect password.", null));
        }

        return ResponseEntity.ok(new UserLoginResponse(true, "Login successful.", user));
    }

    @GetMapping("/me/{userId}")
    public ResponseEntity<UserEntity> getProfile(@PathVariable String userId) {
        UserEntity user = dataStore.findUserByUserId(userId);
        return user == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(user);
    }
}
