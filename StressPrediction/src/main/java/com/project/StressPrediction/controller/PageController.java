package com.project.StressPrediction.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

    @GetMapping("/")
    public String index() {
        return "main1"; // Landing Page
    }

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    @GetMapping("/dashboard")
    public String dashboard() {
        return "dashboard";
    }

    @GetMapping("/prediction-form")
    public String predictionForm() {
        return "prediction-form";
    }

    @GetMapping("/dashboard.html")
    public String dashboardHtml() {
        return "redirect:/dashboard";
    }

    @GetMapping("/prediction-form.html")
    public String predictionFormHtml() {
        return "redirect:/prediction-form";
    }
}
