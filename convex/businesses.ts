import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Business queries
export const getBusinesses = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("businesses").collect();
  },
});

export const getBusiness = query({
  args: { id: v.id("businesses") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getBusinessesByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("businesses")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();
  },
});

// Business mutations
export const createOrUpdateBusiness = mutation({
  args: {
    id: v.optional(v.id("businesses")),
    name: v.string(),
    description: v.string(),
    category: v.string(),
    address: v.string(),
    is_remote: v.boolean(),
    location_type: v.string(),
    logo: v.optional(v.string()),
    banner: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    whatsapp: v.optional(v.string()),
    instagram: v.optional(v.string()),
    website: v.optional(v.string()),
    store_policy: v.optional(v.string()),
    is_pro: v.optional(v.boolean()),
    kyc_status: v.optional(v.string()),
    nin: v.optional(v.string()),
    proof_of_address: v.optional(v.string()),
    owner_id: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    
    if (args.id) {
      const existing = await ctx.db.get(args.id);
      if (existing) {
        await ctx.db.patch(args.id, {
          name: args.name,
          description: args.description,
          category: args.category,
          address: args.address,
          is_remote: args.is_remote,
          location_type: args.location_type,
          logo: args.logo,
          banner: args.banner,
          email: args.email,
          phone: args.phone,
          whatsapp: args.whatsapp,
          instagram: args.instagram,
          website: args.website,
          store_policy: args.store_policy,
          is_pro: args.is_pro ?? existing.is_pro,
          kyc_status: args.kyc_status ?? existing.kyc_status,
          nin: args.nin,
          proof_of_address: args.proof_of_address,
          owner_id: args.owner_id,
        });
        return args.id;
      }
    }
    
    const businessId = await ctx.db.insert("businesses", {
      name: args.name,
      description: args.description,
      category: args.category,
      address: args.address,
      is_remote: args.is_remote,
      location_type: args.location_type,
      logo: args.logo,
      banner: args.banner,
      email: args.email,
      phone: args.phone,
      whatsapp: args.whatsapp,
      instagram: args.instagram,
      website: args.website,
      store_policy: args.store_policy,
      is_pro: args.is_pro ?? false,
      kyc_status: args.kyc_status ?? "none",
      nin: args.nin,
      proof_of_address: args.proof_of_address,
      created_at: now,
      owner_id: args.owner_id,
    });
    return businessId;
  },
});

export const approveBusinessVerification = mutation({
  args: { id: v.id("businesses") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { kyc_status: "verified" });
  },
});

export const suspendBusiness = mutation({
  args: { id: v.id("businesses"), reason: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { kyc_status: "pending" });
  },
});
