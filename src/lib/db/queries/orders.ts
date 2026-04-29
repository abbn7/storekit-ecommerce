import { eq, desc, count, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders, orderItems } from "@/lib/db/schema";

export async function getOrders(page: number = 1, limit: number = 20, status?: string) {
  const offset = (page - 1) * limit;

  const conditions = status ? eq(orders.status, status) : undefined;

  const result = await db
    .select()
    .from(orders)
    .where(conditions)
    .orderBy(desc(orders.createdAt))
    .limit(limit)
    .offset(offset);

  return result;
}

export async function getOrderById(id: string) {
  const [order] = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  if (!order) return null;

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, id));

  return { ...order, items };
}

export async function getOrderByStripeSession(sessionId: string) {
  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.stripeSessionId, sessionId))
    .limit(1);
  if (!order) return null;

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, order.id));

  return { ...order, items };
}

export async function getOrdersByUserId(userId: string) {
  const result = await db
    .select()
    .from(orders)
    .where(eq(orders.clerkUserId, userId))
    .orderBy(desc(orders.createdAt));

  return result;
}

export async function createOrder(data: typeof orders.$inferInsert) {
  const [order] = await db.insert(orders).values(data).returning();
  return order;
}

export async function createOrderItem(data: typeof orderItems.$inferInsert) {
  const [item] = await db.insert(orderItems).values(data).returning();
  return item;
}

// H1 FIX: Return null when order not found instead of undefined
export async function updateOrderStatus(id: string, status: string) {
  const [order] = await db
    .update(orders)
    .set({ status, updatedAt: new Date() })
    .where(eq(orders.id, id))
    .returning();
  return order ?? null;
}

export async function getOrdersCount() {
  const [result] = await db.select({ count: count() }).from(orders);
  return result?.count ?? 0;
}

export async function getTotalRevenue() {
  const [result] = await db
    .select({ total: sql<number>`COALESCE(SUM(${orders.total}), 0)` })
    .from(orders)
    .where(eq(orders.status, "delivered"));
  return result?.total ?? 0;
}

// H5 FIX: Delete an order (used to clean up orphaned orders when Stripe session creation fails)
export async function deleteOrder(id: string) {
  await db.delete(orders).where(eq(orders.id, id));
}
