-- ============================================================
-- NEIGHBOR ABROAD — Ask Page Seed Data
-- Run AFTER seed_data.sql (depends on those user UUIDs)
-- ============================================================

-- Cleanup
DELETE FROM hub_question_replies WHERE question_id IN (SELECT id FROM hub_questions WHERE hub IN ('london','seoul'));
DELETE FROM hub_questions WHERE hub IN ('london','seoul');

-- ============================================================
-- LONDON QUESTIONS
-- ============================================================

WITH q AS (
  INSERT INTO hub_questions (id, author_id, hub, category, title, body, created_at) VALUES
  (
    'aaaaaaaa-0001-0001-0001-000000000001',
    '44444444-4444-4444-4444-444444444444', -- Maya (Seoul-based, asking about London)
    'london', 'Cost',
    'How much should I budget per month living in London?',
    'I''m planning to study at KCL next semester. Coming from the US so not sure what''s realistic — rent, food, transport etc.',
    NOW() - INTERVAL '5 days'
  ),
  (
    'aaaaaaaa-0001-0001-0001-000000000002',
    '55555555-5555-5555-5555-555555555555',
    'london', 'Housing',
    'Is it worth living in student halls vs private accommodation?',
    'I got offered a room in university halls but it''s more expensive than some private options I found on Rightmove. Is halls worth it for the social experience?',
    NOW() - INTERVAL '3 days'
  ),
  (
    'aaaaaaaa-0001-0001-0001-000000000003',
    '66666666-6666-6666-6666-666666666666',
    'london', 'Transport',
    'Is the Oyster card still the best way to get around or should I use contactless?',
    NULL,
    NOW() - INTERVAL '2 days'
  ),
  (
    'aaaaaaaa-0001-0001-0001-000000000004',
    '77777777-7777-7777-7777-777777777777',
    'london', 'Culture',
    'How do British students actually socialise? I''ve heard they''re reserved at first.',
    'Back home everyone talks to strangers easily. Is it hard to make British friends or do most international students just end up in their own groups?',
    NOW() - INTERVAL '1 day'
  ),
  (
    'aaaaaaaa-0001-0001-0001-000000000005',
    '44444444-4444-4444-4444-444444444444',
    'london', 'Safety',
    'Which areas should I avoid as a student?',
    'I know London is generally safe but want a realistic picture. Are there specific zones or tube stops I should be careful around at night?',
    NOW() - INTERVAL '6 hours'
  ),
  (
    'aaaaaaaa-0001-0001-0001-000000000006',
    '55555555-5555-5555-5555-555555555555',
    'london', 'Food',
    'Where do students actually eat on a budget in London?',
    'Everything seems so expensive. I''ve been cooking but want to eat out sometimes without spending £20 a meal.',
    NOW() - INTERVAL '4 hours'
  ),
  (
    'aaaaaaaa-0001-0001-0001-000000000007',
    '66666666-6666-6666-6666-666666666666',
    'london', 'Academics',
    'How different is the university workload compared to the US system?',
    NULL,
    NOW() - INTERVAL '1 hour'
  )
  RETURNING id, title
)
SELECT id, title FROM q;

-- London answers
INSERT INTO hub_question_replies (author_id, question_id, body, created_at) VALUES

-- Q1: Budget
('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-0001-0001-0001-000000000001',
 'Realistically £1,400–1,800/month. Rent in Zone 2 will be £900–1,100 for a decent room. Food £200–250 if you cook most nights, maybe £100 on top for eating out. Travelcard Zone 1-2 is about £150/month. Budget £100 for misc. It adds up fast.',
 NOW() - INTERVAL '4 days'),

('22222222-2222-2222-2222-222222222222', 'aaaaaaaa-0001-0001-0001-000000000001',
 'Coming from UCL — I''d say £1,500 is the minimum you''d feel comfortable. Don''t forget your student railcard (1/3 off trains), it pays for itself fast if you travel at all.',
 NOW() - INTERVAL '3 days 12 hours'),

-- Q2: Halls vs private
('33333333-3333-3333-3333-333333333333', 'aaaaaaaa-0001-0001-0001-000000000002',
 'Halls is worth it first year, 100%. You meet people effortlessly and the social life basically comes to you. Private is cheaper but you have to work much harder to not feel isolated, especially as an international student.',
 NOW() - INTERVAL '2 days'),

