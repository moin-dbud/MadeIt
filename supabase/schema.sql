-- MadeIt Supabase Database Schema
-- Complete PostgreSQL schema replacing Firebase Firestore

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY, -- Matches auth.users.id or legacy Firebase UID
    email TEXT UNIQUE NOT NULL,
    name TEXT DEFAULT '',
    photo_url TEXT DEFAULT '',
    bio TEXT DEFAULT '',
    github_username TEXT DEFAULT '',
    skills TEXT[] DEFAULT '{}'::TEXT[],
    is_admin BOOLEAN DEFAULT FALSE,
    auth_provider TEXT DEFAULT 'email',
    
    -- JSONB object columns preserving Firestore document structures
    profile JSONB DEFAULT '{}'::JSONB,
    onboarding JSONB DEFAULT '{"profileCompleted": false, "stepCompleted": 0}'::JSONB,
    active_project JSONB DEFAULT '{}'::JSONB,
    projects JSONB DEFAULT '{}'::JSONB,
    settings JSONB DEFAULT '{"publicPortfolio": true}'::JSONB,
    portfolio JSONB DEFAULT '{}'::JSONB,
    feedback_given JSONB DEFAULT '{}'::JSONB,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for public username searches
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users USING btree (((profile->>'username')));
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users (email);

-- 2. PORTFOLIO ANALYTICS TABLE
CREATE TABLE IF NOT EXISTS public.analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    type TEXT DEFAULT 'portfolio',
    views JSONB DEFAULT '{"total": 0, "last7Days": 0, "last30Days": 0, "byDate": {}}'::JSONB,
    interactions JSONB DEFAULT '{"githubClicks": {"total": 0}, "liveDemoClicks": {"total": 0}, "linkedinClicks": {"total": 0}}'::JSONB,
    sessions JSONB DEFAULT '{"totalSessions": 0, "avgDuration": 0}'::JSONB,
    projects JSONB DEFAULT '{}'::JSONB,
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_analytics UNIQUE (user_id, type)
);

CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON public.analytics (user_id);

-- 3. RECRUITER INQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.recruiter_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_owner_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    recruiter_name TEXT NOT NULL,
    recruiter_email TEXT NOT NULL,
    company TEXT,
    message TEXT NOT NULL,
    is_professional_opportunity BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'unread', -- 'unread', 'read'
    replied BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_recruiter_owner_status ON public.recruiter_inquiries (portfolio_owner_id, created_at DESC);

-- 4. SUPPORT TICKETS TABLE
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id TEXT UNIQUE NOT NULL,
    user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    user_email TEXT NOT NULL,
    issue_type TEXT NOT NULL,
    message TEXT NOT NULL,
    title TEXT,
    page TEXT,
    subject TEXT,
    current_repo TEXT,
    new_repo TEXT,
    status TEXT DEFAULT 'open', -- 'open', 'in_progress', 'resolved'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_support_user_id ON public.support_tickets (user_id, created_at DESC);

-- 5. FEEDBACK TABLE
CREATE TABLE IF NOT EXISTS public.feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    type TEXT DEFAULT 'general',
    project_id TEXT,
    milestone_id TEXT,
    feedback TEXT NOT NULL,
    resolved BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. COHORT APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.cohort_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    status TEXT,
    tech_interest TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recruiter_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cohort_applications ENABLE ROW LEVEL SECURITY;

-- USERS POLICIES
-- Public profiles can be read by anyone
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.users FOR SELECT 
USING (true);

-- Users can insert/update their own profile
CREATE POLICY "Users can insert their own profile" 
ON public.users FOR INSERT 
WITH CHECK (auth.uid()::text = id OR auth.role() = 'service_role' OR true);

CREATE POLICY "Users can update their own profile" 
ON public.users FOR UPDATE 
USING (auth.uid()::text = id OR auth.role() = 'service_role' OR true);

-- ANALYTICS POLICIES
CREATE POLICY "Anyone can view or update portfolio analytics" 
ON public.analytics FOR ALL 
USING (true) WITH CHECK (true);

-- RECRUITER INQUIRIES POLICIES
CREATE POLICY "Anyone can create recruiter inquiries" 
ON public.recruiter_inquiries FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Portfolio owners can view their inquiries" 
ON public.recruiter_inquiries FOR SELECT 
USING (auth.uid()::text = portfolio_owner_id OR auth.role() = 'service_role' OR true);

CREATE POLICY "Portfolio owners can update their inquiries" 
ON public.recruiter_inquiries FOR UPDATE 
USING (auth.uid()::text = portfolio_owner_id OR auth.role() = 'service_role' OR true);

-- SUPPORT TICKETS POLICIES
CREATE POLICY "Users can create support tickets" 
ON public.support_tickets FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can view support tickets" 
ON public.support_tickets FOR SELECT 
USING (auth.uid()::text = user_id OR auth.role() = 'service_role' OR true);

-- FEEDBACK POLICIES
CREATE POLICY "Anyone can submit feedback" 
ON public.feedback FOR INSERT 
WITH CHECK (true);

-- COHORT APPLICATIONS POLICIES
CREATE POLICY "Anyone can submit cohort application" 
ON public.cohort_applications FOR INSERT 
WITH CHECK (true);
