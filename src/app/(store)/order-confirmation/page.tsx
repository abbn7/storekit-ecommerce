import Link from "next/link";
import { CheckCircle, Package, MapPin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getOrderByStripeSession } from "@/lib/db/queries/orders";
import { formatPrice, getCountryName } from "@/lib/utils"; // H7 FIX: Import getCountryName
import { getStoreConfig } from "@/lib/db/queries/store";
import { OrderConfirmationContent } from "./OrderConfirmationContent";

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  let order: Awaited<ReturnType<typeof getOrderByStripeSession>> = null;
  let currency = "USD";

  if (session_id) {
    order = await getOrderByStripeSession(session_id);
  }

  if (order) {
    const config = await getStoreConfig();
    currency = config?.currency ?? "USD";
  }

  return (
    <OrderConfirmationContent order={order} currency={currency} />
  );
}
