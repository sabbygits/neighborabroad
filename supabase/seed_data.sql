-- ============================================================
-- NEIGHBOR ABROAD — STARTER SEED DATA
-- Run this in your Supabase SQL Editor after schema.sql
-- Safe to re-run (uses ON CONFLICT DO NOTHING / DELETE+INSERT)
-- ============================================================

-- ============================================================
-- 0. CLEANUP — Delete existing seeded data so this is re-runnable
-- ============================================================

DELETE FROM intel_notes WHERE author_id IN (
  '11111111-1111-1111-1111-111111111111','22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333333','44444444-4444-4444-4444-444444444444',
  '55555555-5555-5555-5555-555555555555','66666666-6666-6666-6666-666666666666',
  '77777777-7777-7777-7777-777777777777'
);
DELETE FROM places WHERE hub IN ('london','seoul');
DELETE FROM meetup_joins WHERE meetup_id IN (SELECT id FROM meetups WHERE hub IN ('london','seoul'));
DELETE FROM meetups WHERE hub IN ('london','seoul');
DELETE FROM post_likes WHERE post_id IN (SELECT id FROM posts WHERE hub IN ('london','seoul'));
DELETE FROM replies WHERE post_id IN (SELECT id FROM posts WHERE hub IN ('london','seoul'));
DELETE FROM posts WHERE hub IN ('london','seoul');


-- ============================================================
-- 1. SEED USERS — Insert into auth.users + profiles
-- ============================================================

-- London users
INSERT INTO auth.users (
  instance_id, id, aud, role, email,
  encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data,
  is_super_admin, created_at, updated_at, is_sso_user
) VALUES
  ('00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', 'authenticated', 'authenticated',
   'jamie.chen@ucl.ac.uk', '', NOW(), '{"provider":"email","providers":["email"]}', '{}', false, NOW(), NOW(), false),
  ('00000000-0000-0000-0000-000000000000', '22222222-2222-2222-2222-222222222222', 'authenticated', 'authenticated',
   'priya.sharma@lse.ac.uk', '', NOW(), '{"provider":"email","providers":["email"]}', '{}', false, NOW(), NOW(), false),
  ('00000000-0000-0000-0000-000000000000', '33333333-3333-3333-3333-333333333333', 'authenticated', 'authenticated',
   'alex.morgan@kcl.ac.uk', '', NOW(), '{"provider":"email","providers":["email"]}', '{}', false, NOW(), NOW(), false),
  ('00000000-0000-0000-0000-000000000000', '44444444-4444-4444-4444-444444444444', 'authenticated', 'authenticated',
   'sofia.reed@imperial.ac.uk', '', NOW(), '{"provider":"email","providers":["email"]}', '{}', false, NOW(), NOW(), false),
-- Seoul users
  ('00000000-0000-0000-0000-000000000000', '55555555-5555-5555-5555-555555555555', 'authenticated', 'authenticated',
   'minjun.park@yonsei.ac.kr', '', NOW(), '{"provider":"email","providers":["email"]}', '{}', false, NOW(), NOW(), false),
  ('00000000-0000-0000-0000-000000000000', '66666666-6666-6666-6666-666666666666', 'authenticated', 'authenticated',
   'soyeon.kim@snu.ac.kr', '', NOW(), '{"provider":"email","providers":["email"]}', '{}', false, NOW(), NOW(), false),
  ('00000000-0000-0000-0000-000000000000', '77777777-7777-7777-7777-777777777777', 'authenticated', 'authenticated',
   'daniel.oh@kaist.ac.kr', '', NOW(), '{"provider":"email","providers":["email"]}', '{}', false, NOW(), NOW(), false)
ON CONFLICT (id) DO NOTHING;

-- Profiles
INSERT INTO profiles (id, email, name, university, hub, base_hub) VALUES
  ('11111111-1111-1111-1111-111111111111', 'jamie.chen@ucl.ac.uk',    'Jamie Chen',   'UCL',      'london', 'london'),
  ('22222222-2222-2222-2222-222222222222', 'priya.sharma@lse.ac.uk',  'Priya Sharma', 'LSE',      'london', 'london'),
  ('33333333-3333-3333-3333-333333333333', 'alex.morgan@kcl.ac.uk',   'Alex Morgan',  'KCL',      'london', 'london'),
  ('44444444-4444-4444-4444-444444444444', 'sofia.reed@imperial.ac.uk','Sofia Reed',  'Imperial', 'london', 'london'),
  ('55555555-5555-5555-5555-555555555555', 'minjun.park@yonsei.ac.kr','Minjun Park',  'Yonsei',   'seoul',  'seoul'),
  ('66666666-6666-6666-6666-666666666666', 'soyeon.kim@snu.ac.kr',    'Soyeon Kim',   'SNU',      'seoul',  'seoul'),
  ('77777777-7777-7777-7777-777777777777', 'daniel.oh@kaist.ac.kr',   'Daniel Oh',    'KAIST',    'seoul',  'seoul')
ON CONFLICT (id) DO NOTHING;


-- ============================================================
-- 2. LONDON COMMONS POSTS
-- ============================================================

