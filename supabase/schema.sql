-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  university TEXT NOT NULL DEFAULT '',
  hub TEXT CHECK (hub IN ('london', 'seoul')),
  base_hub TEXT CHECK (base_hub IN ('london', 'seoul')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  hub TEXT NOT NULL CHECK (hub IN ('london', 'seoul')),
  category TEXT NOT NULL CHECK (category IN ('Travel', 'Question', 'Social', 'Safety')),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Replies table
CREATE TABLE IF NOT EXISTS replies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Post likes table
CREATE TABLE IF NOT EXISTS post_likes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Meetups table
CREATE TABLE IF NOT EXISTS meetups (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  hub TEXT NOT NULL CHECK (hub IN ('london', 'seoul')),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Social', 'Outdoors', 'Food')),
  description TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Meetup joins table
CREATE TABLE IF NOT EXISTS meetup_joins (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  meetup_id UUID REFERENCES meetups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(meetup_id, user_id)
);

-- Places table (admin-seeded)
CREATE TABLE IF NOT EXISTS places (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  hub TEXT NOT NULL CHECK (hub IN ('london', 'seoul')),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Cafe', 'Library', 'Park', 'Food', 'Shopping')),
  description TEXT NOT NULL,
  maps_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Intel notes table
CREATE TABLE IF NOT EXISTS intel_notes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  place_id UUID REFERENCES places(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  note TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetups ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetup_joins ENABLE ROW LEVEL SECURITY;
ALTER TABLE places ENABLE ROW LEVEL SECURITY;
ALTER TABLE intel_notes ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by all authenticated users"
  ON profiles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Posts policies
CREATE POLICY "Posts are viewable by all authenticated users"
  ON posts FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create posts"
  ON posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own posts"
  ON posts FOR UPDATE TO authenticated USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own posts"
  ON posts FOR DELETE TO authenticated USING (auth.uid() = author_id);

-- Replies policies
CREATE POLICY "Replies are viewable by all authenticated users"
  ON replies FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create replies"
  ON replies FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can delete their own replies"
  ON replies FOR DELETE TO authenticated USING (auth.uid() = author_id);

-- Post likes policies
CREATE POLICY "Likes are viewable by all authenticated users"
  ON post_likes FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can add likes"
  ON post_likes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own likes"
  ON post_likes FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Meetups policies
CREATE POLICY "Meetups are viewable by all authenticated users"
  ON meetups FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create meetups"
  ON meetups FOR INSERT TO authenticated WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update their own meetups"
  ON meetups FOR UPDATE TO authenticated USING (auth.uid() = creator_id);

CREATE POLICY "Users can delete their own meetups"
  ON meetups FOR DELETE TO authenticated USING (auth.uid() = creator_id);

-- Meetup joins policies
CREATE POLICY "Meetup joins are viewable by all authenticated users"
  ON meetup_joins FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can join meetups"
  ON meetup_joins FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave meetups"
  ON meetup_joins FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Places policies (read-only for users, admin manages)
CREATE POLICY "Places are viewable by all authenticated users"
  ON places FOR SELECT TO authenticated USING (true);

-- Intel notes policies
CREATE POLICY "Intel notes are viewable by all authenticated users"
  ON intel_notes FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can add intel notes"
  ON intel_notes FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can delete their own intel notes"
  ON intel_notes FOR DELETE TO authenticated USING (auth.uid() = author_id);

-- ============================================================
-- Trigger: Auto-create profile on sign up
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Only insert if profile doesn't exist
  INSERT INTO public.profiles (id, email, name, university)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'name',
      SPLIT_PART(NEW.email, '@', 1)
    ),
    COALESCE(
      NEW.raw_user_meta_data->>'university',
      SPLIT_PART(SPLIT_PART(NEW.email, '@', 2), '.', 1)
    )
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
