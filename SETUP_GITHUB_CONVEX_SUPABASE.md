# Pick'em - Git & Integration Setup Guide

## ✅ Current Status

**Local Git Repository**: Initialized & Ready
- Branch: `master`
- Latest Commit: `feat: Add comprehensive Admin Control Center system`
- Working Tree: Clean ✓

```
Repository Location: c:\Users\USER\OneDrive\Desktop\havefunarena\Pick'em
Git Init Date: March 15, 2026
```

---

## 🔗 Connect to GitHub (Later)

When ready to push to GitHub, follow these steps:

### Step 1: Create Repository on GitHub
1. Go to [github.com/new](https://github.com/new)
2. Repository name: `pickem` (or similar)
3. Description: "Pick'em - Logistics Operating System"
4. Choose Public or Private
5. Click "Create repository"

### Step 2: Add Remote & Push

```powershell
cd c:\Users\USER\OneDrive\Desktop\havefunarena\Pick'em

# Add remote origin
git remote add origin https://github.com/YOUR_USERNAME/pickem.git

# Rename branch if needed (GitHub uses 'main' by default)
git branch -M master main

# Push to GitHub
git push -u origin main
```

### Step 3: Verify

```powershell
git remote -v
# Should show:
# origin  https://github.com/YOUR_USERNAME/pickem.git (fetch)
# origin  https://github.com/YOUR_USERNAME/pickem.git (push)
```

---

## 🗄️ Connect to Supabase (Database)

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign in or create account
3. Create new project
4. Note your:
   - Project URL
   - Anon Key
   - Service Role Key

### Step 2: Create Tables

```sql
-- After connecting, create these tables:

-- Admin Action Logs
CREATE TABLE admin_action_logs (
  id UUID PRIMARY KEY,
  admin_id TEXT NOT NULL,
  admin_name TEXT NOT NULL,
  action TEXT NOT NULL,
  target_user_id TEXT,
  target_user_email TEXT,
  details JSONB,
  timestamp TIMESTAMP,
  ip_address TEXT
);

-- Admin Security Events
CREATE TABLE admin_security_events (
  id UUID PRIMARY KEY,
  admin_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  description TEXT,
  ip_address TEXT,
  timestamp TIMESTAMP
);

-- Users (already exists, extend)
ALTER TABLE users ADD COLUMN admin_level TEXT;
ALTER TABLE users ADD COLUMN two_factor_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN ip_whitelist TEXT[];
ALTER TABLE users ADD COLUMN last_ip_address TEXT;
ALTER TABLE users ADD COLUMN suspension_reason TEXT;
ALTER TABLE users ADD COLUMN ban_reason TEXT;

-- Banned IPs
CREATE TABLE banned_ips (
  ip_address TEXT PRIMARY KEY,
  reason TEXT,
  banned_at TIMESTAMP,
  banned_by TEXT
);
```

### Step 3: Update Environment Variables

Create `.env.local`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_SUPABASE_SERVICE_ROLE=your_service_role_key_here
```

### Step 4: Replace API Calls

Replace localStorage calls in `src/services/api.ts`:

```typescript
// Before: localStorage
const getStoredUsers = (): User[] => {
  return JSON.parse(localStorage.getItem(USER_KEY) || '[]');
};

// After: Supabase
const getStoredUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase
    .from('users')
    .select('*');
  
  if (error) throw error;
  return data || [];
};
```

---

## ⚙️ Connect to Convex (Backend)

### Step 1: Create Convex Project
1. Go to [convex.dev](https://convex.dev)
2. Sign in or create account
3. Create new project
4. Get your Deployment URL

### Step 2: Install Convex

```powershell
npm install convex
npx convex auth
```

### Step 3: Create Convex Functions

```typescript
// convex/admin.ts
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