WITH inserted_posts AS (
  INSERT INTO posts (id, author_id, hub, category, title, body, created_at) VALUES

  -- Question
  ('a1000001-0000-0000-0000-000000000001',
   '11111111-1111-1111-1111-111111111111',
   'london', 'Question',
   'Best way to get an Oyster card?',
   'Just arrived in London and super confused about the transport system. Is it better to get a regular Oyster card or just use my contactless bank card? Also, are there any student discounts I should know about on the Tube?',
   NOW() - INTERVAL '6 days'),

  -- Local
  ('a1000002-0000-0000-0000-000000000002',
   '33333333-3333-3333-3333-333333333333',
   'london', 'Social',
   'Borough Market is absolutely worth the Saturday morning queue',
   'Went for the first time this weekend and honestly it lives up to the hype. The raclette stand alone is worth going. Also found an incredible Sri Lankan curry stall near the back entrance. Budget around £12-15 for a proper lunch. Go early though — after 11am it''s shoulder to shoulder.',
   NOW() - INTERVAL '5 days'),

  -- Travel
  ('a1000003-0000-0000-0000-000000000003',
   '22222222-2222-2222-2222-222222222222',
   'london', 'Travel',
   'Weekend trip to Italy — who''s in?',
   'Looking at flying London Gatwick → Bologna or Florence for a long weekend in April. Flights are surprisingly cheap (£40-60 return on Ryanair right now). Anyone want to coordinate? Would be fun to explore as a group. Drop a reply if you''re interested and we can figure out dates.',
   NOW() - INTERVAL '4 days'),

  -- Local
  ('a1000004-0000-0000-0000-000000000004',
   '44444444-4444-4444-4444-444444444444',
   'london', 'Social',
   'Shoreditch street art walk — hidden spots you''re missing',
   'Did a 3-hour self-guided walk last Sunday and found some incredible pieces beyond the usual Brick Lane corridor. The area around Redchurch Street and Calvert Avenue has some stunning murals most tourists miss. Happy to share the route I used if anyone''s interested.',
   NOW() - INTERVAL '4 days'),

  -- Safety
  ('a1000005-0000-0000-0000-000000000005',
   '11111111-1111-1111-1111-111111111111',
   'london', 'Safety',
   'TfL weekend closures — check before you travel this weekend',
   'Just a heads up — the Central line has planned engineering works this weekend (no service between Ealing Broadway and Liverpool Street on Saturday). Also the Elizabeth line is running reduced frequency on Sunday. Always worth checking the TfL status board before you head out.',
   NOW() - INTERVAL '3 days'),

  -- Question
  ('a1000006-0000-0000-0000-000000000006',
   '22222222-2222-2222-2222-222222222222',
   'london', 'Question',
   'Best SIM card for international students in London?',
   'My home country SIM is getting expensive for data. What are people using? I''ve seen Three, Giffgaff, and SMARTY come up. Mostly need good data for Google Maps and staying in touch. Budget around £10-15/month.',
   NOW() - INTERVAL '2 days'),

  -- Social
  ('a1000007-0000-0000-0000-000000000007',
   '33333333-3333-3333-3333-333333333333',
   'london', 'Social',
   'Anyone going to the Notting Hill Carnival in August?',
   'Already planning ahead — last year it was one of the best days of my life and I want to go again. Looking for people to go with. It gets very crowded so it''s much better with a group who knows the area. Who else is in London over summer?',
   NOW() - INTERVAL '1 day'),

  -- Safety
  ('a1000008-0000-0000-0000-000000000008',
   '44444444-4444-4444-4444-444444444444',
   'london', 'Safety',
   'Night Tube safety — a few things worth knowing',
   'Been here a semester now and have a few tips: (1) Sit in the carriage closest to the driver late at night, (2) The Night Overground is generally safer-feeling than some Night Tube lines, (3) If you feel uncomfortable, get off at a busy station and wait for the next train. City is generally very safe but good to be aware.',
   NOW() - INTERVAL '12 hours')

  RETURNING id, author_id, hub
)
SELECT 1; -- suppress output


-- ============================================================
-- 3. LONDON POST REPLIES
-- ============================================================

INSERT INTO replies (post_id, author_id, body, created_at) VALUES

-- Oyster card replies
('a1000001-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222',
 'Contactless is honestly the easiest option — it has the same daily/weekly fare caps as Oyster. Only get an Oyster if you want to load a specific travel pass.',
 NOW() - INTERVAL '5 days 20 hours'),
('a1000001-0000-0000-0000-000000000001', '44444444-4444-4444-4444-444444444444',
 'Ask your university about the 18+ Student Oyster photocard — 30% discount on adult Travelcards. Takes a week or two to process but totally worth it!',
 NOW() - INTERVAL '5 days 18 hours'),
('a1000001-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333333',
 'One thing to note — contactless works perfectly on Tube, bus, and Elizabeth line. I''ve been here 4 months and never needed an Oyster card.',
 NOW() - INTERVAL '5 days 10 hours'),

-- Borough Market replies
('a1000002-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111',
 'The Gujarati curry stand is incredible too! And the bread from the French bakery near the entrance. Agree on going early.',
 NOW() - INTERVAL '4 days 22 hours'),
('a1000002-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222',
 'Hot tip: there''s a small cafe inside called Monmouth Coffee right next to the market. Best flat white in London, no exaggeration.',
 NOW() - INTERVAL '4 days 15 hours'),

-- SIM card replies
('a1000006-0000-0000-0000-000000000006', '44444444-4444-4444-4444-444444444444',
 'SMARTY has been great for me — unlimited everything for £15/month. They use Three''s network so coverage is solid across London.',
 NOW() - INTERVAL '1 day 20 hours'),
