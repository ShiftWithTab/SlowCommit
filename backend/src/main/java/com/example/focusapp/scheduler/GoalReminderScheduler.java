package com.example.focusapp.scheduler;

import com.example.focusapp.dto.ReminderPushTarget;
import com.example.focusapp.repository.GoalReminderTimeRepository;
import com.example.focusapp.service.ExpoPushService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Component
@RequiredArgsConstructor
public class GoalReminderScheduler {

    private final GoalReminderTimeRepository reminderRepository;
    private final ExpoPushService expoPushService;


    @Transactional
    @Scheduled(cron = "0 * * * * *")
    public void sendReminderPushes() {
        LocalDate today = LocalDate.now();

        String nowTime = LocalTime.now()
                .format(DateTimeFormatter.ofPattern("HH:mm"));

        List<ReminderPushTarget> targets =
                reminderRepository.findPushTargets(nowTime, today);

        System.out.println("GOAL 푸시 대상 수 = " + targets.size());

        for (ReminderPushTarget target : targets) {

            expoPushService.sendGoalReminder(target);

            LocalDate nextDate = target.getNextTargetDate()
                    .plusDays(target.getAlarmCycle());

            reminderRepository.updateNextTargetDate(
                    target.getReminderTimeId(),
                    nextDate
            );
        }
    }
}