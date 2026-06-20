package com.project.StressPrediction.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class CopingController {

    @GetMapping("/coping-strategies")
    public String copingStrategies() {
        return "coping-strategies";
    }
}