('a1000006-0000-0000-0000-000000000006', '33333333-3333-3333-3333-333333333333',
 'Giffgaff user here — very reliable and you can pause your plan between months if you travel.',
 NOW() - INTERVAL '1 day 16 hours'),

-- Italy trip replies
('a1000003-0000-0000-0000-000000000003', '44444444-4444-4444-4444-444444444444',
 'I''m interested! Florence would be amazing. The Uffizi Gallery and the food alone would be worth it.',
 NOW() - INTERVAL '3 days 14 hours'),
('a1000003-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111',
 'Also interested. Been wanting to see Bologna — apparently the food scene is even better than Florence and it''s much less touristy.',
 NOW() - INTERVAL '3 days 8 hours');


-- ============================================================
-- 4. LONDON POST LIKES
-- ============================================================

INSERT INTO post_likes (post_id, user_id) VALUES
('a1000002-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111'),
('a1000002-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222'),
('a1000002-0000-0000-0000-000000000002', '44444444-4444-4444-4444-444444444444'),
('a1000004-0000-0000-0000-000000000004', '22222222-2222-2222-2222-222222222222'),
('a1000004-0000-0000-0000-000000000004', '33333333-3333-3333-3333-333333333333'),
('a1000001-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333333'),
('a1000005-0000-0000-0000-000000000005', '22222222-2222-2222-2222-222222222222'),
('a1000005-0000-0000-0000-000000000005', '44444444-4444-4444-4444-444444444444'),
('a1000006-0000-0000-0000-000000000006', '11111111-1111-1111-1111-111111111111'),
('a1000006-0000-0000-0000-000000000006', '44444444-4444-4444-4444-444444444444'),
('a1000008-0000-0000-0000-000000000008', '11111111-1111-1111-1111-111111111111'),
('a1000008-0000-0000-0000-000000000008', '22222222-2222-2222-2222-222222222222')
ON CONFLICT DO NOTHING;


-- ============================================================
-- 5. SEOUL COMMONS POSTS
-- ============================================================

INSERT INTO posts (id, author_id, hub, category, title, body, created_at) VALUES

  -- Question
  ('b2000001-0000-0000-0000-000000000001',
   '55555555-5555-5555-5555-555555555555',
   'seoul', 'Question',
   'T-money vs Cashbee card — which should I get?',
   'Just arrived in Seoul and confused about transit cards. I''ve seen both T-money and Cashbee at the convenience stores. Is there a practical difference? Also, do they work for both the subway and buses? Any tips for topping up?',
   NOW() - INTERVAL '6 days'),

  -- Local
  ('b2000002-0000-0000-0000-000000000002',
   '66666666-6666-6666-6666-666666666666',
   'seoul', 'Social',
   'Gwangjang Market is everything they say it is',
   'Finally went on Saturday morning and the food hall completely lived up to the hype. The bindaetteok (mung bean pancakes) are incredible and the mayak gimbap stalls are addictive. Bring cash — most stalls are cash only. Budget about 15,000-20,000 won for a full meal. Go before noon to avoid the tourist rush.',
   NOW() - INTERVAL '5 days'),

  -- Travel
  ('b2000003-0000-0000-0000-000000000003',
   '77777777-7777-7777-7777-777777777777',
   'seoul', 'Travel',
   'Planning a Jeju Island trip — looking for people to split costs',
   'Jeju flights from Gimpo are really affordable right now (around 50,000-80,000 KRW return). Thinking of going for 3-4 days in April. Would love to split rental car costs — you really need a car there to see everything. Anyone interested? Hallasan hike + Seongsan Sunrise Peak are the priorities.',
   NOW() - INTERVAL '4 days'),

  -- Social
  ('b2000004-0000-0000-0000-000000000004',
   '55555555-5555-5555-5555-555555555555',
   'seoul', 'Social',
   'Best norebang (karaoke) spots in Hongdae?',
   'Going with a group of 6 this Friday night. Looking for recommendations — ideally somewhere with good song selection in English AND Korean, good sound system, and reasonable prices. Seen a few chains like Su Norebang and Luxury Su come up. Anyone been recently?',
   NOW() - INTERVAL '3 days'),

  -- Question
  ('b2000005-0000-0000-0000-000000000005',
   '66666666-6666-6666-6666-666666666666',
   'seoul', 'Question',
   'Vegetarian food recommendations in Seoul?',
   'I''m vegetarian and while I love Seoul, navigating the food scene has been a challenge. A lot of things that seem vegetarian have hidden meat broth. Has anyone found reliable vegetarian or vegan spots, especially near Mapo, Hongdae, or Yonsei area? Buddhist temple food (사찰음식) restaurants would also be amazing if anyone knows any.',
   NOW() - INTERVAL '2 days'),

  -- Safety
  ('b2000006-0000-0000-0000-000000000006',
   '77777777-7777-7777-7777-777777777777',
   'seoul', 'Safety',
   'Emergency numbers and apps every student should have in Seoul',
   'Quick safety resource list: Emergency is 119 (fire/ambulance) and 112 (police). Download the ''안전디딤돌'' (Safe-Step) app — it works even without Korean data and shows nearby hospitals and emergency services. Also, most convenience stores (CU, GS25) can call emergency services for you if you''re in trouble. Seoul is incredibly safe but good to be prepared.',
   NOW() - INTERVAL '1 day'),

  -- Local
  ('b2000007-0000-0000-0000-000000000007',
   '55555555-5555-5555-5555-555555555555',
   'seoul', 'Social',
   'Han River picnic essentials — the complete guide',
   'The Hangang park culture is one of the best things about Seoul. Here''s what you need: (1) 편의점 (convenience store) is your friend — CU and GS25 near the river have everything, (2) Bring a mat or rent one near the park entrance for 2,000 won, (3) Friday and Saturday nights often have outdoor screenings. Best spots: Yeouido for the skyline view, Ttukseom for the vibe.',
   NOW() - INTERVAL '18 hours');


