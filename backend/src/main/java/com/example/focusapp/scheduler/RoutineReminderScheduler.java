package com.example.focusapp.scheduler;

import com.example.focusapp.dto.RoutinePushTarget;
import com.example.focusapp.repository.RoutineRepository;
import com.example.focusapp.service.ExpoPushService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Component
@RequiredArgsConstructor
public class RoutineReminderScheduler {

    private final RoutineRepository routineRepository;
    private final ExpoPushService expoPushService;

//    private static final DateTimeFormatter TIME_FORMATTER =
//            DateTimeFormatter.ofPattern("HH:mm");

    @Transactional
    @Scheduled(cron = "0 * * * * *")
    public void sendRoutineReminders() {
        LocalTime nowTime = LocalTime.now().withSecond(0).withNano(0);
        LocalDate today = LocalDate.now();

        List<RoutinePushTarget> targets =
                routineRepository.findRoutinePushTargets(nowTime,today);
        System.out.println("ROUTINE  푸시 대상 수 = " + targets.size());


        for (RoutinePushTarget target : targets) {
            expoPushService.sendRoutineReminder(target);

            LocalDate nextDate = target.getNextTargetDate()
                    .plusDays(target.getInterval());

            routineRepository.updateNextTargetDate(
                    target.getRoutineId(),
                    nextDate
            );
        }
    }
}