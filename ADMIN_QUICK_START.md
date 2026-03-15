# Admin System - Quick Start Gide

## 🚀 Get Started in 5 Minutes

### 1. Access the Admin Panel

```
1. Go to Profile page
2. Look for "Admin Panel" button (blue button with crown icon)
3. Click to open Admin Drawer
4. Browse available admin modules
```

### 2. Understand Your Admin Level

```typescript
Your Level: [Check in Settings]

🏆 Super Admin
   - Access to EVERYTHING
   - Manage other admins
   - Approve/suspend anyone
   - Access all logs & analytics

⚙️ Operations Admin
   - Approve runners
   - Monitor deliveries
   - Manage storage
   - Cannot manage admins

✅ Compliance Admin
   - Verify user documents
   - Flag suspicious accounts
   - Cannot change admin roles
   - Cannot access infrastructure
```

### 3. First Task: Review Dashboard

Navigate to **Dashboard** tab:
- See total users, runners, businesses
- Check pending orders
- Quick access to main modules

### 4. Second Task: Approve First Runner

```
Path: Runners tab → Find pending runner → Click Approve

✓ Check their submitted:
  - Government ID
  - Address certification
  - Selfie verification
  - Emergency contact
✓ Click Approve
✓ They can now accept deliveries
```

### 5. Third Task: Review Your Last Action

```
Path: System Logs tab → Find your action

What's logged:
- Your name & ID
- What you did
- Who you did it to
- Exact timestamp
- Your IP address
```

---

## 📊 Dashboard Walkthrough

### Overview Tab
- **Total Users**: Everyone on platform
- **Active Runners**: Runners currently available
- **Active Businesses**: Verified business accounts
- **Completed Orders**: Successfully delivered packages

### Users Tab
- **Search**: Find users by name or email
- **View Status**: pending, approved, suspended, banned
- **Actions**: Suspend or ban (only you can decide)

### Runners Tab
- **Status Tracking**: pending → approved
- **Approve**: Click Approve to allow runner
- **Suspend**: Temporarily remove problematic runner
- **Ban**: Permanent removal for violations

### Businesses Tab
- **KYC Status**: none → pending → verified
- **Approve**: Verify business documents
- **Suspend**: Temporary business restriction
- **Management**: Track business performance

---

## ⚠️ Important Rules

### DO ✓
- ✓ Always document why you're taking action
- ✓ Review evidence before suspending/banning
- ✓ Communicate reasons to users when possible
- ✓ Check System Logs to see what you've done
- ✓ Ask Super Admin if unsure about decisions

### DON'T ✗
- ✗ Ban on first offense (suspend first)
- ✗ Leave suspension reasons blank
- ✗ Share your admin password with anyone
- ✗ Take actions without understanding the issue
- ✗ Re-suspend recently unsuspended users

---

## 🔑 Key Features by Admin Type

### Super Admin Features
```
✓ Add/Remove other admins
✓ Change admin roles
✓ Ban IP addresses
✓ Access all analytics
✓ Override any decision
✓ See all admin logs
✓ Manage platform settings
```

### Operations Admin Features
```
✓ Approve/suspend runners
✓ Monitor all deliveries
✓ Reassign runners to orders
✓ Manage storage inventory
✓ Resolve delivery disputes
✓ View metrics (no edit)
```

### Compliance Admin Features
```
✓ Review KYC documents
✓ Approve identities
✓ Flag suspicious accounts
✓ Temporary suspend users
✓ View user evidence
✓ Cannot change configurations
```

---

## 🎯 Common Workflows

### When a User Complains About a Runner

1. Go to **Disputes** tab
2. Find the complaint
3. Read what happened
4. Check runner's history:
   - Previous complaints?
   - Pattern of behavior?
   - First incident?
5. Make decision:
   - First incident → Suspend runner for 48 hours + training
   - Repeat offender → Ban + investigation
   - False claim → No action, monitor user

