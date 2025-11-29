# Sign-Out Testing Guide

## Overview

This document describes how to test the sign-out functionality and what storage keys are cleared during the process.

## Manual Testing Steps

### Test 1: Basic Sign-Out Flow

1. **Sign in as User A**
   - Navigate to the site
   - Click "Sign up" or "Login"
   - Enter credentials and authenticate

2. **Add items to cart**
   - Add one or more items to the cart
   - Verify items appear in the cart drawer

3. **Sign out once**
   - Click "Sign Out" button in the cart drawer
   - If cart has items, confirm the sign-out in the modal
   - **Expected**: 
     - Button shows "Signing out..." while processing
     - Page redirects to homepage (`/`)
     - User is logged out

4. **Verify session is cleared**
   - Open browser DevTools Console
   - Run: `await supabase.auth.getSession()`
   - **Expected**: Returns `{ data: { session: null }, error: null }`

5. **Refresh the page**
   - Press F5 or Cmd+R / Ctrl+R
   - **Expected**: User remains logged out (no session restoration)

### Test 2: Multi-User Cart Isolation

1. **Sign in as User A**
   - Add items to cart (e.g., "Chai 1", "Chai 2")
   - Note the items in the cart

2. **Sign out**
   - Click "Sign Out"
   - **Expected**: Redirected to homepage, logged out

3. **Sign in as User B** (different account)
   - Sign in with different credentials
   - **Expected**: 
     - Cart is empty (User B's own cart, not User A's)
     - User B does not see User A's cart items

4. **Verify cart persistence**
   - Sign out as User B
   - Sign back in as User A
   - **Expected**: User A's cart items are restored from the database

### Test 3: Realtime Subscriptions Cleanup

1. **Sign in**
   - Open browser DevTools Console
   - Monitor for any realtime subscription errors

2. **Sign out**
   - Click "Sign Out"
   - **Expected**: 
     - No console errors about unsubscribed listeners
     - No lingering realtime connections

3. **Check console**
   - Look for any warnings or errors
   - **Expected**: Clean console, no subscription-related errors

### Test 4: Single-Click Sign-Out

1. **Sign in**
   - Ensure you're logged in

2. **Click "Sign Out" once**
   - **Expected**: 
     - Sign-out happens immediately
     - No need to click multiple times
     - Button is disabled during sign-out process

3. **Verify**
   - Check that you're redirected and logged out
   - **Expected**: One click is sufficient

### Test 5: Error Handling

1. **Simulate network issue** (optional - may require network throttling)
   - Sign in
   - Throttle network to "Offline" or "Slow 3G"
   - Attempt to sign out
   - **Expected**: 
     - Error message appears: "Sign-out failed, but you have been logged out locally..."
     - Local cleanup still occurs
     - Page redirects

## Storage Keys Cleared

During sign-out, the following storage keys are cleared:

### localStorage
- `amor-cart` - Anonymous user cart data
- `sb-*` - All Supabase-related keys (e.g., `sb-<project-ref>-auth-token`)
- Any key containing `supabase` or `auth-token`

### sessionStorage
- `sb-*` - All Supabase-related keys
- Any key containing `supabase` or `auth-token`

### Common Supabase Storage Keys
- `sb-<project-ref>-auth-token` - Main authentication token
- `sb-<project-ref>-auth-token.code_verifier` - PKCE code verifier
- Any other keys prefixed with `sb-` or containing `supabase`

## Verification Commands

### Check Session Status
```javascript
// In browser console
await supabase.auth.getSession()
// Should return: { data: { session: null }, error: null }
```

### Check Storage
```javascript
// Check localStorage
Object.keys(localStorage).filter(k => k.includes('sb-') || k.includes('supabase'))
// Should return: []

// Check sessionStorage
Object.keys(sessionStorage).filter(k => k.includes('sb-') || k.includes('supabase'))
// Should return: []
```

### Check User State
```javascript
// In browser console
await supabase.auth.getUser()
// Should return: { data: { user: null }, error: null }
```

## Expected Behavior Summary

✅ **Single click sign-out** - No multiple clicks required  
✅ **Instant logout** - Session cleared immediately  
✅ **No session restoration** - Refresh doesn't restore session  
✅ **Cart isolation** - Users see only their own carts  
✅ **Clean subscriptions** - No lingering realtime connections  
✅ **Error resilience** - Local cleanup even if network fails  
✅ **UI feedback** - Button shows "Signing out..." during process  

## Troubleshooting

### Issue: Session persists after sign-out
- **Check**: Verify all storage keys are cleared (use commands above)
- **Check**: Ensure `window.location.replace('/')` executes
- **Check**: Verify no auth listeners are restoring state

### Issue: Cart shows wrong user's items
- **Check**: Verify cart is keyed by `user.id` in database
- **Check**: Ensure in-memory cart is cleared on sign-out
- **Check**: Verify new user's cart loads from database

### Issue: Multiple clicks required
- **Check**: Ensure `signingOut` flag prevents duplicate calls
- **Check**: Verify button is disabled during sign-out
- **Check**: Check console for errors blocking sign-out

## Notes

- Cart data in the database is **preserved** on sign-out (not deleted)
- Only in-memory cart state is cleared
- The cart is keyed by `user.id`, so each user has their own cart
- Sign-out uses `window.location.replace('/')` to prevent back navigation to logged-in state

