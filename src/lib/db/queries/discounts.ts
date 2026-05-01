import { eq, and, lte, gte, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { discountCodes } from "@/lib/db/schema";
import type { DiscountCode, DiscountValidation, DiscountType } from "@/types";

/**
 * Validate a discount code and compute the discount amount for a given subtotal.
 * Returns validation result with computed discount_amount in cents.
 */
export async function validateDiscountCode(
  code: string,
  subtotal: number
): Promise<DiscountValidation> {
  const upperCode = code.toUpperCase().trim();

  const [discount] = await db
    .select()
    .from(discountCodes)
    .where(
      and(
        eq(discountCodes.code, upperCode),
        eq(discountCodes.isActive, true)
      )
    )
    .limit(1);

  if (!discount) {
    return { valid: false, error: "Invalid discount code" };
  }

  const now = new Date();

  // Check start date
  if (discount.startsAt && new Date(discount.startsAt) > now) {
    return { valid: false, error: "This code is not yet active" };
  }

  // Check expiry date
  if (discount.expiresAt && new Date(discount.expiresAt) < now) {
    return { valid: false, error: "This code has expired" };
  }

  // Check max uses
  if (discount.maxUses !== null && discount.usedCount >= discount.maxUses) {
    return { valid: false, error: "This code has reached its usage limit" };
  }

  // Check minimum order amount
  if (discount.minOrderAmount !== null && subtotal < discount.minOrderAmount) {
    return {
      valid: false,
      error: `Minimum order amount of ${(discount.minOrderAmount / 100).toFixed(2)} required`,
    };
  }

  // Compute discount amount
  let discountAmount = 0;
  const type = discount.type as DiscountType;

  switch (type) {
    case "percentage":
      discountAmount = Math.round(subtotal * (discount.value / 100));
      break;
    case "fixed":
      discountAmount = Math.min(discount.value, subtotal); // can't discount more than subtotal
      break;
    case "free_shipping":
      // discount_amount will be computed at checkout based on actual shipping cost
      discountAmount = 0; // placeholder; actual shipping cost applied at order time
      break;
  }

  return {
    valid: true,
    discount: {
      code: discount.code,
      type,
      value: discount.value,
      discount_amount: discountAmount,
    },
  };
}

/**
 * Increment the used_count for a discount code after a successful order.
 */
export async function incrementDiscountUsage(codeId: string): Promise<void> {
  await db
    .update(discountCodes)
    .set({
      usedCount: sql`${discountCodes.usedCount} + 1`,
    })
    .where(eq(discountCodes.id, codeId));
}

/**
 * Get a discount code by its ID (for admin or order processing).
 */
export async function getDiscountCodeById(
  id: string
): Promise<DiscountCode | null> {
  const [discount] = await db
    .select()
    .from(discountCodes)
    .where(eq(discountCodes.id, id))
    .limit(1);

  return (discount as unknown as DiscountCode) ?? null;
}

/**
 * Get a discount code by its code string.
 */
export async function getDiscountCodeByCode(
  code: string
): Promise<typeof discountCodes.$inferSelect | null> {
  const [discount] = await db
    .select()
    .from(discountCodes)
    .where(eq(discountCodes.code, code.toUpperCase().trim()))
    .limit(1);

  return discount ?? null;
}
