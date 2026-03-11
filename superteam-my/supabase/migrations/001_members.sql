CREATE TABLE members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  company TEXT,
  bio TEXT,
  avatar_url TEXT,
  twitter_url TEXT,
  skills TEXT[] DEFAULT '{}',
  achievements JSONB DEFAULT '[]',
  badges TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  is_core_team BOOLEAN DEFAULT false,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
