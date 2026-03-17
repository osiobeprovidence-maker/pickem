import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// User queries
export const getUser = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const users = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
      .collect();
    return users[0] ?? null;
  },
});

export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

export const getUsersByRole = query({
  args: { role: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", args.role))
      .collect();
  },
});

export const getAdminUsers = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", "admin"))
      .collect();
    return users.sort((a, b) => {
      if (a.admin_level === "super_admin") return -1;
      if (b.admin_level === "super_admin") return 1;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  },
});

// User mutations
export const createUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    role: v.string(),
    status: v.string(),
    hasPassword: v.boolean(),
    password: v.optional(v.string()),
    lastMagicLogin: v.optional(v.string()),
    email_verified: v.boolean(),
    phone_verified: v.optional(v.boolean()),
    verification_cleared: v.optional(v.boolean()),
    admin_level: v.optional(v.string()),
    invited_by: v.optional(v.string()),
    business_id: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.db.insert("users", {
      name: args.name,
      email: args.email.toLowerCase(),
      role: args.role,
      status: args.status,
      created_at: new Date().toISOString(),
      hasPassword: args.hasPassword,
      password: args.password,
      lastMagicLogin: args.lastMagicLogin,
      email_verified: args.email_verified,
      phone_verified: args.phone_verified ?? false,
      verification_cleared: args.verification_cleared ?? false,
      admin_level: args.admin_level,
      invited_by: args.invited_by,
      business_id: args.business_id,
    });
    return userId;
  },
});

export const updateUser = mutation({
  args: {
    id: v.id("users"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    role: v.optional(v.string()),
    status: v.optional(v.string()),
    hasPassword: v.optional(v.boolean()),
    password: v.optional(v.string()),
    lastMagicLogin: v.optional(v.string()),
    email_verified: v.optional(v.boolean()),
    phone_verified: v.optional(v.boolean()),
    verification_cleared: v.optional(v.boolean()),
    admin_level: v.optional(v.string()),
    invited_by: v.optional(v.string()),
    business_id: v.optional(v.string()),
    suspension_reason: v.optional(v.string()),
    ban_reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
  },
});

export const setUserPassword = mutation({
  args: { id: v.id("users"), password: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { hasPassword: true, password: args.password });
  },
});

export const authenticateUser = mutation({
  args: { email: v.string(), password: v.string() },
  handler: async (ctx, args) => {
    const users = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
      .collect();
    
    const user = users[0];
    if (!user || user.status === "removed") {
      throw new Error("User not found or invalid credentials");
    }

    if (!user.hasPassword || !user.password || user.password !== args.password) {
      throw new Error("Invalid password");
    }

    const lastMagicLogin = new Date().toISOString();
    await ctx.db.patch(user._id, { lastMagicLogin });
    
    return { ...user, lastMagicLogin };
  },
});

export const issueMagicLogin = mutation({
  args: { email: v.string(), role: v.string() },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    const users = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
      .collect();

    const existingUser = users[0];

    if (existingUser) {
      if (existingUser.status === "removed") {
        throw new Error("This account has been removed. Contact Pick'em support.");
      }
      await ctx.db.patch(existingUser._id, { lastMagicLogin: now });
      return { ...existingUser, lastMagicLogin: now };
    }

    const getDefaultNameFromEmail = (email: string) => {
      const [handle] = email.split("@");
      return handle || "Pick'em User";
    };

    const userId = await ctx.db.insert("users", {
      name: getDefaultNameFromEmail(args.email),
      email: args.email.toLowerCase(),
      role: args.role,
      status: "approved",
      created_at: now,
      hasPassword: false,
      lastMagicLogin: now,
      email_verified: true,
      phone_verified: false,
      verification_cleared: false,
    });

    return {
      _id: userId,
      name: getDefaultNameFromEmail(args.email),
      email: args.email.toLowerCase(),
      role: args.role,
      status: "approved",
      created_at: now,
      hasPassword: false,
      lastMagicLogin: now,
      email_verified: true,
      phone_verified: false,
      verification_cleared: false,
    };
  },
});