-- ============================================================
-- 6. SEOUL POST REPLIES
-- ============================================================

INSERT INTO replies (post_id, author_id, body, created_at) VALUES

-- T-money replies
('b2000001-0000-0000-0000-000000000001', '66666666-6666-6666-6666-666666666666',
 'Either works fine for subway and buses — they use the same network. I use T-money because it''s accepted for taxis too. Top up at any GS25 or CU convenience store.',
 NOW() - INTERVAL '5 days 22 hours'),
('b2000001-0000-0000-0000-000000000001', '77777777-7777-7777-7777-777777777777',
 'Also works at some cafes and vending machines! The Naver Pay / Kakao Pay apps can also be linked as virtual T-money if you get a Korean bank account.',
 NOW() - INTERVAL '5 days 18 hours'),
('b2000001-0000-0000-0000-000000000001', '55555555-5555-5555-5555-555555555555',
 'One tip — keep at least 5,000-10,000 won balance. If you run out mid-journey you can borrow from the gate and pay it back next time you top up.',
 NOW() - INTERVAL '5 days 12 hours'),

-- Gwangjang replies
('b2000002-0000-0000-0000-000000000002', '55555555-5555-5555-5555-555555555555',
 'The raw beef (육회) stall is also incredible if you eat meat. The halmeoni (grandma) vendors there have been doing this for decades.',
 NOW() - INTERVAL '4 days 20 hours'),
('b2000002-0000-0000-0000-000000000002', '77777777-7777-7777-7777-777777777777',
 'Pro tip: go with a smaller group or solo. It''s hard to navigate with more than 3-4 people during busy hours.',
 NOW() - INTERVAL '4 days 15 hours'),

-- Vegetarian replies
('b2000005-0000-0000-0000-000000000005', '77777777-7777-7777-7777-777777777777',
 'Loving Hut in Hongdae is 100% vegan and surprisingly good. Also, Insadong has a few temple food spots. The app HappyCow has decent Seoul listings too.',
 NOW() - INTERVAL '1 day 20 hours'),
('b2000005-0000-0000-0000-000000000005', '55555555-5555-5555-5555-555555555555',
 'Osegye Hyang in Insadong is the best vegetarian restaurant I''ve found in Seoul. It''s Buddhist vegetarian (no garlic/onion) but incredible. A bit pricey but worth it.',
 NOW() - INTERVAL '1 day 14 hours'),

-- Karaoke replies
('b2000004-0000-0000-0000-000000000004', '66666666-6666-6666-6666-666666666666',
 'Luxury Su is genuinely great — the rooms are clean, song selection is massive and very current. Go after 10pm for the cheaper late-night rates.',
 NOW() - INTERVAL '2 days 18 hours'),
('b2000004-0000-0000-0000-000000000004', '77777777-7777-7777-7777-777777777777',
 'Book in advance on weekends — it fills up fast. Also, most places will let you bring your own food/drinks from outside to keep costs down.',
 NOW() - INTERVAL '2 days 12 hours'),

-- Jeju trip replies
('b2000003-0000-0000-0000-000000000003', '55555555-5555-5555-5555-555555555555',
 'Very interested! Hallasan is at the top of my list. A rental car is definitely the way to go — the bus schedule for the east side is terrible.',
 NOW() - INTERVAL '3 days 20 hours'),
('b2000003-0000-0000-0000-000000000003', '66666666-6666-6666-6666-666666666666',
 'Count me in potentially. I''d recommend staying in Seogwipo on the south side — better access to the waterfalls and Olle trails.',
 NOW() - INTERVAL '3 days 14 hours');


-- ============================================================
-- 7. SEOUL POST LIKES
-- ============================================================

INSERT INTO post_likes (post_id, user_id) VALUES
('b2000002-0000-0000-0000-000000000002', '55555555-5555-5555-5555-555555555555'),
('b2000002-0000-0000-0000-000000000002', '77777777-7777-7777-7777-777777777777'),
('b2000005-0000-0000-0000-000000000005', '55555555-5555-5555-5555-555555555555'),
('b2000005-0000-0000-0000-000000000005', '77777777-7777-7777-7777-777777777777'),
('b2000007-0000-0000-0000-000000000007', '66666666-6666-6666-6666-666666666666'),
('b2000007-0000-0000-0000-000000000007', '77777777-7777-7777-7777-777777777777'),
('b2000001-0000-0000-0000-000000000001', '66666666-6666-6666-6666-666666666666'),
('b2000006-0000-0000-0000-000000000006', '55555555-5555-5555-5555-555555555555'),
('b2000006-0000-0000-0000-000000000006', '66666666-6666-6666-6666-666666666666'),
('b2000004-0000-0000-0000-000000000004', '77777777-7777-7777-7777-777777777777')
ON CONFLICT DO NOTHING;


