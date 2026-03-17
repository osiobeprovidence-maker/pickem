import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Runner verification queries
export const getRunnerVerification = query({
  args: { runnerId: v.string() },
  handler: async (ctx, args) => {
    const verifications = await ctx.db
      .query("runner_verifications")
      .withIndex("by_runner", (q) => q.eq("runner_id", args.runnerId))
      .collect();
    return verifications[0] ?? null;
  },
});

export const getRunnerVerifications = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("runner_verifications")
      .withIndex("by_verification_status", (q) => q.eq("verification_status", "approved"))
      .collect();
  },
});

// Runner verification mutations
export const createOrUpdateRunnerVerification = mutation({
  args: {
    runner_id: v.string(),
    full_name: v.optional(v.string()),
    phone_number: v.optional(v.string()),
    phone_verified: v.optional(v.boolean()),
    email: v.optional(v.string()),
    email_verified: v.optional(v.boolean()),
    id_type: v.optional(v.string()),
    id_front: v.optional(v.string()),
    id_back: v.optional(v.string()),
    selfie_image: v.optional(v.string()),
    residential_address: v.optional(v.string()),
    proof_of_address: v.optional(v.string()),
    emergency_contact_name: v.optional(v.string()),
    emergency_contact_phone: v.optional(v.string()),
    emergency_contact_relationship: v.optional(v.string()),
    bank_name: v.optional(v.string()),
    account_number: v.optional(v.string()),
    account_name: v.optional(v.string()),
    payout_verified: v.optional(v.boolean()),
    device_id: v.optional(v.string()),
    ip_address: v.optional(v.string()),
    location_data: v.optional(v.string()),
    terms_accepted: v.optional(v.boolean()),
    security_bond_amount: v.optional(v.number()),
    trust_score: v.optional(v.number()),
    verification_status: v.optional(v.string()),
    submitted_at: v.optional(v.string()),
    approved_at: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    const existing = await ctx.db
      .query("runner_verifications")
      .withIndex("by_runner", (q) => q.eq("runner_id", args.runner_id))
      .collect();
    
    if (existing[0]) {
      await ctx.db.patch(existing[0]._id, {
        ...args,
        updated_at: now,
      });
      return existing[0]._id;
    } else {
      const verificationId = await ctx.db.insert("runner_verifications", {
        runner_id: args.runner_id,
        full_name: args.full_name || "",
        phone_number: args.phone_number || "",
        phone_verified: args.phone_verified || false,
        email: args.email || "",
        email_verified: args.email_verified || false,
        id_type: args.id_type || "nin",
        id_front: args.id_front,
        id_back: args.id_back,
        selfie_image: args.selfie_image,
        residential_address: args.residential_address || "",
        proof_of_address: args.proof_of_address,
        emergency_contact_name: args.emergency_contact_name || "",
        emergency_contact_phone: args.emergency_contact_phone || "",
        emergency_contact_relationship: args.emergency_contact_relationship || "",
        bank_name: args.bank_name || "",
        account_number: args.account_number || "",
        account_name: args.account_name || "",
        payout_verified: args.payout_verified || false,
        device_id: args.device_id || "",
        ip_address: args.ip_address || "",
        location_data: args.location_data || "",
        terms_accepted: args.terms_accepted || false,
        security_bond_amount: args.security_bond_amount || 0,
        trust_score: args.trust_score || 50,
        verification_status: args.verification_status || "not_started",
        submitted_at: args.submitted_at,
        approved_at: args.approved_at,
        created_at: now,
        updated_at: now,
      });
      return verificationId;
    }
  },
});

export const approveRunnerVerification = mutation({
  args: { runnerId: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("runner_verifications")
      .withIndex("by_runner", (q) => q.eq("runner_id", args.runnerId))
      .collect();
    
    if (!existing[0]) {
      throw new Error("Runner verification not found");
    }

    await ctx.db.patch(existing[0]._id, {
      verification_status: "approved",
      approved_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      trust_score: Math.max(existing[0].trust_score, 80),
    });
  },
});
