CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free','starter','alpha')),
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  subscription_status TEXT DEFAULT 'inactive',
  subscription_end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE signals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  month TEXT NOT NULL UNIQUE,
  positions JSONB NOT NULL,
  capital NUMERIC,
  return_pct NUMERIC,
  return_eur NUMERIC,
  drawdown NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE signal_emails (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  month TEXT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  recipients_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'sent'
);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

ALTER TABLE signals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view signals" ON signals
  FOR SELECT USING (auth.role() = 'authenticated');
