# Authentication Setup Guide

## Overview

NoteAI now includes a complete authentication system with:
- User registration (sign up)
- Login with email and password
- Password reset (forgot password)
- User profile management
- Secure logout

## Features

### 1. Registration
- Create account with email and password
- Email verification (optional, configurable in Supabase)
- Password must be at least 6 characters
- Password confirmation validation

### 2. Login
- Sign in with email (username) and password
- Automatic session management
- Persistent login across page refreshes

### 3. Forgot Password
- Request password reset link via email
- Secure token-based reset
- Email sent to user's registered email

### 4. Profile Page
- View account information
- Email is the username (cannot be changed)
- Change password functionality
- Logout option

## Setup Instructions

### Step 1: Enable Email Auth in Supabase

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Providers**
3. Make sure **Email** provider is enabled
4. Configure email templates (optional):
   - Go to **Authentication** → **Email Templates**
   - Customize confirmation, password reset, and magic link emails

### Step 2: Configure Email Settings

1. In Supabase Dashboard, go to **Project Settings** → **Auth**
2. Configure these settings:

**Site URL**: `http://localhost:3000` (for development)
- For production: `https://your-domain.com`

**Redirect URLs**: Add these URLs:
- `http://localhost:3000`
- `http://localhost:3000/reset-password` (for password reset)
- For production, add your production URLs

**Email Confirmation**: 
- Toggle ON if you want users to verify email before login
- Toggle OFF for immediate access (recommended for development)

### Step 3: Update Database RLS Policies

Run this SQL in your Supabase SQL Editor to add user-specific Row Level Security:

```sql
-- Enable RLS on all tables (if not already enabled)
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can manage their own classes" ON classes;
DROP POLICY IF EXISTS "Users can manage their own notes" ON notes;
DROP POLICY IF EXISTS "Users can manage their own quiz results" ON quiz_results;
DROP POLICY IF EXISTS "Users can manage their own invitations" ON invitations;
DROP POLICY IF EXISTS "Users can manage their own reminders" ON reminders;

-- Add user_id column to tables
ALTER TABLE classes ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE invitations ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE reminders ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create indexes for user_id
CREATE INDEX IF NOT EXISTS idx_classes_user_id ON classes(user_id);
CREATE INDEX IF NOT EXISTS idx_invitations_user_id ON invitations(user_id);
CREATE INDEX IF NOT EXISTS idx_reminders_user_id ON reminders(user_id);

-- Create RLS policies for classes
CREATE POLICY "Users can view their own classes"
  ON classes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own classes"
  ON classes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own classes"
  ON classes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own classes"
  ON classes FOR DELETE
  USING (auth.uid() = user_id);

-- Create RLS policies for notes
CREATE POLICY "Users can view notes from their classes"
  ON notes FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM classes
    WHERE classes.id = notes.class_id
    AND classes.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert notes to their classes"
  ON notes FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM classes
    WHERE classes.id = notes.class_id
    AND classes.user_id = auth.uid()
  ));

CREATE POLICY "Users can update notes from their classes"
  ON notes FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM classes
    WHERE classes.id = notes.class_id
    AND classes.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete notes from their classes"
  ON notes FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM classes
    WHERE classes.id = notes.class_id
    AND classes.user_id = auth.uid()
  ));

-- Create RLS policies for quiz_results
CREATE POLICY "Users can view quiz results from their classes"
  ON quiz_results FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM classes
    WHERE classes.id = quiz_results.class_id
    AND classes.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert quiz results to their classes"
  ON quiz_results FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM classes
    WHERE classes.id = quiz_results.class_id
    AND classes.user_id = auth.uid()
  ));

-- Create RLS policies for invitations
CREATE POLICY "Users can manage their own invitations"
  ON invitations FOR ALL
  USING (auth.uid() = user_id);

-- Create RLS policies for reminders
CREATE POLICY "Users can manage their own reminders"
  ON reminders FOR ALL
  USING (auth.uid() = user_id);
```

### Step 4: Update Existing Data (If Applicable)

If you have existing data in your tables, you'll need to assign it to a user:

```sql
-- Get your user ID first
SELECT id FROM auth.users;

-- Update existing classes with your user ID
UPDATE classes SET user_id = 'your-user-id-here' WHERE user_id IS NULL;

-- Update existing invitations
UPDATE invitations SET user_id = 'your-user-id-here' WHERE user_id IS NULL;

-- Update existing reminders
UPDATE reminders SET user_id = 'your-user-id-here' WHERE user_id IS NULL;
```

### Step 5: Test the Authentication

1. Start your development server:
   ```bash
   npm run dev
   ```

2. You should see the login/register page

3. Test registration:
   - Click "Sign up"
   - Enter email and password
   - Check your email for verification (if enabled)

4. Test login:
   - Enter your credentials
   - You should be redirected to the dashboard

5. Test forgot password:
   - Click "Forgot password?"
   - Enter your email
   - Check your email for reset link

6. Test profile:
   - Click "Profile" in the sidebar
   - Try changing your password
   - Test logout

## Email Configuration (Optional)

For production, you should configure a custom SMTP server:

1. Go to **Project Settings** → **Auth** → **SMTP Settings**
2. Configure your email provider (SendGrid, Mailgun, etc.)
3. Test email delivery

For development, Supabase provides a default email service.

## Security Best Practices

1. **Password Requirements**:
   - Minimum 6 characters (can be increased)
   - Consider adding complexity requirements in production

2. **Email Verification**:
   - Enable for production to prevent fake accounts
   - Can be disabled for development

3. **Session Management**:
   - Sessions persist across page refreshes
   - Automatic token refresh handled by Supabase

4. **Row Level Security**:
   - Always keep RLS enabled
   - Users can only access their own data
   - Prevents unauthorized access

## Troubleshooting

### "Invalid login credentials"
- Check email and password are correct
- Ensure email is verified (if verification is enabled)
- Check Supabase Auth logs in dashboard

### "Email not confirmed"
- Check your email for verification link
- Resend verification email from Supabase dashboard
- Or disable email verification in Auth settings

### "Failed to send reset email"
- Check email exists in system
- Verify SMTP settings in Supabase
- Check email spam folder

### RLS Policy Errors
- Make sure all policies are created correctly
- Check that user_id columns exist on tables
- Verify you're logged in when testing

## Features

### Current
- Email/password authentication
- Password reset via email
- User profile management
- Secure logout
- Row Level Security

### Future Enhancements
- Social login (Google, GitHub)
- Two-factor authentication
- Account deletion
- Email change functionality
- Profile customization (name, avatar)

## Support

If you encounter issues:
1. Check Supabase Auth logs in dashboard
2. Verify all SQL scripts ran successfully
3. Test with a fresh account
4. Check browser console for errors
