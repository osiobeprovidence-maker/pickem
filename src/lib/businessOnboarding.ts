import { addDays, differenceInCalendarDays, format } from 'date-fns';
import type { BusinessSubscriptionStatus } from '../types';

export type BusinessPlanStatus = BusinessSubscriptionStatus;

export type BusinessRegistrationInput = {
  businessName: string;
  businessCategory: string;
  ownerFullName: string;
  email: string;
  phoneNumber: string;
  businessAddress: string;
  cityState: string;
  description?: string;
};

export type BusinessOnboardingRecord = BusinessRegistrationInput & {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: BusinessPlanStatus;
  trialStartDate?: string;
  trialEndDate?: string;
  nextBillingDate?: string;
  monthlyPrice: number;
};

export type BusinessPlanSummary = {
  record: BusinessOnboardingRecord | null;
  status: BusinessPlanStatus | 'none';
  currentPlanLabel: string;
  daysRemaining: number;
  nextBillingLabel: string;
  locked: boolean;
};

const STORAGE_KEY = 'pickem_business_onboarding_records';
export const BUSINESS_MONTHLY_PRICE = 3500;

function readRecords(): BusinessOnboardingRecord[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as BusinessOnboardingRecord[];
    return parsed.map(normalizeRecord);
  } catch (error) {
    console.error('Failed to read business onboarding records:', error);
    return [];
  }
}

function writeRecords(records: BusinessOnboardingRecord[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function normalizeRecord(record: BusinessOnboardingRecord): BusinessOnboardingRecord {
  if (record.status === 'trial' && record.trialEndDate) {
    const today = new Date();
    const end = new Date(record.trialEndDate);

    if (today > end) {
      return {
        ...record,
        status: 'expired',
        updatedAt: today.toISOString(),
      };
    }
  }

  return record;
}

export function getBusinessRecordByEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  return readRecords().find((record) => record.email.trim().toLowerCase() === normalizedEmail) ?? null;
}

export function registerBusiness(input: BusinessRegistrationInput) {
  const records = readRecords();
  const now = new Date().toISOString();
  const existing = records.find(
    (record) => record.email.trim().toLowerCase() === input.email.trim().toLowerCase(),
  );

  const nextRecord: BusinessOnboardingRecord = {
    id: existing?.id ?? crypto.randomUUID(),
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    status: existing?.status ?? 'inactive',
    trialStartDate: existing?.trialStartDate,
    trialEndDate: existing?.trialEndDate,
    nextBillingDate: existing?.nextBillingDate,
    monthlyPrice: existing?.monthlyPrice ?? BUSINESS_MONTHLY_PRICE,
    ...input,
  };

  const nextRecords = existing
    ? records.map((record) => (record.id === existing.id ? nextRecord : record))
    : [nextRecord, ...records];

  writeRecords(nextRecords);
  return nextRecord;
}

export function startBusinessTrial(email: string) {
  const record = getBusinessRecordByEmail(email);
  if (!record) return null;

  const trialStartDate = new Date();
  const trialEndDate = addDays(trialStartDate, 7);
  const updated: BusinessOnboardingRecord = {
    ...record,
    status: 'trial',
    trialStartDate: trialStartDate.toISOString(),
    trialEndDate: trialEndDate.toISOString(),
    nextBillingDate: trialEndDate.toISOString(),
    updatedAt: trialStartDate.toISOString(),
  };

  const records = readRecords().map((entry) => (entry.id === updated.id ? updated : entry));
  writeRecords(records);
  return updated;
}

export function activateBusinessSubscription(email: string) {
  const record = getBusinessRecordByEmail(email);
  if (!record) return null;

  const startDate = new Date();
  const nextBillingDate = addDays(startDate, 30);
  const updated: BusinessOnboardingRecord = {
    ...record,
    status: 'active',
    updatedAt: startDate.toISOString(),
    nextBillingDate: nextBillingDate.toISOString(),
  };

  const records = readRecords().map((entry) => (entry.id === updated.id ? updated : entry));
  writeRecords(records);
  return updated;
}

export function getBusinessPlanSummary(email?: string | null): BusinessPlanSummary {
  if (!email) {
    return {
      record: null,
      status: 'none',
      currentPlanLabel: 'No plan',
      daysRemaining: 0,
      nextBillingLabel: 'Complete registration to begin your trial.',
      locked: false,
    };
  }

  const record = getBusinessRecordByEmail(email);
  if (!record) {
    return {
      record: null,
      status: 'none',
      currentPlanLabel: 'No plan',
      daysRemaining: 0,
      nextBillingLabel: 'Complete registration to begin your trial.',
      locked: false,
    };
  }

  const normalized = normalizeRecord(record);

  if (normalized.status === 'trial' && normalized.trialEndDate) {
    return {
      record: normalized,
      status: 'trial',
      currentPlanLabel: 'Trial',
      daysRemaining: Math.max(differenceInCalendarDays(new Date(normalized.trialEndDate), new Date()), 0),
      nextBillingLabel: `${format(new Date(normalized.trialEndDate), 'MMM d')} · ₦${BUSINESS_MONTHLY_PRICE.toLocaleString()}/month`,
      locked: false,
    };
  }

  if (normalized.status === 'active' && normalized.nextBillingDate) {
    return {
      record: normalized,
      status: 'active',
      currentPlanLabel: 'Subscribed',
      daysRemaining: Math.max(differenceInCalendarDays(new Date(normalized.nextBillingDate), new Date()), 0),
      nextBillingLabel: `${format(new Date(normalized.nextBillingDate), 'MMM d')} · ₦${BUSINESS_MONTHLY_PRICE.toLocaleString()}/month`,
      locked: false,
    };
  }

  if (normalized.status === 'expired') {
    return {
      record: normalized,
      status: 'expired',
      currentPlanLabel: 'Expired',
      daysRemaining: 0,
      nextBillingLabel: `Subscribe for ₦${BUSINESS_MONTHLY_PRICE.toLocaleString()}/month to unlock premium tools.`,
      locked: true,
    };
  }

  return {
    record: normalized,
    status: 'inactive',
    currentPlanLabel: 'Inactive',
    daysRemaining: 7,
    nextBillingLabel: `Start your 7-day free trial, then continue at ₦${BUSINESS_MONTHLY_PRICE.toLocaleString()}/month.`,
    locked: false,
  };
}
