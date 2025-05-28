-- Create users table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  preferred_language TEXT DEFAULT 'en',
  user_type TEXT DEFAULT 'reader',
  role_id INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create profiles table for extended user information
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  bio TEXT,
  website TEXT,
  location TEXT,
  phone TEXT,
  birth_date DATE,
  interests TEXT[],
  social_links JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create categories table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  name_en TEXT,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  parent_id INTEGER REFERENCES public.categories(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create articles table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.articles (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  featured_image TEXT,
  author_id UUID REFERENCES public.users(id),
  category_id INTEGER REFERENCES public.categories(id),
  status TEXT DEFAULT 'draft',
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create article tags table
CREATE TABLE IF NOT EXISTS public.article_tags (
  id SERIAL PRIMARY KEY,
  article_id INTEGER REFERENCES public.articles(id) ON DELETE CASCADE,
  tag_name TEXT NOT NULL,
  UNIQUE(article_id, tag_name)
);

-- Create comments table
CREATE TABLE IF NOT EXISTS public.comments (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  article_id INTEGER REFERENCES public.articles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  parent_id INTEGER REFERENCES public.comments(id),
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create likes table
CREATE TABLE IF NOT EXISTS public.likes (
  id SERIAL PRIMARY KEY,
  article_id INTEGER REFERENCES public.articles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(article_id, user_id)
);

-- Add RLS policies to tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_tags ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can read all users but only update their own
CREATE POLICY "Users can view all users" ON public.users
  FOR SELECT USING (true);
  
CREATE POLICY "Users can update own user" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);
  
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
  
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Article policies
CREATE POLICY "Published articles are viewable by everyone" ON public.articles
  FOR SELECT USING (status = 'published');
  
CREATE POLICY "Authors can CRUD their own articles" ON public.articles
  FOR ALL USING (auth.uid() = author_id);
  
CREATE POLICY "Admins can CRUD all articles" ON public.articles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );

-- Comment policies
CREATE POLICY "Approved comments are viewable by everyone" ON public.comments
  FOR SELECT USING (status = 'approved');
  
CREATE POLICY "Users can create comments" ON public.comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can update own comments" ON public.comments
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY "Users can delete own comments" ON public.comments
  FOR DELETE USING (auth.uid() = user_id);
  
CREATE POLICY "Admins can moderate all comments" ON public.comments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );

-- Like policies
CREATE POLICY "Likes are viewable by everyone" ON public.likes
  FOR SELECT USING (true);
  
CREATE POLICY "Users can like/unlike" ON public.likes
  FOR ALL USING (auth.uid() = user_id);

-- Category policies
CREATE POLICY "Categories are viewable by everyone" ON public.categories
  FOR SELECT USING (true);
  
CREATE POLICY "Admins can manage categories" ON public.categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );

-- Article tags policies
CREATE POLICY "Article tags are viewable by everyone" ON public.article_tags
  FOR SELECT USING (true);
  
CREATE POLICY "Authors can manage article tags" ON public.article_tags
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.articles
      WHERE articles.id = article_tags.article_id AND articles.author_id = auth.uid()
    )
  );
  
CREATE POLICY "Admins can manage all article tags" ON public.article_tags
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );

-- Create functions for real-time subscriptions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, created_at, updated_at)
  VALUES (NEW.id, NEW.email, NOW(), NOW());
  
  INSERT INTO public.profiles (id, created_at, updated_at)
  VALUES (NEW.id, NOW(), NOW());
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registrations
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
