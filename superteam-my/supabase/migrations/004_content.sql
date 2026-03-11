CREATE TABLE site_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL UNIQUE,
  content JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

INSERT INTO site_content (section, content) VALUES
('hero', '{"headline":"SUPERTEAM MALAYSIA","subheadline":"The home for Solana builders in Malaysia","cta_primary":"Join Community","cta_secondary":"Explore Opportunities"}'),
('stats', '{"members":500,"events":25,"projects":80,"bounties":150,"reach":"10K+"}'),
('faq', '[{"q":"What is Superteam Malaysia?","a":"Superteam Malaysia is the local chapter of the global Superteam network, dedicated to empowering builders, creators, founders, and talent in the Solana ecosystem across Malaysia."},{"q":"How do I join?","a":"Join our Telegram community, follow us on Twitter/X @SuperteamMY, and start participating in bounties on Superteam Earn."},{"q":"Do I need to be a developer?","a":"Not at all. We welcome designers, content creators, growth marketers, business developers, and anyone passionate about Web3."},{"q":"What opportunities are available?","a":"Bounties, grants, hackathons, job referrals, mentorship, and direct connections to top Solana projects."},{"q":"How can projects collaborate?","a":"Sponsor bounties, host events, post on Superteam Earn, or reach out via Telegram for partnerships."}]');

CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
