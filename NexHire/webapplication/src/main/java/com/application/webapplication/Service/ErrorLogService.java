package com.application.webapplication.Service;

import com.application.webapplication.Entity.ErrorLogEntity;
import com.application.webapplication.Repository.ErrorLogRepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Persists API errors to the error_logs table so admins can
 * inspect them in the Admin Panel even after server restarts.
 */
@Service
@Transactional
public class ErrorLogService {

    private final ErrorLogRepo errorLogRepo;

    public ErrorLogService(ErrorLogRepo errorLogRepo) {
        this.errorLogRepo = errorLogRepo;
    }

    /**
     * Log an error event to the database.
     *
     * @param endpoint     The API endpoint where the error occurred (e.g. "/api/v1/interviews/start")
     * @param userEmail    Email of the user involved (null if unknown)
     * @param errorMessage The exception or error message
     * @param httpStatus   HTTP status code (e.g. 500, 400)
     */
    public void log(String endpoint, String userEmail, String errorMessage, int httpStatus) {
        ErrorLogEntity logEntry = ErrorLogEntity.builder()
                .endpoint(endpoint)
                .userEmail(userEmail)
                .errorMessage(errorMessage)
                .httpStatus(httpStatus)
                .build();
        errorLogRepo.save(logEntry);
    }

    /** Fetch all logs, most recent first. */
    public List<ErrorLogEntity> getRecentLogs() {
        return errorLogRepo.findAllByOrderByOccurredAtDesc();
    }

    /** Hard-delete all error log entries. */
    public void clearAllLogs() {
        errorLogRepo.deleteAll();
    }
}
