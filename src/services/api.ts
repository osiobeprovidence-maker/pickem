import { User, Delivery, DeliveryStatus, UserRole } from "../types";

const API_BASE = "/api";

export const api = {
  async getUser(id: string): Promise<User> {
    const res = await fetch(`${API_BASE}/users/${id}`);
    if (!res.ok) throw new Error("User not found");
    return res.json();
  },

  async createUser(user: Partial<User>): Promise<User> {
    const res = await fetch(`${API_BASE}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    if (!res.ok) throw new Error("Failed to create user");
    return res.json();
  },

  async getDeliveries(role: UserRole, userId: string): Promise<Delivery[]> {
    const res = await fetch(`${API_BASE}/deliveries?role=${role}&userId=${userId}`);
    if (!res.ok) throw new Error("Failed to fetch deliveries");
    return res.json();
  },

  async createDelivery(delivery: Partial<Delivery>): Promise<{ id: string }> {
    const res = await fetch(`${API_BASE}/deliveries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: crypto.randomUUID(),
        ...delivery,
      }),
    });
    if (!res.ok) throw new Error("Failed to create delivery");
    return res.json();
  },

  async updateDeliveryStatus(id: string, status: DeliveryStatus, runnerId?: string): Promise<void> {
    const res = await fetch(`${API_BASE}/deliveries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, runner_id: runnerId }),
    });
    if (!res.ok) throw new Error("Failed to update delivery status");
  },
};
