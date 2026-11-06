package com.staysmart.stay_smart.controller;

import com.staysmart.stay_smart.dto.AdminLoginRequest;
import com.staysmart.stay_smart.dto.AdminLoginResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:4200")
public class AdminController {

    @PostMapping("/login")
    public ResponseEntity<AdminLoginResponse> login(@RequestBody AdminLoginRequest request) {
        if ("aDmIn".equals(request.getUsername()) && "AdMiN".equals(request.getPassword())) {
            return ResponseEntity.ok(new AdminLoginResponse(true, "Login successful", "/admin/dashboard"));
        }

        return ResponseEntity.status(401).body(new AdminLoginResponse(false, "Invalid credentials", null));
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Admin API is running");
    }
}
