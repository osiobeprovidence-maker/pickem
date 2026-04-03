/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admin_logs from "../admin_logs.js";
import type * as business_orders from "../business_orders.js";
import type * as businesses from "../businesses.js";
import type * as customers from "../customers.js";
import type * as deliveries from "../deliveries.js";
import type * as notifications from "../notifications.js";
import type * as products from "../products.js";
import type * as runner_verifications from "../runner_verifications.js";
import type * as storage from "../storage.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  admin_logs: typeof admin_logs;
  business_orders: typeof business_orders;
  businesses: typeof businesses;
  customers: typeof customers;
  deliveries: typeof deliveries;
  notifications: typeof notifications;
  products: typeof products;
  runner_verifications: typeof runner_verifications;
  storage: typeof storage;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
