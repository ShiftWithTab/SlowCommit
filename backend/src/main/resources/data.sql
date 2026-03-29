INSERT INTO category (id, name, color_hex, emoji) VALUES (1, 'Water', '#d8c2ff', '🥚');
INSERT INTO category (id, name, color_hex, emoji) VALUES (2, 'Study', '#f7d0ef', '👶');
INSERT INTO category (id, name, color_hex, emoji) VALUES (3, 'Job Change', '#d7f7a0', '🧑‍🎓');

INSERT INTO task (id, title, completed, category_id, due_date) VALUES (1, '백준 알고리즘 19222번 풀기', false, 2, CURRENT_DATE);
INSERT INTO task (id, title, completed, category_id, due_date) VALUES (2, '백준 알고리즘 20392번 작성', false, 2, CURRENT_DATE);
INSERT INTO task (id, title, completed, category_id, due_date) VALUES (3, '리트코드 Medium 2문제 풀기', true, 2, CURRENT_DATE);
INSERT INTO task (id, title, completed, category_id, due_date) VALUES (4, 'CJ 지원서 제출', true, 3, CURRENT_DATE);
INSERT INTO task (id, title, completed, category_id, due_date) VALUES (5, '네이버 자소서 3번 문항 수정', false, 3, CURRENT_DATE);
