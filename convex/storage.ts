import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const storageRateTable: Record<string, Record<string, number>> = {
  Lagos: { small: 12000, medium: 24000, large: 42000, custom: 65000 },
  Abuja: { small: 11000, medium: 22000, large: 39000, custom: 60000 },
  "Port Harcourt": { small: 10000, medium: 20000, large: 36000, custom: 56000 },
  Warri: { small: 9000, medium: 18000, large: 32000, custom: 50000 },
};

// Storage subscription queries
export const getStorageSubscriptions = query({
  args: { businessId: v.id("businesses") },
  handler: async (ctx, args) => {
    const subscriptions = await ctx.db
      .query("storage_subscriptions")
      .withIndex("by_business", (q) => q.eq("business_id", args.businessId))
      .collect();
    return subscriptions.sort((a, b) => new Date(a.expires_at).getTime() - new Date(b.expires_at).getTime());
  },
});

// Storage subscription mutations
export const createStorageSubscription = mutation({
  args: {
    business_id: v.id("businesses"),
    location: v.string(),
    size: v.string(),
    quantity: v.number(),
    durationMonths: v.number(),
    product_ids: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + Math.max(1, args.durationMonths));
    
    const monthlyCost = storageRateTable[args.location][args.size] * Math.max(1, args.durationMonths);
    
    const subscriptionId = await ctx.db.insert("storage_subscriptions", {
      business_id: args.business_id,
      location: args.location,
      size: args.size,
      quantity: args.quantity,
      product_ids: args.product_ids,
      monthly_cost: monthlyCost,
      expires_at: expiresAt.toISOString(),
      active: true,
      created_at: new Date().toISOString(),
    });

    // Update products to warehouse fulfillment
    for (const productId of args.product_ids) {
      const product = await ctx.db.get(productId);
      if (product) {
        await ctx.db.patch(productId, { fulfillment_mode: "warehouse" });
      }
    }

    return subscriptionId;
  },
});

export const removeProductsFromStorage = mutation({
  args: { businessId: v.id("businesses"), productIds: v.array(v.string()) },
  handler: async (ctx, args) => {
    const subscriptions = await ctx.db
      .query("storage_subscriptions")
      .withIndex("by_business", (q) => q.eq("business_id", args.businessId))
      .collect();
    
    for (const sub of subscriptions) {
      const newProductIds = sub.product_ids.filter(id => !args.productIds.includes(id));
      await ctx.db.patch(sub._id, { product_ids: newProductIds });
    }

    for (const productId of args.productIds) {
      const product = await ctx.db.get(productId);
      if (product) {
        await ctx.db.patch(productId, { fulfillment_mode: "manual" });
      }
    }
  },
});
