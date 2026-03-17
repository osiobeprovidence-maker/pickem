import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Customer queries
export const getBusinessCustomers = query({
  args: { businessId: v.id("businesses") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("customers")
      .withIndex("by_business", (q) => q.eq("business_id", args.businessId))
      .collect();
  },
});

// Customer mutations
export const collectCustomerData = mutation({
  args: {
    businessId: v.id("businesses"),
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    
    const existing = await ctx.db
      .query("customers")
      .withIndex("by_business_and_email", (q) => q.eq("business_id", args.businessId).eq("email", args.email.toLowerCase()))
      .collect();
    
    const customer = existing[0];
    
    if (customer) {
      await ctx.db.patch(customer._id, {
        name: args.name,
        phone: args.phone,
        total_spent: customer.total_spent + args.amount,
        order_count: customer.order_count + 1,
        last_purchase_date: now,
      });
    } else {
      await ctx.db.insert("customers", {
        business_id: args.businessId,
        name: args.name,
        email: args.email.toLowerCase(),
        phone: args.phone,
        total_spent: args.amount,
        order_count: 1,
        last_purchase_date: now,
      });
    }
  },
});

export const upsertBusinessCustomer = mutation({
  args: {
    businessId: v.id("businesses"),
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    totalSpent: v.optional(v.number()),
    orderCount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("customers")
      .withIndex("by_business_and_email", (q) => q.eq("business_id", args.businessId).eq("email", args.email.toLowerCase()))
      .collect();
    
    const customer = existing[0];
    
    if (customer) {
      await ctx.db.patch(customer._id, {
        name: args.name,
        phone: args.phone,
        total_spent: args.totalSpent ?? customer.total_spent,
        order_count: args.orderCount ?? customer.order_count,
        last_purchase_date: new Date().toISOString(),
      });
      return customer._id;
    } else {
      const customerId = await ctx.db.insert("customers", {
        business_id: args.businessId,
        name: args.name,
        email: args.email.toLowerCase(),
        phone: args.phone,
        total_spent: args.totalSpent ?? 0,
        order_count: args.orderCount ?? 1,
        last_purchase_date: new Date().toISOString(),
      });
      return customerId;
    }
  },
});
