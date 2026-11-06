package com.staysmart.stay_smart.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class FrontendController {

    @GetMapping(value = {
        "/",
        "/admin",
        "/admin/{path:[^.]*}",
        "/products/{path:[^.]*}",
        "/products/{category}/{path:[^.]*}"
    })
    public String index() {
        return "forward:/index.html";
    }
}
