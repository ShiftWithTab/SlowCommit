INSERT IGNORE INTO characters (id, name, base_image_url, created_at, updated_at)
VALUES (1, '기본 캐릭터', '/images/char1.png', NOW(), NOW());

INSERT IGNORE INTO users (id, username, created_at, updated_at)
VALUES (1, 'tester', NOW(), NOW())
    ON DUPLICATE KEY UPDATE username='tester';

INSERT IGNORE INTO goal_definitions (id, user_id, title, motto)
VALUES (1, 1, '집중 루틴 만들기', '천천히 꾸준히');

INSERT IGNORE INTO goal_plans
(id, user_id, goal_definition_id, character_id, start_date, end_date, current_level, status)
VALUES (1, 1, 1, 1, CURRENT_DATE, DATE_ADD(CURRENT_DATE, INTERVAL 30 DAY), 1, 'PROCEEDING')
    ON DUPLICATE KEY UPDATE current_level=1, status='PROCEEDING';

INSERT IGNORE INTO goal_configs (goal_plan_id, alarm_cycle, preferred_emoji)
VALUES (1, 1, '💪')
    ON DUPLICATE KEY UPDATE alarm_cycle=1, preferred_emoji='💪';

INSERT IGNORE INTO daily_tasks (goal_plan_id, target_date, completed)
VALUES (1, CURRENT_DATE, false)
    ON DUPLICATE KEY UPDATE completed=false;