export const logAdminAction = mutation({
  args: {
    adminId: v.string(),
    action: v.string(),
    targetUserId: v.optional(v.string()),
    details: v.any(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("admin_action_logs", {
      adminId: args.adminId,
      action: args.action,
      targetUserId: args.targetUserId,
      details: args.details,
      timestamp: new Date(),
    });
  },
});

export const getAdminLogs = query({
  args: { adminId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("admin_action_logs")
      .filter(q => q.eq(q.field("adminId"), args.adminId))
      .collect();
  },
});
```

### Step 4: Update Environment

```
VITE_CONVEX_URL=https://your-team-name.convex.cloud
```

### Step 5: Use in App

```typescript
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

// In component:
const logAction = useMutation(api.admin.logAdminAction);
const logs = useQuery(api.admin.getAdminLogs, { adminId: user.id });
```

---

## 📋 Integration Checklist

- [ ] GitHub repository created
- [ ] Remote origin added
- [ ] Code pushed to GitHub
- [ ] Supabase project created
- [ ] Database tables created
- [ ] Environment variables set (.env.local)
- [ ] API methods updated to use Supabase
- [ ] Convex project created
- [ ] Convex functions defined
- [ ] Frontend connected to Convex
- [ ] Tested admin actions end-to-end
- [ ] Logs appearing in Supabase
- [ ] All systems working together

---

## 🚀 Development Commands

```powershell
# Start development server
npm run dev

# Build for production
npm run build

# Deploy to production
npm run build && npm run preview

# Push changes to GitHub
git add .
git commit -m "your message"
git push origin main

# Check git status
git status

# View commit history
git log --oneline
```

---

## 📁 File Structure Summary

```
Pick'em/
├── .git/                          # Git repository (initialized)
├── src/
│   ├── types.ts                   # Extended with admin types
│   ├── lib/
│   │   └── rbac.ts                # RBAC permission system
│   ├── contexts/
│   │   └── AdminContext.tsx       # Admin context provider
│   ├── components/
│   │   └── AdminDrawer.tsx        # Admin drawer component
│   ├── pages/
│   │   ├── AdminDashboard.tsx     # Admin dashboard
│   │   └── Profile.tsx            # Updated with admin button
│   └── services/
│       └── api.ts                 # Extended API methods
├── ADMIN_DOCUMENTATION.md         # User guide
├── ADMIN_DEVELOPER_GUIDE.md       # Developer guide
├── ADMIN_QUICK_START.md           # Quick start guide
├── ADMIN_IMPLEMENTATION_SUMMARY.md # Project summary
└── .gitignore                     # Git exclusions

Next to add (after Supabase/Convex):
├── convex/                        # Convex backend functions
├── .env.local                     # Environment variables
└── supabase/                      # Supabase migrations
```

---

## 🔑 Important Notes

### Before Pushing to GitHub
- [ ] Remove any sensitive data from code
- [ ] Make sure .env files are in .gitignore
- [ ] Review .gitignore contains all necessary entries
- [ ] All tests passing
- [ ] Documentation is complete

### Security Checklist
- [ ] Never commit .env files
- [ ] Never commit API keys
- [ ] Review git history before pushing
- [ ] Use .gitignore for secrets
- [ ] Consider git-secrets for protection

### Production Deployment
- [ ] All tests passing
- [ ] Code review completed
- [ ] Documentation updated
- [ ] Database backups in place
- [ ] Rollback plan ready
- [ ] Monitoring configured
- [ ] Error tracking setup (Sentry, etc.)

---

## 📞 Quick Reference

### Check Current Git Status
```powershell
git status
git log --oneline
git remote -v
```

### Make Changes & Commit
```powershell
git add .
git commit -m "descriptive message"
git push origin main
```

### Create Feature Branch
```powershell
git checkout -b feature/admin-enhancements
# Make changes
git add .
git commit -m "add enhancements"
git push origin feature/admin-enhancements
```

---

**Setup Date:** March 15, 2026
**Ready to Connect:** ✅ Yes
**Next Steps:** Connect GitHub → Supabase → Convex

Good luck! 🚀