-- ============================================================
-- 8. LONDON MEETUPS
-- ============================================================

INSERT INTO meetups (creator_id, hub, name, location, category, description, date) VALUES

  ('22222222-2222-2222-2222-222222222222', 'london', 'Brunch & Borough Market Run',
   'Borough Market, SE1 1TL',
   'Social',
   'Meeting at the market entrance for a self-guided food crawl. We''ll split into small groups and each grab different things — cheese, pastries, hot food — and share. Great way to meet people and try more of the market.',
   NOW() + INTERVAL '8 days'),

  ('44444444-4444-4444-4444-444444444444', 'london', 'Tate Modern & South Bank Walk',
   'Tate Modern, Bankside, SE1',
   'Social',
   'Free entry to the permanent collection + a walk along the South Bank to the Sky Garden (free booking online). A nice afternoon doing the cultural London thing properly. We''ll grab coffee at the Tate Espresso Bar first.',
   NOW() + INTERVAL '13 days'),

  ('11111111-1111-1111-1111-111111111111', 'london', 'British Library Study Day',
   'British Library, 96 Euston Rd, NW1 2DB',
   'Social',
   'Group study session in the Humanities Reading Room. It''s a stunning space and very motivating. You''ll need your university ID for access. Bringing noise-cancelling headphones recommended. Meet outside the main entrance at 10am.',
   NOW() + INTERVAL '6 days'),

  ('33333333-3333-3333-3333-333333333333', 'london', 'Hampstead Heath Sunday Hike',
   'Parliament Hill entrance, Hampstead Heath, NW3',
   'Outdoors',
   'Easy 2-hour walk across the Heath with the best panoramic view of London at the top of Parliament Hill. No experience needed. We''ll stop at the Lido Cafe for coffee and pastries after. Dogs welcome.',
   NOW() + INTERVAL '17 days'),

  ('22222222-2222-2222-2222-222222222222', 'london', 'Kingsland Road Pho Mile Dinner',
   'Kingsland Road, Shoreditch, E2',
   'Food',
   'Meeting on Kingsland Road for a group dinner at one of the Vietnamese restaurants on the famous "Pho Mile". Great value (£10-14 for a full meal) and some of the best Vietnamese food outside Vietnam. We''ll pick a restaurant based on the queue length when we arrive.',
   NOW() + INTERVAL '22 days');


-- ============================================================
-- 9. SEOUL MEETUPS
-- ============================================================

INSERT INTO meetups (creator_id, hub, name, location, category, description, date) VALUES

  ('55555555-5555-5555-5555-555555555555', 'seoul', 'Hongdae Weekend Social',
   'Hongik University Station Exit 9, Mapo-gu',
   'Social',
   'Casual meetup starting at the station and wandering the Hongdae streets — street performers, indie shops, and great street food. No plan is the plan. We''ll figure out dinner and drinks as a group. Good mix of students from all three unis.',
   NOW() + INTERVAL '7 days'),

  ('66666666-6666-6666-6666-666666666666', 'seoul', 'Gyeongbokgung Palace Hanbok Tour',
   'Gyeongbokgung Palace, Sejong-daero, Jongno-gu',
   'Social',
   'Renting hanbok from the rental shops near the palace gates and exploring Gyeongbokgung together. If you wear hanbok, entry to the palace is free! Great for photos. We''ll head to Bukchon Hanok Village afterwards for the traditional village walk.',
   NOW() + INTERVAL '11 days'),

  ('77777777-7777-7777-7777-777777777777', 'seoul', 'Starfield Library Study Session',
   'COEX Mall, 513 Yeongdong-daero, Gangnam-gu',
   'Social',
   'Group study at the famous Starfield Library inside COEX. It''s technically not a working library (no checkout) but an incredible space to work in. Surrounded by 13m tall bookshelves. Bring your laptop and headphones. Meet at COEX Atrium entrance.',
   NOW() + INTERVAL '5 days'),

  ('55555555-5555-5555-5555-555555555555', 'seoul', 'Bukhansan Baegundae Ridge Hike',
   'Bukhansan National Park, Ui-dong entrance, Dobong-gu',
   'Outdoors',
   'Hiking to Baegundae Peak (836m) — the highest peak in Bukhansan. It''s a proper hike (3-4 hours round trip) with some scrambling near the top. Stunning views of Seoul from the summit. Bring hiking shoes, water, and snacks. Not for complete beginners.',
   NOW() + INTERVAL '19 days'),

  ('66666666-6666-6666-6666-666666666666', 'seoul', 'Gwangjang Market Food Tour',
   'Gwangjang Market, 88 Changgyeonggung-ro, Jongno-gu',
   'Food',
   'Guided self-tour of the food hall. We''ll each order different things and share — bindaetteok, mayak gimbap, nokdu jeon, and more. Bring cash (most stalls are cash only) and an appetite. Budget around 20,000-25,000 won. Perfect first-timer introduction to traditional Seoul market food.',
   NOW() + INTERVAL '14 days');


-- ============================================================
-- 10. MEETUP JOINS (fake attendees)
-- ============================================================

DO $$
DECLARE
  m1 UUID; m2 UUID; m3 UUID; m4 UUID; m5 UUID;
  s1 UUID; s2 UUID; s3 UUID; s4 UUID; s5 UUID;
