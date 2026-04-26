import com.example.focusapp.dto.ReminderPushTarget;
import com.example.focusapp.repository.GoalReminderTimeRepository;
import com.example.focusapp.service.ExpoPushService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Component
@RequiredArgsConstructor
public class GoalReminderScheduler {

    private final GoalReminderTimeRepository reminderRepository;
    private final ExpoPushService expoPushService;

    private static final DateTimeFormatter TIME_FORMATTER =
            DateTimeFormatter.ofPattern("HH:mm");

    @Scheduled(cron = "0 * * * * *")
    public void sendReminderPushes() {
        String nowTime = LocalTime.now().format(TIME_FORMATTER);

        List<ReminderPushTarget> targets =
                reminderRepository.findPushTargets(nowTime);

        for (ReminderPushTarget target : targets) {
            expoPushService.sendGoalReminder(target);
        }
    }
}