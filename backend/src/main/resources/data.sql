INSERT IGNORE INTO characters (id, name, base_image_url, created_at, updated_at)
VALUES (1, '기본 캐릭터', '/images/char1.png', NOW(), NOW());

INSERT INTO users (id, username, created_at, updated_at)
VALUES (1, 'testuser', NOW(), NOW())
    ON DUPLICATE KEY UPDATE username='testuser';

INSERT INTO goal_definitions (id, user_id, title, motto)
VALUES (1, 1, '매일 운동', '조금씩 꾸준히')
    ON DUPLICATE KEY UPDATE title='매일 운동', motto='조금씩 꾸준히';

INSERT INTO goal_plans (id, goal_definition_id, character_id, start_date, end_date, current_level, status)
VALUES (1, 1, 1, CURRENT_DATE, DATE_ADD(CURRENT_DATE, INTERVAL 30 DAY), 1, 'PROCEEDING')
    ON DUPLICATE KEY UPDATE current_level=1, status='PROCEEDING';

INSERT INTO goal_configs (goal_plan_id, alarm_cycle, preferred_emoji)
VALUES (1, 1, '💪')
    ON DUPLICATE KEY UPDATE alarm_cycle=1, preferred_emoji='💪';

INSERT INTO daily_tasks (id, goal_plan_id, target_date, completed)
VALUES (1, 1, CURRENT_DATE, false)
    ON DUPLICATE KEY UPDATE completed=false;