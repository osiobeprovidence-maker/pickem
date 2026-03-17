import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Product queries
export const getProducts = query({
  args: { businessId: v.optional(v.id("businesses")) },
  handler: async (ctx, args) => {
    if (args.businessId) {
      return await ctx.db
        .query("products")
        .withIndex("by_business", (q) => q.eq("business_id", args.businessId!))
        .collect();
    }
    return await ctx.db
      .query("products")
      .withIndex("by_published", (q) => q.eq("is_published", true))
      .collect();
  },
});

export const getProduct = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Product mutations
export const createOrUpdateProduct = mutation({
  args: {
    id: v.optional(v.id("products")),
    business_id: v.id("businesses"),
    name: v.string(),
    description: v.string(),
    price: v.number(),
    discount_price: v.optional(v.number()),
    category: v.string(),
    image: v.optional(v.string()),
    video: v.optional(v.string()),
    stock: v.number(),
    type: v.string(),
    fulfillment_mode: v.string(),
    is_published: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    
    if (args.id) {
      const existing = await ctx.db.get(args.id);
      if (existing) {
        await ctx.db.patch(args.id, {
          name: args.name,
          description: args.description,
          price: args.price,
          discount_price: args.discount_price,
          category: args.category,
          image: args.image,
          video: args.video,
          stock: args.stock,
          type: args.type,
          fulfillment_mode: args.fulfillment_mode,
          is_published: args.is_published ?? existing.is_published,
        });
        return args.id;
      }
    }
    
    const productId = await ctx.db.insert("products", {
      business_id: args.business_id,
      name: args.name,
      description: args.description,
      price: args.price,
      discount_price: args.discount_price,
      category: args.category,
      image: args.image,
      video: args.video,
      stock: args.stock,
      type: args.type,
      fulfillment_mode: args.fulfillment_mode,
      is_published: args.is_published ?? true,
      created_at: now,
    });
    return productId;
  },
});

export const deleteProduct = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const duplicateProduct = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Product not found");
    
    const now = new Date().toISOString();
    const productId = await ctx.db.insert("products", {
      business_id: existing.business_id,
      name: `${existing.name} Copy`,
      description: existing.description,
      price: existing.price,
      discount_price: existing.discount_price,
      category: existing.category,
      image: existing.image,
      video: existing.video,
      stock: existing.stock,
      type: existing.type,
      fulfillment_mode: existing.fulfillment_mode,
      is_published: existing.is_published,
      created_at: now,
    });
    return productId;
  },
});

export const updateProductStock = mutation({
  args: { id: v.id("products"), stock: v.number() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { stock: args.stock });
  },
});
