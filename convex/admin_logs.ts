import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Admin action log queries
export const getAdminActionLogs = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("admin_action_logs")
      .order("desc")
      .collect();
  },
});

export const getAdminActionLogsByAdmin = query({
  args: { adminId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("admin_action_logs")
      .withIndex("by_admin", (q) => q.eq("admin_id", args.adminId))
      .order("desc")
      .collect();
  },
});

// Admin action log mutations
export const logAdminAction = mutation({
  args: {
    admin_id: v.string(),
    admin_name: v.string(),
    action: v.string(),
    target_user_id: v.optional(v.string()),
    target_user_email: v.optional(v.string()),
    details: v.any(),
    ip_address: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("admin_action_logs", {
      admin_id: args.admin_id,
      admin_name: args.admin_name,
      action: args.action,
      target_user_id: args.target_user_id,
      target_user_email: args.target_user_email,
      details: args.details,
      timestamp: new Date().toISOString(),
      ip_address: args.ip_address,
    });
  },
});

// Admin security event queries
export const getSecurityEvents = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("admin_security_events")
      .order("desc")
      .collect();
  },
});

export const getSecurityEventsByAdmin = query({
  args: { adminId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("admin_security_events")
      .withIndex("by_admin", (q) => q.eq("admin_id", args.adminId))
      .order("desc")
      .collect();
  },
});

// Admin security event mutations
export const logSecurityEvent = mutation({
  args: {
    admin_id: v.string(),
    event_type: v.string(),
    description: v.string(),
    ip_address: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("admin_security_events", {
      admin_id: args.admin_id,
      event_type: args.event_type,
      description: args.description,
      ip_address: args.ip_address,
      timestamp: new Date().toISOString(),
    });
  },
});
