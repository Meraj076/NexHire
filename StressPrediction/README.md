# StressOMeter - Stress Prediction & Management System

## Overview

**StressOMeter** is a comprehensive web-based application designed to predict stress levels based on user lifestyle data (sleep, activity, heart rate variability) and provide personalized coping strategies. It features a modern, responsive UI with a space-themed aesthetic to promote calmness.

## Functionality

### 1. User Authentication

- **Sign Up / Login**: Secure user registration and authentication flow.
- **Automatic Login**: Seamless transition from sign-up to dashboard.
- **Guest Access**: (Removed for production focus) Users are encouraged to create accounts to save history.

### 2. Dashboard

- **Stress Prediction**: Users input their parameters (Sleep Hours, Physical Activity, POV/Mood, Medical History, Diet).
- **Computational Model**: The backend uses a logic-based algorithm (mocking an AI model for this version) to calculate a "Stress Score" (0-10) and identify the "Root Cause" (e.g., Lack of Sleep, High Physical Stress).
- **Dynamic UI**: Real-time updates of the stress score, visual progress bars, and historical charts.
- **History Tracking**: Saves previous predictions to view trends over time.

### 3. Coping Strategies

- **Personalized Tips**: Based on the calculated root cause, the system suggests specific actions (e.g., "Deep Breathing" for high anxiety, "Sleep Hygiene" for sleep deprivation).
- **Interactive Tools**: (Future Roadmap) Guided breathing exercises and meditation timer placeholders.

### 4. Application Flow

- **Landing Page (`main1.html`)**: A promotional page explaining the science and features.
- **Login (`login.html`)**: Entry point for authentication.
- **Dashboard (`dashboard.html`)**: The central hub for all user interactions.

## Mechanisms & Architecture

### Backend (Spring Boot)

- **Controller Layer**:
  - `PageController`: Handles HTML page serving and routing (e.g., `/`, `/dashboard`, `/login`).
  - `PredictionController`: exposes REST APIs (`/api/predict`, `/api/history`) for frontend consumption.
- **Service Layer**:
  - `PredictionService`: Contains the core logic for stress calculation. It currently uses a rule-based heuristic model to simulate prediction outputs based on weighted inputs.
- **Data Persistence**:
  - Uses an in-memory or H2 database structure (configurable) to store user profiles and history during the session.

### Frontend

- **HTML5 & CSS3**: Custom-built responsive design using Flexbox/Grid.
- **Styling**:
  - **Variables**: Extensive use of CSS variables for theming (Colors: `#0E0429` (Deep Space), `#8b5cf6` (Accent Violet)).
  - **Glassmorphism**: Translucent card effects using `backdrop-filter: blur()`.
  - **Responsive**: Mobile-first media queries to ensure layout adapts from desktops to smartphones.
- **JavaScript (Vanilla)**:
  - `dashboard.js`: Handles API calls (Fetch API), DOM manipulation for updating scores/charts, and Sidebar toggling.
  - `charts.js`: Renders the "Stress History" chart using `Chart.js`.

## Setup & Running

### Prerequisites

- Java JDK 17+
- Maven

### Installation

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    ```
2.  **Navigate to directory**:
    ```bash
    cd StressPrediction
    ```
3.  **Run the application**:
    ```bash
    ./mvnw spring-boot:run
    ```

### Access

- **URL**: Open your browser and go to `http://localhost:8080/`
- **Credentials**: Create a new account on the Sign Up page.

## Project Structure

```
StressPrediction/
├── src/main/java/com/project/StressPrediction/
│   ├── controller/       # Routes and API endpoints
│   ├── service/          # Business logic & Prediction Algo
│   └── model/            # Data entities
├── src/main/resources/
│   ├── templates/        # HTML Views (Thymeleaf/Static)
│   │   ├── main1.html    # Landing Page
│   │   ├── dashboard.html
│   │   └── login.html
│   └── static/           # CSS, JS, Images
└── pom.xml               # Maven dependencies
```
