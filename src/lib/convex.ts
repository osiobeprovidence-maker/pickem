import { ConvexHttpClient } from 'convex/browser';
import { anyApi } from 'convex/server';
import type { User, UserRole } from '../types';
import { getStackIssue, publicEnv } from './env';

const convexUrl = publicEnv.convex.url;

const convex = convexUrl
  ? new ConvexHttpClient(convexUrl, { logger: false })
  : null;

const toAppUser = (record: any): User | null => {
  if (!record) return null;

  return {
    id: record._id,
    name: record.name,
    email: record.email,
    username: record.username,
    firebase_uid: record.firebase_uid,
    auth_provider: record.auth_provider,
    role: record.role,
    status: record.status,
    created_at: record.created_at,
    updated_at: record.updated_at,
    hasPassword: record.hasPassword,
    password: record.password,
    needs_password_setup: record.needs_password_setup,
    lastMagicLogin: record.lastMagicLogin,
    email_verified: record.email_verified,
    phone_verified: record.phone_verified,
    verification_cleared: record.verification_cleared,
    admin_level: record.admin_level,
    invited_by: record.invited_by,
    two_factor_enabled: record.two_factor_enabled,
    ip_whitelist: record.ip_whitelist,
    last_ip_address: record.last_ip_address,
    suspension_reason: record.suspension_reason,
    ban_reason: record.ban_reason,
  };
};

const requireConvex = () => {
  if (!convex) {
    throw new Error(getStackIssue('convex') || 'Convex is not configured. Add VITE_CONVEX_URL to continue.');
  }

  return convex;
};

export const convexProfiles = {
  isConfigured() {
    return Boolean(convex);
  },

  async findUserByEmail(email: string) {
    const client = requireConvex();
    const result = await client.query(anyApi.users.getUserByEmail, { email });
    return toAppUser(result);
  },

  async syncFirebaseUser(input: {
    firebaseUid: string;
    email: string;
    name?: string | null;
    role?: UserRole;
    authProvider: 'password' | 'google' | 'apple';
    hasPassword: boolean;
    needsPasswordSetup: boolean;
  }) {
    const client = requireConvex();
    const result = await client.mutation(anyApi.users.syncFirebaseUser, {
      firebase_uid: input.firebaseUid,
      email: input.email,
      name: input.name ?? undefined,
      role: input.role,
      auth_provider: input.authProvider,
      hasPassword: input.hasPassword,
      needs_password_setup: input.needsPasswordSetup,
    });
    return toAppUser(result);
  },

  async isUsernameAvailable(username: string, excludeUserId?: string) {
    const client = requireConvex();
    return await client.query(anyApi.users.isUsernameAvailable, {
      username,
      excludeUserId: excludeUserId as any,
    });
  },

  async completeUserProfile(input: {
    id: string;
    name?: string;
    username: string;
    hasPassword?: boolean;
    needsPasswordSetup?: boolean;
  }) {
    const client = requireConvex();
    const result = await client.mutation(anyApi.users.completeUserProfile, {
      id: input.id as any,
      name: input.name,
      username: input.username,
      hasPassword: input.hasPassword,
      needs_password_setup: input.needsPasswordSetup,
    });
    return toAppUser(result);
  },

  async markPasswordSet(id: string) {
    const client = requireConvex();
    await client.mutation(anyApi.users.updateUser, {
      id: id as any,
      hasPassword: true,
      needs_password_setup: false,
    });
  },
};