BEGIN
  -- London meetup IDs
  SELECT id INTO m1 FROM meetups WHERE hub='london' AND name='Brunch & Borough Market Run' LIMIT 1;
  SELECT id INTO m2 FROM meetups WHERE hub='london' AND name='Tate Modern & South Bank Walk' LIMIT 1;
  SELECT id INTO m3 FROM meetups WHERE hub='london' AND name='British Library Study Day' LIMIT 1;
  SELECT id INTO m4 FROM meetups WHERE hub='london' AND name='Hampstead Heath Sunday Hike' LIMIT 1;
  SELECT id INTO m5 FROM meetups WHERE hub='london' AND name='Kingsland Road Pho Mile Dinner' LIMIT 1;

  -- Seoul meetup IDs
  SELECT id INTO s1 FROM meetups WHERE hub='seoul' AND name='Hongdae Weekend Social' LIMIT 1;
  SELECT id INTO s2 FROM meetups WHERE hub='seoul' AND name='Gyeongbokgung Palace Hanbok Tour' LIMIT 1;
  SELECT id INTO s3 FROM meetups WHERE hub='seoul' AND name='Starfield Library Study Session' LIMIT 1;
  SELECT id INTO s4 FROM meetups WHERE hub='seoul' AND name='Bukhansan Baegundae Ridge Hike' LIMIT 1;
  SELECT id INTO s5 FROM meetups WHERE hub='seoul' AND name='Gwangjang Market Food Tour' LIMIT 1;

  -- Borough Market: Jamie created it, Priya + Alex + Sofia join
  INSERT INTO meetup_joins (meetup_id, user_id) VALUES
    (m1, '33333333-3333-3333-3333-333333333333'),
    (m1, '44444444-4444-4444-4444-444444444444'),
    (m1, '22222222-2222-2222-2222-222222222222')
  ON CONFLICT DO NOTHING;

  -- Tate Modern: Sofia created it, Jamie + Alex join
  INSERT INTO meetup_joins (meetup_id, user_id) VALUES
    (m2, '11111111-1111-1111-1111-111111111111'),
    (m2, '33333333-3333-3333-3333-333333333333')
  ON CONFLICT DO NOTHING;

  -- British Library: Jamie created it, Priya + Sofia join
  INSERT INTO meetup_joins (meetup_id, user_id) VALUES
    (m3, '22222222-2222-2222-2222-222222222222'),
    (m3, '44444444-4444-4444-4444-444444444444')
  ON CONFLICT DO NOTHING;

  -- Hampstead Heath: Alex created it, all others join + Minjun visiting
  INSERT INTO meetup_joins (meetup_id, user_id) VALUES
    (m4, '11111111-1111-1111-1111-111111111111'),
    (m4, '22222222-2222-2222-2222-222222222222'),
    (m4, '44444444-4444-4444-4444-444444444444'),
    (m4, '55555555-5555-5555-5555-555555555555')
  ON CONFLICT DO NOTHING;

  -- Pho Mile: Priya created it, Jamie + Alex + Sofia join
  INSERT INTO meetup_joins (meetup_id, user_id) VALUES
    (m5, '11111111-1111-1111-1111-111111111111'),
    (m5, '33333333-3333-3333-3333-333333333333'),
    (m5, '44444444-4444-4444-4444-444444444444')
  ON CONFLICT DO NOTHING;

  -- Hongdae Social: Minjun created it, Soyeon + Daniel join
  INSERT INTO meetup_joins (meetup_id, user_id) VALUES
    (s1, '66666666-6666-6666-6666-666666666666'),
    (s1, '77777777-7777-7777-7777-777777777777')
  ON CONFLICT DO NOTHING;

  -- Hanbok Tour: Soyeon created it, Minjun + Daniel join + Sofia visiting
  INSERT INTO meetup_joins (meetup_id, user_id) VALUES
    (s2, '55555555-5555-5555-5555-555555555555'),
    (s2, '77777777-7777-7777-7777-777777777777'),
    (s2, '44444444-4444-4444-4444-444444444444')
  ON CONFLICT DO NOTHING;

  -- Starfield Library: Daniel created it, Minjun + Soyeon join
  INSERT INTO meetup_joins (meetup_id, user_id) VALUES
    (s3, '55555555-5555-5555-5555-555555555555'),
    (s3, '66666666-6666-6666-6666-666666666666')
  ON CONFLICT DO NOTHING;

  -- Bukhansan Hike: Minjun created it, Daniel + Soyeon join
  INSERT INTO meetup_joins (meetup_id, user_id) VALUES
    (s4, '77777777-7777-7777-7777-777777777777'),
    (s4, '66666666-6666-6666-6666-666666666666')
  ON CONFLICT DO NOTHING;

  -- Gwangjang Food Tour: Soyeon created it, all Seoul users join + Alex visiting
  INSERT INTO meetup_joins (meetup_id, user_id) VALUES
    (s5, '55555555-5555-5555-5555-555555555555'),
    (s5, '77777777-7777-7777-7777-777777777777'),
    (s5, '33333333-3333-3333-3333-333333333333')
  ON CONFLICT DO NOTHING;
END $$;


-- ============================================================
-- 11. CITY GUIDE PLACES — London (delete duplicates first)
-- ============================================================

