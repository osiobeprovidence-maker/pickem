import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Notification queries
export const getUserNotifications = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("user_id", args.userId))
      .order("desc")
      .collect();
  },
});

export const getUnreadNotifications = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("notifications")
      .withIndex("by_user_and_read", (q) => q.eq("user_id", args.userId).eq("read", false))
      .collect();
  },
});

// Notification mutations
export const createNotification = mutation({
  args: {
    userId: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const notificationId = await ctx.db.insert("notifications", {
      user_id: args.userId,
      message: args.message,
      read: false,
      created_at: new Date().toISOString(),
    });
    return notificationId;
  },
});

export const markNotificationAsRead = mutation({
  args: { id: v.id("notifications") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { read: true });
  },
});

export const markAllNotificationsAsRead = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_user_and_read", (q) => q.eq("user_id", args.userId).eq("read", false))
      .collect();
    
    for (const notification of notifications) {
      await ctx.db.patch(notification._id, { read: true });
    }
  },
});

export const deleteNotification = mutation({
  args: { id: v.id("notifications") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