('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-0001-0001-0001-000000000002',
 'Depends on the halls honestly. Some are very quiet and not worth the premium. Try to find Facebook groups for your specific halls before deciding.',
 NOW() - INTERVAL '1 day 18 hours'),

-- Q3: Oyster vs contactless
('22222222-2222-2222-2222-222222222222', 'aaaaaaaa-0001-0001-0001-000000000003',
 'Contactless is honestly easier and gives you the same daily/weekly caps as Oyster. No need to top up. Just use your phone or bank card. Only reason to get Oyster is for the 18+ student discount (check if your uni offers it).',
 NOW() - INTERVAL '1 day 20 hours'),

-- Q4: British social culture
('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-0001-0001-0001-000000000004',
 'Haha yeah they won''t just strike up a conversation. But once you''re in the same circle (seminar, club, halls kitchen) they warm up fast. Student union clubs are genuinely the best way in — pick one and go consistently.',
 NOW() - INTERVAL '20 hours'),

('33333333-3333-3333-3333-333333333333', 'aaaaaaaa-0001-0001-0001-000000000004',
 'I made most of my UK friends through pub quizzes and sports clubs. The pub culture is real — going to the SU bar after lectures is when people actually talk.',
 NOW() - INTERVAL '15 hours'),

-- Q5: Safety
('22222222-2222-2222-2222-222222222222', 'aaaaaaaa-0001-0001-0001-000000000005',
 'London is safe in general. Just apply normal city awareness — don''t have your phone out walking slowly at night, stick to well-lit streets. Parts of Croydon, some bits of south London late at night worth being aware of. But honestly most of Zone 1-2 is fine.',
 NOW() - INTERVAL '5 hours'),

-- Q6: Budget food
('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-0001-0001-0001-000000000006',
 'Pret A Manger subscription (£30/month) is genuinely great if you''re near one — 5 drinks and loads of food daily. Dishoom is worth the splurge once. Chinatown for cheap proper meals. Wetherspoons for a meal + drink under £10.',
 NOW() - INTERVAL '3 hours');


-- ============================================================
-- SEOUL QUESTIONS
-- ============================================================

WITH q AS (
  INSERT INTO hub_questions (id, author_id, hub, category, title, body, created_at) VALUES
  (
    'bbbbbbbb-0002-0002-0002-000000000001',
    '11111111-1111-1111-1111-111111111111', -- London student asking about Seoul
    'seoul', 'Cost',
    'Is Seoul actually as affordable as people say?',
    'I keep seeing people say Seoul is cheap but I''m not sure if that''s compared to NYC/London or genuinely affordable. What''s a realistic monthly budget?',
    NOW() - INTERVAL '6 days'
  ),
  (
    'bbbbbbbb-0002-0002-0002-000000000002',
    '22222222-2222-2222-2222-222222222222',
    'seoul', 'Culture',
    'Is Korean good enough or do I need to know Korean to get by?',
    'My Korean is maybe survival level. Will I struggle with daily life — convenience stores, restaurants, getting around?',
    NOW() - INTERVAL '4 days'
  ),
  (
    'bbbbbbbb-0002-0002-0002-000000000003',
    '33333333-3333-3333-3333-333333333333',
    'seoul', 'Transport',
    'What''s the best way to get a T-money card and how does the metro work?',
    NULL,
    NOW() - INTERVAL '3 days'
  ),
  (
    'bbbbbbbb-0002-0002-0002-000000000004',
    '11111111-1111-1111-1111-111111111111',
    'seoul', 'Housing',
    'Goshiwon vs dorm — what do most international students choose?',
    'My university offers dorms but they''re expensive and I might miss the deadline. Looking at goshiwon as a backup. Is it as bad as people make it sound?',
    NOW() - INTERVAL '2 days'
  ),
  (
    'bbbbbbbb-0002-0002-0002-000000000005',
    '22222222-2222-2222-2222-222222222222',
    'seoul', 'Food',
    'Best areas to eat that aren''t just tourist spots?',
    'I want to eat well without going to the obvious Instagrammable places every time.',
    NOW() - INTERVAL '1 day'
  ),
  (
    'bbbbbbbb-0002-0002-0002-000000000006',
    '33333333-3333-3333-3333-333333333333',
    'seoul', 'Safety',
    'How safe is Seoul for solo female students going out at night?',
    NULL,
    NOW() - INTERVAL '5 hours'
  ),
  (
    'bbbbbbbb-0002-0002-0002-000000000007',
    '11111111-1111-1111-1111-111111111111',
    'seoul', 'Academics',
    'Are Korean university classes taught in English or Korean?',
    'I''m applying as an exchange student. Are the international courses actually good or are they just the leftover classes no one wants?',
    NOW() - INTERVAL '2 hours'
  )
  RETURNING id, title
)
SELECT id, title FROM q;