DELETE FROM places WHERE hub = 'london' AND name IN (
  'The Monocle Café', 'British Library', 'Borough Market',
  'Hampstead Heath', 'Portobello Road Market'
);

INSERT INTO places (hub, name, category, description, maps_url) VALUES

  ('london', 'The Monocle Café', 'Cafe',
   'The London outpost of the iconic global culture magazine. Excellent specialty coffee, great magazine selection on the shelves, and a calm atmosphere that''s perfect for slow mornings. Sit-in only — no takeaway. Very Marylebone.',
   'https://maps.google.com/?q=The+Monocle+Cafe+18+Chiltern+Street+London'),

  ('london', 'British Library', 'Library',
   'One of the world''s great research libraries with stunning reading rooms open to all. The Sir John Ritblat Gallery has free access to original manuscripts including the Magna Carta, Beatles lyrics, and da Vinci notebooks. Get a Reader Pass for the main collection. The Piazza cafe is a great study spot too.',
   'https://maps.google.com/?q=British+Library+96+Euston+Road+London'),

  ('london', 'Borough Market', 'Food',
   'London''s oldest and most famous food market — open Thursday to Saturday near London Bridge. World-class street food from around 100 traders: raclette, Sri Lankan curries, Ethiopian injera, artisan cheeses, freshly baked bread. Budget £12-18 for lunch. Packed on Saturdays; Thursday morning is calmer.',
   'https://maps.google.com/?q=Borough+Market+8+Southwark+Street+London'),

  ('london', 'Hampstead Heath', 'Park',
   'London''s wildest and most beautiful park — 790 acres of ancient woodland, swimming ponds, and wide open meadows. Parliament Hill at the top offers the best panoramic view of central London. Bring a picnic in summer. The mixed bathing pond is a Londoner''s secret for warm days.',
   'https://maps.google.com/?q=Hampstead+Heath+London+NW3'),

  ('london', 'Portobello Road Market', 'Shopping',
   'Notting Hill''s famous antiques and vintage market, best on Saturday mornings. Over 1,000 dealers selling everything from Victorian jewellery to vintage Levi''s to rare books. The surrounding streets are equally good — browse the independent boutiques on Westbourne Grove. Come before 11am to avoid peak crowds.',
   'https://maps.google.com/?q=Portobello+Road+Market+London+W11');


-- ============================================================
-- 12. CITY GUIDE PLACES — Seoul (delete duplicates first)
-- ============================================================

DELETE FROM places WHERE hub = 'seoul' AND name IN (
  'Café Bora', 'Gwangjang Market', 'National Library of Korea',
  'Bukhansan National Park', 'Myeongdong'
);

INSERT INTO places (hub, name, category, description, maps_url) VALUES

  ('seoul', 'Café Bora', 'Cafe',
   'Seoul''s most iconic specialty cafe, famous for its purple boba lattes made with Korean taro. Located in the heart of Insadong, the minimal interior and pastel aesthetic has made it famous worldwide. Expect a short queue on weekends — it moves fast. Try the horang-i boba (tiger boba) or the signature purple latte.',
   'https://map.naver.com/v5/search/카페보라+인사동'),

  ('seoul', 'Gwangjang Market', 'Food',
   'Seoul''s oldest and most authentic traditional market, open since 1905. The underground food hall is a bucket-list experience: bindaetteok (mung bean pancakes), mayak gimbap (addictive mini rice rolls), raw marinated beef (육회), and fresh mandu dumplings. Cash only at most stalls. Budget 15,000-20,000 KRW for a full spread.',
   'https://map.naver.com/v5/search/광장시장'),

  ('seoul', 'National Library of Korea', 'Library',
   'One of Asia''s largest research libraries in Seocho, Gangnam. Free access to reading rooms with your student ID (register at the front desk on first visit). Excellent Wi-Fi, laptop-friendly study areas, quiet zones, lockers, and a solid cafe. Open late on weekdays. A 10-minute walk from Seocho station.',
   'https://map.naver.com/v5/search/국립중앙도서관'),

  ('seoul', 'Bukhansan National Park', 'Park',
   'A national park rising dramatically out of the northern edge of Seoul, with granite peaks, ancient fortress walls, and Buddhist temples. The most popular route is to Baegundae Peak (836m), the highest point, with sweeping city views. Multiple trailheads accessible by subway. Wear proper shoes — the terrain is rocky.',
   'https://map.naver.com/v5/search/북한산국립공원'),

  ('seoul', 'Myeongdong', 'Shopping',
   'Seoul''s most famous shopping and street food district — a must-do at least once. The main pedestrian street is lined with K-beauty flagships (Innisfree, Etude, Olive Young), international brands, and street food stalls. Best visited on a weekday evening when it''s busy but not overwhelming. Great for budget skincare and cosmetics.',
   'https://map.naver.com/v5/search/명동');


-- ============================================================
-- 13. INTEL NOTES for City Guide places
-- ============================================================

-- Get place IDs and insert intel notes
DO $$
DECLARE
  monocle_id UUID;
  bl_id UUID;
  borough_id UUID;
  hampstead_id UUID;
  portobello_id UUID;
  bora_id UUID;
  gwangjang_id UUID;
  nlib_id UUID;
  bukhansan_id UUID;
  myeongdong_id UUID;
