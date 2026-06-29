-- ============================================================
-- LONDON Places Seed Data
-- ============================================================

INSERT INTO places (hub, name, category, description, maps_url) VALUES
-- Cafes
('london', 'Monmouth Coffee Borough Market', 'Cafe', 'Legendary specialty coffee roaster with a cosy Borough Market location. Queue early on weekends — it''s worth it. The single-origin pour-overs are exceptional.', 'https://maps.google.com/?q=Monmouth+Coffee+Borough+Market+London'),
('london', 'Pavilion Cafe Victoria Park', 'Cafe', 'Lakeside cafe in the heart of Victoria Park, East London. Great for a weekend brunch with flat whites and avocado toast while watching the swans.', 'https://maps.google.com/?q=Pavilion+Cafe+Victoria+Park+London'),
('london', 'Watch House Bermondsey', 'Cafe', 'Set inside a converted church watch house. Beautiful interiors, excellent espresso, and surprisingly quiet for a London cafe.', 'https://maps.google.com/?q=Watch+House+Coffee+Bermondsey+London'),
('london', 'Curators Coffee', 'Cafe', 'A small-batch roaster in the City. Popular with professionals and students alike. Try the nitro cold brew on warmer days.', 'https://maps.google.com/?q=Curators+Coffee+London'),

-- Libraries
('london', 'British Library', 'Library', 'One of the world''s great libraries. Free to enter, incredible reading rooms, and regular exhibitions. Get a reader pass to access the main collection. Great for long study sessions.', 'https://maps.google.com/?q=British+Library+London'),
('london', 'Senate House Library', 'Library', 'Stunning Art Deco building in Bloomsbury. Free access for many university students. The architecture alone is worth visiting — the view from upper floors is iconic.', 'https://maps.google.com/?q=Senate+House+Library+London'),
('london', 'Wellcome Collection Library', 'Library', 'Free research library focused on medicine, life, and society. Amazing archive, comfortable reading room, and the best free museum in London is right downstairs.', 'https://maps.google.com/?q=Wellcome+Collection+London'),

-- Parks
('london', 'Victoria Park', 'Park', 'East London''s favourite park — lido in summer, farmers'' market on Sundays, and beautiful waterways. Way less touristy than Hyde Park. Perfect for picnics.', 'https://maps.google.com/?q=Victoria+Park+London'),
('london', 'Primrose Hill', 'Park', 'Small hill with arguably the best panoramic view of central London. Quiet on weekday mornings. Bring a coffee from the cafe at the base.', 'https://maps.google.com/?q=Primrose+Hill+London'),
('london', 'Greenwich Park', 'Park', 'Historic Royal Park with the Observatory, meridian line, and sweeping views of the city. Combine with a visit to the Cutty Sark. Take the DLR.', 'https://maps.google.com/?q=Greenwich+Park+London'),

-- Food
('london', 'Borough Market', 'Food', 'London''s most famous food market, open Thursday to Saturday. World-class street food, cheeses, and produce. Budget £15-25 for a great lunch. Get the raclette.', 'https://maps.google.com/?q=Borough+Market+London'),
('london', 'Maltby Street Market', 'Food', 'The cooler, less touristy alternative to Borough Market. Open weekends under the railway arches in Bermondsey. Better value, same quality.', 'https://maps.google.com/?q=Maltby+Street+Market+London'),
('london', 'Kingsland Road Vietnamese Strip', 'Food', 'Known as "Pho Mile" — a stretch of affordable, authentic Vietnamese restaurants in Shoreditch/Dalston. Excellent value for students, open late.', 'https://maps.google.com/?q=Kingsland+Road+Vietnamese+London'),
('london', 'Dishoom King''s Cross', 'Food', 'Beloved Bombay-style cafe. The bacon naan breakfast is legendary. There''s always a queue but it moves fast. Book ahead for dinner.', 'https://maps.google.com/?q=Dishoom+Kings+Cross+London'),

-- Shopping
('london', 'Portobello Road Market', 'Shopping', 'Iconic Notting Hill market, best on Saturday mornings. Vintage clothing, antiques, and street food. Come before midday to avoid the tourist rush.', 'https://maps.google.com/?q=Portobello+Road+Market+London'),
('london', 'Brick Lane Market', 'Shopping', 'Sunday market in the heart of East London''s creative scene. Vintage fashion, independent designers, and great bagels. The surrounding area has excellent street art.', 'https://maps.google.com/?q=Brick+Lane+Market+London'),
('london', 'Westfield Stratford City', 'Shopping', 'Massive modern shopping centre right by Olympic Park. Every major high-street and mid-range brand. Best mall near Central and East London for student budgets.', 'https://maps.google.com/?q=Westfield+Stratford+City+London');


-- ============================================================
-- SEOUL Places Seed Data
-- ============================================================

