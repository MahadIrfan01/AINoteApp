# Troubleshooting Guide

## Common Issues and Solutions

### 1. "Module not found" or Import Errors
**Solution**: Make sure you've run `npm install` after any package.json changes.

### 2. Environment Variables Not Loading
**Check**:
- `.env.local` file exists in the root directory
- File contains all three variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `GEMINI_API_KEY`
- Restart the dev server after changing `.env.local`

### 3. Supabase Connection Errors
**Check**:
- Your Supabase URL is correct (should be `https://njuycohvfnechznmcuiq.supabase.co`)
- Your anon key is correct
- You've run the SQL schema in Supabase SQL Editor
- Tables `classes` and `notes` exist in your database

### 4. Blank Page or White Screen
**Check browser console** (F12) for errors:
- Look for any red error messages
- Check Network tab for failed API calls

### 5. Port Already in Use
**Solution**: 
```bash
# Kill the process on port 3000
npx kill-port 3000
# Or use a different port
npm run dev -- -p 3001
```

### 6. TypeScript Errors
**Solution**: 
```bash
npm run build
```
This will show any TypeScript compilation errors.

### 7. Quiz Generation Not Working
**Check**:
- Gemini API key is correct
- API key has proper permissions
- Check browser console Network tab for `/api/generate-quiz` errors

## Quick Diagnostic Steps

1. **Verify environment variables are loaded**:
   - Check browser console for any Supabase connection errors
   - Look for "API key is not configured" messages

2. **Check Supabase tables exist**:
   - Go to Supabase Dashboard > Table Editor
   - You should see `classes` and `notes` tables

3. **Verify the dev server is running**:
   - Should see "Ready" message in terminal
   - Should be accessible at http://localhost:3000

4. **Check for build errors**:
   ```bash
   npm run build
   ```

## Getting Help

If you're still having issues, please provide:
1. The exact error message (from terminal or browser console)
2. What happens when you try to access the app
3. Any console errors (F12 in browser)