BEGIN
  SELECT id INTO monocle_id   FROM places WHERE hub='london' AND name='The Monocle Café' LIMIT 1;
  SELECT id INTO bl_id        FROM places WHERE hub='london' AND name='British Library' LIMIT 1;
  SELECT id INTO borough_id   FROM places WHERE hub='london' AND name='Borough Market' LIMIT 1;
  SELECT id INTO hampstead_id FROM places WHERE hub='london' AND name='Hampstead Heath' LIMIT 1;
  SELECT id INTO portobello_id FROM places WHERE hub='london' AND name='Portobello Road Market' LIMIT 1;
  SELECT id INTO bora_id      FROM places WHERE hub='seoul' AND name='Café Bora' LIMIT 1;
  SELECT id INTO gwangjang_id FROM places WHERE hub='seoul' AND name='Gwangjang Market' LIMIT 1;
  SELECT id INTO nlib_id      FROM places WHERE hub='seoul' AND name='National Library of Korea' LIMIT 1;
  SELECT id INTO bukhansan_id FROM places WHERE hub='seoul' AND name='Bukhansan National Park' LIMIT 1;
  SELECT id INTO myeongdong_id FROM places WHERE hub='seoul' AND name='Myeongdong' LIMIT 1;

  -- London intel notes
  INSERT INTO intel_notes (place_id, author_id, note) VALUES
    (monocle_id, '11111111-1111-1111-1111-111111111111',
     'Don''t come here to do work on your laptop — it''s a cafe for reading and conversation, not coworking. They''ll politely ask you to move on after about an hour during busy periods.'),
    (monocle_id, '33333333-3333-3333-3333-333333333333',
     'The filter coffee is exceptional. Ask for the single-origin option of the day. The oat milk flat white is also one of the best in London.'),
    (bl_id, '22222222-2222-2222-2222-222222222222',
     'Apply for a Reader Pass online before you go — you need it to access the main reading rooms and it takes a few days to process. Bring your student ID and proof of address.'),
    (bl_id, '44444444-4444-4444-4444-444444444444',
     'The free Treasures gallery is incredible — the Beatles'' handwritten lyrics, original Magna Carta, da Vinci notebooks. Takes about 45 mins and completely free, no booking needed.'),
    (borough_id, '33333333-3333-3333-3333-333333333333',
     'The raclette stand near the main entrance has a 20-min queue on Saturdays but it''s worth every second. Get a big portion — it''s filling and spectacular.'),
    (borough_id, '11111111-1111-1111-1111-111111111111',
     'Thursday morning is the insider tip — about 30% of the stalls, no tourist crowds, and the traders are more chatty. Great if you just want coffee and a pastry.'),
    (hampstead_id, '22222222-2222-2222-2222-222222222222',
     'Parliament Hill at the top has the best free view of central London. Walk up around golden hour (about 5-6pm in spring/autumn) for incredible light. Bring a picnic blanket.'),
    (portobello_id, '44444444-4444-4444-4444-444444444444',
     'The antique section is concentrated in the southern end near Notting Hill Gate station. Walk north toward Ladbroke Grove for more affordable vintage clothing and records.');

  -- Seoul intel notes
  INSERT INTO intel_notes (place_id, author_id, note) VALUES
    (bora_id, '55555555-5555-5555-5555-555555555555',
     'The queue is usually 15-20 minutes maximum and moves fast. Order at the window outside, pick up inside. The taro boba has a genuinely unique flavour — not overly sweet like most bubble tea shops.'),
    (bora_id, '66666666-6666-6666-6666-666666666666',
     'The Insadong location is the original and most beautiful. There''s also a Bukchon branch if you''re in that area. Seating inside is limited so many people take their drinks to the courtyard.'),
    (gwangjang_id, '77777777-7777-7777-7777-777777777777',
     'Cash only at almost every stall — there''s an ATM at the market entrance. Budget 15,000-20,000 KRW for a proper meal. The mayak gimbap stall in the middle of the main food hall has been there for over 40 years.'),
    (gwangjang_id, '55555555-5555-5555-5555-555555555555',
     'The silk and fabric section upstairs is worth browsing even if you don''t buy — it''s a completely different atmosphere from the food hall and very old-school Seoul.'),
    (nlib_id, '66666666-6666-6666-6666-666666666666',
     'Register with your passport and student ID on your first visit — takes about 10 minutes at the membership desk. After that you just scan your card. The 4th floor reading room has the best natural light.'),
    (bukhansan_id, '77777777-7777-7777-7777-777777777777',
     'The Ui-dong entrance is the least crowded and has a lovely approach through the forest before the main climb. Take subway line 4 to Susaek station or line 3 to Gupabal. Start before 9am on weekends to get parking/paths before the crowds.'),
    (myeongdong_id, '55555555-5555-5555-5555-555555555555',
     'Olive Young is the best spot for affordable K-beauty — the Myeongdong flagship has the widest selection in Seoul and staff who speak English and Chinese. Great for stocking up on skincare at lower-than-airport prices.');

END $$;


-- ============================================================
-- Done! Summary of seeded data:
-- 7 users (4 London: UCL, LSE, KCL, Imperial | 3 Seoul: Yonsei, SNU, KAIST)
-- 8 London posts + 7 Seoul posts with replies and likes
-- 5 London meetups + 5 Seoul meetups
-- 5 London city guide places + 5 Seoul city guide places
-- Intel notes on all 10 places
-- ============================================================