INSERT INTO places (hub, name, category, description, maps_url) VALUES
-- Cafes
('seoul', 'Fritz Coffee Company Mapo', 'Cafe', 'A Seoul institution — artisan coffee in a beautifully converted building in Mapo. Always worth the queue. Their croissants are exceptional. Card payments accepted.', 'https://naver.me/FritzCoffeeMapo'),
('seoul', 'Cafe Onion Anguk', 'Cafe', 'Stunning cafe in a converted traditional Korean home (hanok). Instagram-famous for good reason — the interiors are genuinely beautiful. Try the onion bread.', 'https://naver.me/CafeOnionAnguk'),
('seoul', 'Anthracite Hapjeong', 'Cafe', 'Specialty roastery cafe inside a converted industrial space in Hapjeong. Great pour-overs and cold brew. Good wifi for studying. Popular with creatives.', 'https://naver.me/AnthraciteHapjeong'),
('seoul', 'Felt Bukchon', 'Cafe', 'Calm specialty cafe in the Bukchon hanok village area. Excellent espresso, minimal design, and genuinely quiet. Ideal for reading or writing.', 'https://naver.me/FeltBukchon'),

-- Libraries
('seoul', 'National Library of Korea', 'Library', 'Massive national library in Seocho with excellent facilities for students. Free day-use reading rooms, great wifi, lockers, and a solid cafe. Requires ID registration.', 'https://naver.me/NationalLibraryKorea'),
('seoul', 'Seoul Metropolitan Library', 'Library', 'Beautiful historic library in City Hall Plaza. The reading room in the original 1926 building is stunning. Open to all, no registration required for reading rooms.', 'https://naver.me/SeoulMetroLibrary'),
('seoul', 'Starfield Library COEX', 'Library', 'The famous two-storey bookshelf library inside COEX Mall in Gangnam. Free to browse, great for photos, and excellent for a study break. Connected to subway.', 'https://naver.me/StarfieldLibraryCOEX'),

-- Parks
('seoul', 'Bukhansan National Park', 'Park', 'Seoul''s most spectacular nature getaway — granite peaks rising right out of the city. Multiple trails from beginner to expert. Take the subway to Gupabal station.', 'https://naver.me/BukhansanNationalPark'),
('seoul', 'Seoul Forest (서울숲)', 'Park', 'Beautiful 35-hectare park in Seongsu. Great for cycling, picnics, and deer spotting. Free bike rentals available. Particularly stunning in spring (cherry blossoms) and autumn.', 'https://naver.me/SeoulForest'),
('seoul', 'Namsan Park & N Seoul Tower', 'Park', 'Forested hill in central Seoul with the iconic N Tower at the top. Easy cable car access or a 40-minute walk. Padlock fence at the top is a must-see.', 'https://naver.me/NamsanPark'),
('seoul', 'Hangang Park Yeouido', 'Park', 'The riverside park culture of Seoul at its best. Rent bikes, hire a swan boat, or just lie on the grass. The night views of the Han River are incredible.', 'https://naver.me/HangangParkYeouido'),

-- Food
('seoul', 'Gwangjang Market', 'Food', 'Seoul''s oldest traditional market. The food hall is unmissable — bindaetteok (mung bean pancakes), mayak gimbap, and raw marinated beef. Go hungry, come with cash.', 'https://naver.me/GwangjangMarket'),
('seoul', 'Tongin Market', 'Food', 'Charming traditional market in Jongno where you buy old-fashioned coins to exchange for traditional tteok, japchae, and snacks. A uniquely Seoul experience.', 'https://naver.me/ToninMarket'),
('seoul', 'Mangwon Market', 'Food', 'The local''s market in Mapo, popular with young Seoulites. Great street food stalls, fresh produce, and a vibrant atmosphere. Less touristy than Gwangjang.', 'https://naver.me/MangwonMarket'),
('seoul', 'Myeongdong Street Food Alley', 'Food', 'The classic Seoul street food experience — tteokbokki, hotteok, egg bread, and more. Open until late. Very touristy but genuinely delicious and very affordable.', 'https://naver.me/MyeongdongStreetFood'),

-- Shopping
('seoul', 'Hongdae Shopping Street', 'Shopping', 'The creative student district''s shopping street. Independent fashion, K-beauty, vintage, and streetwear. Best explored on foot. Lively at night with buskers.', 'https://naver.me/HongdaeShopping'),
('seoul', 'Dongdaemun Design Plaza (DDP)', 'Shopping', 'Zaha Hadid''s iconic building hosts rotating design markets. The night market runs outdoors around the building. Great for unique Korean designer finds.', 'https://naver.me/DDP'),
('seoul', 'Insadong Ssamziegil', 'Shopping', 'Quirky courtyard mall in Insadong with indie shops, Korean craft stores, and artisan food. Great for gifts and unique finds. The spiral walkway is a Seoul highlight.', 'https://naver.me/InsadongSsamziegil');