-- Seoul answers
INSERT INTO hub_question_replies (author_id, question_id, body, created_at) VALUES

-- Q1: Cost
('44444444-4444-4444-4444-444444444444', 'bbbbbbbb-0002-0002-0002-000000000001',
 'It''s genuinely affordable compared to Western cities. Budget ₩1.2–1.5M/month (~$900–1100) and you''ll live comfortably. Dorm or goshiwon ₩400–600K, food ₩400K if you mix convenience store meals with restaurants, transport is like ₩50–80K. Going out can add up though.',
 NOW() - INTERVAL '5 days'),

('55555555-5555-5555-5555-555555555555', 'bbbbbbbb-0002-0002-0002-000000000001',
 'The trap is drinking culture here — the cheap food savings disappear quickly if you''re going out to bars in Hongdae every weekend. Soju is cheap but it adds up!',
 NOW() - INTERVAL '4 days 6 hours'),

-- Q2: Language
('44444444-4444-4444-4444-444444444444', 'bbbbbbbb-0002-0002-0002-000000000002',
 'You''ll be fine for daily life — convenience stores, subway, most restaurants have pictures or English menus. Download Naver Map (not Google), it''s way better here. Knowing Hangul for reading signs is genuinely useful though, takes about 2 hours to learn.',
 NOW() - INTERVAL '3 days'),

('66666666-6666-6666-6666-666666666666', 'bbbbbbbb-0002-0002-0002-000000000002',
 'Learn Hangul before you arrive, seriously. Not the language, just the alphabet. 2 hours on YouTube and suddenly you can read menus, street signs, everything. Game changer.',
 NOW() - INTERVAL '2 days 18 hours'),

-- Q3: T-money
('55555555-5555-5555-5555-555555555555', 'bbbbbbbb-0002-0002-0002-000000000003',
 'Get T-money from any convenience store (GS25, CU, 7-11) — it''s like ₩3,000 for the card. Top up at any station or convenience store. Works on metro, buses, even some taxis. The metro is super easy — all signs in English too, just tap in and tap out.',
 NOW() - INTERVAL '2 days 12 hours'),

-- Q4: Goshiwon
('66666666-6666-6666-6666-666666666666', 'bbbbbbbb-0002-0002-0002-000000000004',
 'Goshiwon gets a bad rep but honestly modern ones near universities are fine. Room is tiny (think ship cabin) but it''s just for sleeping. You get free ramen, rice, kimchi usually. Good for a semester, probably not a year. Check Naver or ask your uni''s international office for recommended ones.',
 NOW() - INTERVAL '1 day 18 hours'),

-- Q5: Food areas
('44444444-4444-4444-4444-444444444444', 'bbbbbbbb-0002-0002-0002-000000000005',
 'Mangwon-dong market on weekends for breakfast. Mapo-gu area generally underrated. Noryangjin fish market for cheap raw fish late night. Avoid Myeongdong restaurants — tourist prices. Sinchon and Edae are great for cheap Korean comfort food near university crowds.',
 NOW() - INTERVAL '20 hours'),

('55555555-5555-5555-5555-555555555555', 'bbbbbbbb-0002-0002-0002-000000000005',
 'Honestly convenience store food here is genuinely good and cheap. GS25 triangle gimbap, instant ramen, bungeo-ppang in winter. Don''t be embarrassed to eat CU for lunch sometimes.',
 NOW() - INTERVAL '16 hours'),

-- Q6: Safety for women
('66666666-6666-6666-6666-666666666666', 'bbbbbbbb-0002-0002-0002-000000000006',
 'Seoul is one of the safer cities I''ve lived in. Women-only subway cars during rush hour. CCTV everywhere. I''ve walked home at 3am in Hongdae without issues. Normal awareness applies but genuinely felt safe here more than back home.',
 NOW() - INTERVAL '4 hours');
