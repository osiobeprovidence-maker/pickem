import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Business order queries
export const getBusinessOrders = query({
  args: { businessId: v.id("businesses") },
  handler: async (ctx, args) => {
    const orders = await ctx.db
      .query("business_orders")
      .withIndex("by_business", (q) => q.eq("business_id", args.businessId))
      .collect();
    return orders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },
});

export const getBusinessOrder = query({
  args: { id: v.id("business_orders") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Business order mutations
export const createBusinessOrder = mutation({
  args: {
    business_id: v.id("businesses"),
    product_id: v.optional(v.id("products")),
    delivery_id: v.optional(v.id("deliveries")),
    customer_id: v.optional(v.string()),
    customer_name: v.string(),
    customer_email: v.string(),
    customer_phone: v.string(),
    product_name: v.string(),
    product_type: v.string(),
    quantity: v.number(),
    unit_price: v.number(),
    total_amount: v.number(),
    delivery_fee: v.number(),
    pickup_location: v.string(),
    drop_location: v.string(),
    contact_details: v.string(),
    fulfillment_mode: v.string(),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    const orderId = await ctx.db.insert("business_orders", {
      business_id: args.business_id,
      product_id: args.product_id,
      delivery_id: args.delivery_id,
      customer_id: args.customer_id,
      customer_name: args.customer_name,
      customer_email: args.customer_email,
      customer_phone: args.customer_phone,
      product_name: args.product_name,
      product_type: args.product_type,
      quantity: args.quantity,
      unit_price: args.unit_price,
      total_amount: args.total_amount,
      delivery_fee: args.delivery_fee,
      pickup_location: args.pickup_location,
      drop_location: args.drop_location,
      contact_details: args.contact_details,
      fulfillment_mode: args.fulfillment_mode,
      status: args.status ?? "pending_approval",
      created_at: now,
      updated_at: now,
    });
    return orderId;
  },
});

export const updateBusinessOrderStatus = mutation({
  args: { id: v.id("business_orders"), status: v.string(), deliveryId: v.optional(v.id("deliveries")) },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.id);
    if (!order) throw new Error("Order not found");
    
    await ctx.db.patch(args.id, {
      status: args.status,
      delivery_id: args.deliveryId ?? order.delivery_id,
      updated_at: new Date().toISOString(),
    });
  },
});

export const dispatchBusinessOrder = mutation({
  args: { id: v.id("business_orders") },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.id);
    if (!order) throw new Error("Order not found");

    let deliveryId = order.delivery_id;

    if (!deliveryId) {
      const now = new Date().toISOString();
      deliveryId = await ctx.db.insert("deliveries", {
        type: "business_delivery",
        status: "assigned",
        pickup_location: order.pickup_location,
        drop_location: order.drop_location,
        item_description: `${order.quantity}x ${order.product_name}`,
        contact_details: order.contact_details,
        customer_id: order.customer_id ?? undefined,
        business_id: order.business_id,
        fee: order.delivery_fee,
        created_at: now,
        updated_at: now,
      });
    }

    await ctx.db.patch(args.id, {
      status: "runner_assigned",
      delivery_id: deliveryId,
      updated_at: new Date().toISOString(),
    });

    return { deliveryId, orderId: args.id };
  },
});

export const approveBusinessOrder = mutation({
  args: { id: v.id("business_orders") },
  handler: async (ctx, args) => {
    return await ctx.db.scheduler.runAfter(0, "business_orders:dispatchBusinessOrder", { id: args.id });
  },
});