export const inviteAdmin = mutation({
  args: { email: v.string(), invitedBy: v.string() },
  handler: async (ctx, args) => {
    const normalizedEmail = args.email.toLowerCase();
    const now = new Date().toISOString();
    
    const users = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", normalizedEmail))
      .collect();

    const existingUser = users[0];

    if (existingUser) {
      const updatedAdmin = {
        name: existingUser.name,
        email: normalizedEmail,
        role: "admin" as const,
        status: existingUser.admin_level === "super_admin" ? "approved" : "pending",
        hasPassword: existingUser.hasPassword,
        password: existingUser.password,
        lastMagicLogin: existingUser.lastMagicLogin,
        email_verified: existingUser.email_verified || true,
        phone_verified: existingUser.phone_verified || false,
        verification_cleared: existingUser.verification_cleared || false,
        admin_level: (existingUser.admin_level && existingUser.admin_level !== "admin") ? existingUser.admin_level : "operations_admin",
        invited_by: args.invitedBy,
        business_id: existingUser.business_id,
      };
      await ctx.db.patch(existingUser._id, updatedAdmin);
      return { ...updatedAdmin, _id: existingUser._id };
    }

    const getDefaultNameFromEmail = (email: string) => {
      const [handle] = email.split("@");
      return handle || "Pick'em User";
    };

    const userId = await ctx.db.insert("users", {
      name: getDefaultNameFromEmail(normalizedEmail),
      email: normalizedEmail,
      role: "admin",
      status: "pending",
      created_at: now,
      hasPassword: false,
      email_verified: true,
      phone_verified: false,
      verification_cleared: false,
      admin_level: "operations_admin",
      invited_by: args.invitedBy,
    });

    return {
      _id: userId,
      name: getDefaultNameFromEmail(normalizedEmail),
      email: normalizedEmail,
      role: "admin",
      status: "pending",
      created_at: now,
      hasPassword: false,
      email_verified: true,
      phone_verified: false,
      verification_cleared: false,
      admin_level: "operations_admin",
      invited_by: args.invitedBy,
    };
  },
});

export const approveAdmin = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user || user.role !== "admin") {
      throw new Error("Admin not found");
    }

    await ctx.db.patch(args.userId, {
      status: "approved",
      admin_level: (user.admin_level && user.admin_level !== "admin") ? user.admin_level : "operations_admin",
      verification_cleared: true,
      email_verified: true,
    });

    const updated = await ctx.db.get(args.userId);
    return updated;
  },
});

export const removeAdmin = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user || user.role !== "admin") {
      throw new Error("Admin not found");
    }
    if (user.admin_level === "super_admin") {
      throw new Error("Super admin access cannot be removed");
    }

    await ctx.db.patch(args.userId, { status: "removed" });
  },
});

export const suspendUser = mutation({
  args: { userId: v.id("users"), reason: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      status: "suspended",
      suspension_reason: args.reason,
    });
  },
});

export const banUser = mutation({
  args: { userId: v.id("users"), reason: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      status: "banned",
      ban_reason: args.reason,
    });
  },
});

// Ensure system users (seed super admin)
export const ensureSystemUsers = mutation({
  args: {},
  handler: async (ctx) => {
    const SUPER_ADMIN_EMAIL = "riderezzy@gmail.com";
    const SUPER_ADMIN_PASSWORD = "1percent99";
    
    const users = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", SUPER_ADMIN_EMAIL.toLowerCase()))
      .collect();

    const existingSuperAdmin = users[0];
    const now = new Date().toISOString();

    if (existingSuperAdmin) {
      await ctx.db.patch(existingSuperAdmin._id, {
        name: existingSuperAdmin.name || "riderezzy",
        role: "admin",
        status: "approved",
        hasPassword: true,
        email_verified: true,
        phone_verified: true,
        verification_cleared: true,
        admin_level: "super_admin",
      });
    } else {
      await ctx.db.insert("users", {
        name: "riderezzy",
        email: SUPER_ADMIN_EMAIL.toLowerCase(),
        role: "admin",
        status: "approved",
        created_at: now,
        hasPassword: true,
        password: SUPER_ADMIN_PASSWORD,
        email_verified: true,
        phone_verified: true,
        verification_cleared: true,
        admin_level: "super_admin",
      });
    }

    return await ctx.db.query("users").collect();
  },
});