### Handling Suspicious Account

1. Go to **Users** tab
2. Find suspicious account
3. Review:
   - Verification status
   - Account age
   - Activity history
   - Previous complaints
4. Options:
   - Verify documents (Compliance)
   - Temporary suspend + review
   - Permanent ban if fraud detected
5. Document everything in notes

### Inviting a New Admin (Super Admin Only)

1. Click **Add Admin** button
2. Enter their email
3. Select admin level:
   - `operations_admin` for delivery/logistics
   - `compliance_admin` for verification
4. Send invite
5. They'll receive email with login link
6. After login, Super Admin must approve
7. They get admin button in their profile

---

## 💡 Pro Tips

### Organization
- Keep admin notes organized
- Use consistent terminology
- Document patterns not just incidents
- Reference previous actions when relevant

### Efficiency
- Use search to find users quickly
- Batch-process similar items
- Check logs before repeating actions
- Use filters for better overview

### Communication
- Tell users why they're suspended
- Give clear instructions for appeals
- Be professional in all notes
- Explain decisions briefly

### Safety
- Log out when stepping away
- Don't repeat the same action twice
- Verify before banning
- Always have reason recorded

---

## ❓ Quick FAQ

**Q: I suspended someone by mistake. Can I undo it?**
A: Yes! Go to Users tab, find them, click "Unsuspend" button. The suspension is logged for your records.

**Q: Where can I see what I've done?**
A: System Logs tab shows all your actions with timestamps and details.

**Q: Can I delete an action from logs?**
A: No. Logs are permanent audit trails. You can only add notes explaining the context.

**Q: What if I'm not sure about a decision?**
A: There's always an option to escalate. Ask Super Admin for guidance.

**Q: Do users know I suspended them?**
A: If sending notifications is enabled, yes. Otherwise, you must contact them separately.

**Q: How long does a suspension last?**
A: You decide when you suspend them. Typical  is 24-72 hours. You can unsuspend earlier or extend if needed.

**Q: Can I ban someone temporarily?**
A: No, bans are permanent. Use suspension for temporary removal. Reserve bans for serious violations only.

**Q: What happens to their active orders if suspended?**
A: They're reassigned to other runners/admins to maintain service continuity.

---

##📍 Admin Control Center Map

```
Admin Panel (Button on Profile)
    ├── Dashboard (Overview & stats)
    ├── Users (Manage all users)
    ├── Runners (Approve/suspend runners)
    ├── Businesses (KYC verification)
    ├── Deliveries (Monitor orders)
    ├── Storage (Manage inventory)
    ├── Disputes (Resolve conflicts)
    ├── Analytics (View metrics)
    ├── System Logs (Audit trail)
    ├── Admin Mgmt (Super admin only)
    ├── Security (IP & access control)
    └── Settings (Your account)
```

---

## ✉️ Need Help?

1. **Check Documentation**: Full guide in `ADMIN_DOCUMENTATION.md`
2. **Check Logs**: See what happened in System Logs
3. **Ask Super Admin**: Escalate complex decisions
4. **Check Inbox**: You may have admin notifications

---

## 🎓 Admin Training Path

**Week 1**: Learn platform basics
- [ ] Visit Dashboard
- [ ] Understand admin levels
- [ ] Review System Logs

**Week 2**: Start small
- [ ] Approve first runner
- [ ] Suspend one user (with Super Admin approval)
- [ ] Review your actions

**Week 3**: Build confidence
- [ ] Handle disputes
- [ ] Manage runners independently
- [ ] Document your decisions

**Week 4**: Main responsibilities
- [ ] Take on primary admin duties
- [ ] Train other admins
- [ ] Mentor new team members

---

**Welcome to the Pick'em Admin Team! 🚀**

You're now part of the team that keeps our platform running smoothly and safely. 

Remember: With great power comes great responsibility. Every decision you make affects real users and businesses. Think twice, act once.

Good luck! 💪
