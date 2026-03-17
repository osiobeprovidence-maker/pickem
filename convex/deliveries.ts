import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Delivery queries
export const getDeliveries = query({
  args: { role: v.string(), userId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.role === "runner") {
      const requested = await ctx.db
        .query("deliveries")
        .withIndex("by_status", (q) => q.eq("status", "requested"))
        .collect();
      
      if (args.userId) {
        const runnerDeliveries = await ctx.db
          .query("deliveries")
          .withIndex("by_runner", (q) => q.eq("runner_id", args.userId!))
          .collect();
        return [...requested, ...runnerDeliveries];
      }
      return requested;
    }
    
    if (args.role === "business" && args.userId) {
      return await ctx.db
        .query("deliveries")
        .withIndex("by_business", (q) => q.eq("business_id", args.userId!))
        .collect();
    }
    
    if (args.userId) {
      return await ctx.db
        .query("deliveries")
        .withIndex("by_customer", (q) => q.eq("customer_id", args.userId!))
        .collect();
    }
    
    return await ctx.db.query("deliveries").collect();
  },
});

export const getDelivery = query({
  args: { id: v.id("deliveries") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Delivery mutations
export const createDelivery = mutation({
  args: {
    type: v.string(),
    status: v.optional(v.string()),
    pickup_location: v.string(),
    drop_location: v.string(),
    item_description: v.string(),
    contact_details: v.string(),
    customer_id: v.optional(v.string()),
    business_id: v.optional(v.string()),
    runner_id: v.optional(v.string()),
    proxy_code: v.optional(v.string()),
    preferred_time: v.optional(v.string()),
    item_image: v.optional(v.string()),
    fee: v.number(),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    const deliveryId = await ctx.db.insert("deliveries", {
      type: args.type,
      status: args.status ?? "requested",
      pickup_location: args.pickup_location,
      drop_location: args.drop_location,
      item_description: args.item_description,
      contact_details: args.contact_details,
      customer_id: args.customer_id,
      business_id: args.business_id,
      runner_id: args.runner_id,
      proxy_code: args.proxy_code,
      preferred_time: args.preferred_time,
      item_image: args.item_image,
      fee: args.fee,
      created_at: now,
      updated_at: now,
    });
    return { id: deliveryId };
  },
});

export const updateDeliveryStatus = mutation({
  args: { id: v.id("deliveries"), status: v.string(), runnerId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const delivery = await ctx.db.get(args.id);
    if (!delivery) throw new Error("Delivery not found");
    
    await ctx.db.patch(args.id, {
      status: args.status,
      runner_id: args.runnerId ?? delivery.runner_id,
      updated_at: new Date().toISOString(),
    });
  },
});

export const completeRunnerDeliveryWithProof = mutation({
  args: {
    id: v.id("deliveries"),
    runnerId: v.string(),
    method: v.string(),
    asset: v.optional(v.string()),
    code: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const delivery = await ctx.db.get(args.id);
    if (!delivery) throw new Error("Delivery not found");
    
    await ctx.db.patch(args.id, {
      status: "delivered",
      runner_id: args.runnerId,
      proof_method: args.method,
      proof_asset: args.asset,
      proof_code: args.code,
      proof_confirmed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    // Update runner trust score
    const verifications = await ctx.db
      .query("runner_verifications")
      .withIndex("by_runner", (q) => q.eq("runner_id", args.runnerId))
      .collect();
    
    const existingVerification = verifications[0];
    if (existingVerification) {
      await ctx.db.patch(existingVerification._id, {
        trust_score: Math.min(100, existingVerification.trust_score + 5),
        updated_at: new Date().toISOString(),
      });
    }
  },
});

export const assignRunnerToDelivery = mutation({
  args: { id: v.id("deliveries"), runnerId: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      runner_id: args.runnerId,
      status: "assigned",
      updated_at: new Date().toISOString(),
    });
  },
});

export const cancelDelivery = mutation({
  args: { id: v.id("deliveries") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: "cancelled",
      updated_at: new Date().toISOString(),
    });
  },
});
