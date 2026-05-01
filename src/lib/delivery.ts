/**
 * Estimated Delivery Date Calculator
 *
 * Calculates estimated delivery dates based on business days,
 * skipping weekends. Configurable processing and shipping days.
 */

export interface DeliveryEstimate {
  minDate: Date;
  maxDate: Date;
  minLabel: string; // e.g. "Dec 15"
  maxLabel: string; // e.g. "Dec 18"
  rangeLabel: string; // e.g. "Dec 15 – 18"
}

const DEFAULT_PROCESSING_DAYS = 1;
const DEFAULT_MIN_SHIPPING_DAYS = 3;
const DEFAULT_MAX_SHIPPING_DAYS = 7;

/**
 * Add N business days to a date (skips weekends).
 */
function addBusinessDays(startDate: Date, days: number): Date {
  const date = new Date(startDate);
  let addedDays = 0;

  while (addedDays < days) {
    date.setDate(date.getDate() + 1);
    const dayOfWeek = date.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      addedDays++;
    }
  }

  return date;
}

/**
 * Format a date as "Mon Date" (e.g. "Dec 15")
 */
function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/**
 * Calculate estimated delivery date range.
 *
 * @param options.processingDays - Business days for order processing (default: 1)
 * @param options.minShippingDays - Minimum calendar days for shipping (default: 3)
 * @param options.maxShippingDays - Maximum calendar days for shipping (default: 7)
 * @param options.fromDate - Start date (default: now)
 */
export function calculateEstimatedDelivery(options?: {
  processingDays?: number;
  minShippingDays?: number;
  maxShippingDays?: number;
  fromDate?: Date;
}): DeliveryEstimate {
  const processingDays = options?.processingDays ?? DEFAULT_PROCESSING_DAYS;
  const minShippingDays = options?.minShippingDays ?? DEFAULT_MIN_SHIPPING_DAYS;
  const maxShippingDays = options?.maxShippingDays ?? DEFAULT_MAX_SHIPPING_DAYS;
  const startDate = options?.fromDate ?? new Date();

  // Add processing time (business days)
  const processedDate = addBusinessDays(startDate, processingDays);

  // Add shipping time (calendar days, but skip weekend for delivery)
  const minDate = new Date(processedDate);
  minDate.setDate(minDate.getDate() + minShippingDays);
  // If delivery falls on weekend, push to Monday
  if (minDate.getDay() === 0) minDate.setDate(minDate.getDate() + 1);
  if (minDate.getDay() === 6) minDate.setDate(minDate.getDate() + 2);

  const maxDate = new Date(processedDate);
  maxDate.setDate(maxDate.getDate() + maxShippingDays);
  // If delivery falls on weekend, push to Monday
  if (maxDate.getDay() === 0) maxDate.setDate(maxDate.getDate() + 1);
  if (maxDate.getDay() === 6) maxDate.setDate(maxDate.getDate() + 2);

  const minLabel = formatDate(minDate);
  const maxLabel = formatDate(maxDate);

  // If same month, abbreviate range (e.g. "Dec 15 – 18")
  const rangeLabel =
    minDate.getMonth() === maxDate.getMonth()
      ? `${minLabel.split(" ")[0]} ${minDate.getDate()} – ${maxDate.getDate()}`
      : `${minLabel} – ${maxLabel}`;

  return {
    minDate,
    maxDate,
    minLabel,
    maxLabel,
    rangeLabel,
  };
}
