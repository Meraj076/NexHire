package com.project.StressPrediction.model;

import java.util.List;

public class PredictionRequest {
    private int age;
    private List<Double> answers;

    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }

    public List<Double> getAnswers() { return answers; }
    public void setAnswers(List<Double> answers) { this.answers = answers; }
}
