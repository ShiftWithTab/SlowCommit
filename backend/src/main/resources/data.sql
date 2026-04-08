INSERT IGNORE INTO users (id, username, created_at, updated_at) VALUES (1, 'tester', NOW(), NOW());
INSERT IGNORE INTO characters (id, name, base_image_url, created_at, updated_at) VALUES (1, '기본 캐릭터', '/images/char1.png', NOW(), NOW());
INSERT IGNORE INTO goal_definitions (id, user_id, title, motto, created_at, updated_at) VALUES (1, 1, '매일 코딩하기', '네이버, 카카오 가즈아!', NOW(), NOW());
INSERT IGNORE INTO goal_plans (id, goal_definition_id, character_id, start_date, end_date, current_level, status, created_at, updated_at) VALUES (1, 1, 1, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 8 MONTH), 1, 'PROCEEDING', NOW(), NOW());
INSERT IGNORE INTO goal_configs (goal_plan_id, alarm_cycle, preferred_emoji, created_at, updated_at) VALUES (1, 3, '🔥', NOW(), NOW());
INSERT IGNORE INTO daily_tasks (id, goal_plan_id, target_date, completed, completed_at) VALUES (1,1,DATE_SUB(CURDATE(), INTERVAL 3 DAY),true,NOW());
INSERT IGNORE INTO daily_tasks (id, goal_plan_id, target_date, completed, completed_at) VALUES (2,1,CURDATE(),false,NULL);
INSERT IGNORE INTO daily_tasks (id, goal_plan_id, target_date, completed, completed_at) VALUES (3,1,DATE_ADD(CURDATE(), INTERVAL 3 DAY),false,NULL);