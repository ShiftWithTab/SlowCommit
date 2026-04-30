package com.example.focusapp.service;

import com.example.focusapp.dto.ReminderPushTarget;
import com.example.focusapp.dto.RoutinePushTarget;

import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ExpoPushService {

    private final RestTemplate restTemplate = new RestTemplate();

    private void send(String pushToken, String title, String body) {
        String url = "https://exp.host/--/api/v2/push/send";

        Map<String, Object> payload = new HashMap<>();
        payload.put("to", pushToken);
        payload.put("sound", "default");
        payload.put("title", title);
        payload.put("body", body);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request =
                new HttpEntity<>(payload, headers);

        try {
            restTemplate.postForEntity(url, request, String.class);
        } catch (Exception e) {
            System.out.println("푸시 발송 실패: " + e.getMessage());
        }
    }


    public void sendGoalReminder(ReminderPushTarget target) {
        send(
                target.getPushToken(),
                "아직 남은 할 일이 있어요 !!",
                target.getGoalTitle() + " 목표를 오늘도 한 칸 채워볼까요?"
        );
    }

    public void sendRoutineReminder(RoutinePushTarget target) {
        send(
                target.getPushToken(),
                "지금은 루틴 시간 ⏰",
                target.getRoutineTitle() + " 잊지 말고 체크해요!"
        );
    }


}