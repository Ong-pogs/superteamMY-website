-- Seed members
INSERT INTO members (name, role, company, bio, skills, badges, is_featured, is_core_team, display_order) VALUES
('Amir Razak', 'Lead Developer', 'Solana Labs', 'Full-stack Solana developer building the future of DeFi in Southeast Asia.', ARRAY['Rust', 'TypeScript', 'DeFi'], ARRAY['Core Team', 'OG'], true, true, 1),
('Wei Lin Chen', 'Design Lead', 'Tensor', 'Crafting beautiful Web3 experiences. Previously at Grab and Shopee.', ARRAY['UI/UX', 'Figma', 'Brand'], ARRAY['Core Team'], true, true, 2),
('Priya Krishnan', 'Community Lead', 'Superteam', 'Growing the Solana community in Malaysia through events and education.', ARRAY['Community', 'Events', 'Growth'], ARRAY['Core Team', 'Community Star'], true, true, 3),
('Hafiz Ibrahim', 'Smart Contract Dev', 'Jupiter', 'Building secure and efficient programs on Solana. Anchor framework contributor.', ARRAY['Rust', 'Anchor', 'Security'], ARRAY['Builder'], true, false, 4),
('Sarah Tan', 'Content & Growth', 'Marinade', 'Content strategist helping Web3 projects tell their story.', ARRAY['Content', 'Marketing', 'DeFi'], ARRAY['Growth'], true, false, 5);

-- Seed partners
INSERT INTO partners (name, logo_url, website_url, category, display_order) VALUES
('Solana Foundation', '/images/partners/solana.svg', 'https://solana.com', 'ecosystem', 1),
('Jupiter', '/images/partners/jupiter.svg', 'https://jup.ag', 'defi', 2),
('Tensor', '/images/partners/tensor.svg', 'https://tensor.trade', 'nft', 3),
('Marinade', '/images/partners/marinade.svg', 'https://marinade.finance', 'defi', 4),
('Helius', '/images/partners/helius.svg', 'https://helius.dev', 'infra', 5),
('Phantom', '/images/partners/phantom.svg', 'https://phantom.app', 'wallet', 6);
