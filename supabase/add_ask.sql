-- Questions asked to hub students
CREATE TABLE IF NOT EXISTS hub_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  hub TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  title TEXT NOT NULL,
  body TEXT DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE hub_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can read questions"
ON hub_questions FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can post questions"
ON hub_questions FOR INSERT TO authenticated
WITH CHECK (auth.uid() = author_id);

-- Replies to questions
CREATE TABLE IF NOT EXISTS hub_question_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID REFERENCES hub_questions(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE hub_question_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can read replies"
ON hub_question_replies FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can post replies"
ON hub_question_replies FOR INSERT TO authenticated
WITH CHECK (auth.uid() = author_id);
