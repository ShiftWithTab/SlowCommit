INSERT IGNORE INTO category (id, name, color_hex, emoji)
VALUES (1, 'Water', '#d8c2ff', '🥚');

INSERT IGNORE INTO category (id, name, color_hex, emoji)
VALUES (2, 'Study', '#f7d0ef', '👶');

INSERT IGNORE INTO category (id, name, color_hex, emoji)
VALUES (3, 'Job Change', '#d7f7a0', '🧑‍🎓');


INSERT IGNORE INTO task
(id, title, completed, category_id, due_date, start_date, repeat_cycle)
VALUES
(1, '백준 알고리즘 19222번 풀기', false, 1, CURRENT_DATE, CURRENT_DATE, 3);

INSERT IGNORE INTO task
(id, title, completed, category_id, due_date, start_date, repeat_cycle)
VALUES
(2, '백준 알고리즘 20392번 작성', false, 2, CURRENT_DATE, CURRENT_DATE, 1);

INSERT IGNORE INTO task
(id, title, completed, category_id, due_date, start_date, repeat_cycle)
VALUES
(3, '리트코드 Medium 2문제 풀기', true, 2, CURRENT_DATE, CURRENT_DATE, 7);

INSERT IGNORE INTO task
(id, title, completed, category_id, due_date, start_date, repeat_cycle)
VALUES
(4, 'CJ 지원서 제출', true, 1, CURRENT_DATE, CURRENT_DATE, 3);

INSERT IGNORE INTO task
(id, title, completed, category_id, due_date, start_date, repeat_cycle)
VALUES
(5, '네이버 자소서 3번 문항 수정', false, 3, CURRENT_DATE, CURRENT_DATE, 2);

INSERT IGNORE INTO daily_tasks (id, task_id, target_date, completed, completed_at)
VALUES (1, 1, CURRENT_DATE, false, null);

INSERT IGNORE INTO daily_tasks (id, task_id, target_date, completed, completed_at)
VALUES (2, 2, CURRENT_DATE, false, null);

INSERT IGNORE INTO daily_tasks (id, task_id, target_date, completed, completed_at)
VALUES (3, 3, CURRENT_DATE, true, NOW());

INSERT IGNORE INTO daily_tasks (id, task_id, target_date, completed, completed_at)
VALUES (4, 4, CURRENT_DATE, true, NOW());

INSERT IGNORE INTO daily_tasks (id, task_id, target_date, completed, completed_at)
VALUES (5, 5, CURRENT_DATE, false, null);