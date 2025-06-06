-- SQL Script to create Taha and Burak users in Supabase Auth
-- Run this in the Supabase SQL Editor

-- Create Taha user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'taha@nawrasinchina.com',
  crypt('taha2024', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Taha"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- Create Burak user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'burak@nawrasinchina.com',
  crypt('burak2024', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Burak"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- Create corresponding identities for email authentication
INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM auth.users WHERE email = 'taha@nawrasinchina.com'),
  '{"sub": "' || (SELECT id FROM auth.users WHERE email = 'taha@nawrasinchina.com') || '", "email": "taha@nawrasinchina.com"}',
  'email',
  NOW(),
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  (SELECT id FROM auth.users WHERE email = 'burak@nawrasinchina.com'),
  '{"sub": "' || (SELECT id FROM auth.users WHERE email = 'burak@nawrasinchina.com') || '", "email": "burak@nawrasinchina.com"}',
  'email',
  NOW(),
  NOW(),
  NOW()
);

-- Verify the users were created
SELECT 
  email,
  created_at,
  email_confirmed_at,
  raw_user_meta_data->>'name' as name
FROM auth.users 
WHERE email IN ('taha@nawrasinchina.com', 'burak@nawrasinchina.com'); 