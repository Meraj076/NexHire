package com.application.webapplication.Service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.concurrent.atomic.AtomicInteger;

/**
 * Tracks today's Gemini API call counts in-memory using thread-safe AtomicIntegers.
 * Counters reset automatically at midnight via @Scheduled cron.
 * Requires @EnableScheduling on the main application class.
 */
@Service
public class ApiUsageCounterService {

    private final AtomicInteger todayInterviewCount = new AtomicInteger(0);
    private final AtomicInteger todayResumeCount    = new AtomicInteger(0);

    public void incrementInterviewCount() {
        todayInterviewCount.incrementAndGet();
    }

    public void incrementResumeCount() {
        todayResumeCount.incrementAndGet();
    }

    public int getTodayInterviewCount() {
        return todayInterviewCount.get();
    }

    public int getTodayResumeCount() {
        return todayResumeCount.get();
    }

    public int getTotalToday() {
        return todayInterviewCount.get() + todayResumeCount.get();
    }

    /** Reset counters every day at midnight (00:00:00) */
    @Scheduled(cron = "0 0 0 * * *")
    public void resetDailyCounters() {
        todayInterviewCount.set(0);
        todayResumeCount.set(0);
        System.out.println("✅ Daily API usage counters have been reset.");
    }
}
