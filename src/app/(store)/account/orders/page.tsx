"use client";

import Link from "next/link";
import { Package } from "lucide-react";
import { useAuth } from "@clerk/nextjs"; // I3 FIX: Import useAuth
import { useEffect, useReducer } from "react";
import { formatPrice } from "@/lib/utils";
import { FadeIn, StaggerContainer, StaggerItem } from "@/lib/motion";

interface OrderSummary {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  items: { productName: string; quantity: number }[];
}

interface OrdersState {
  orders: OrderSummary[];
  loading: boolean;
}

type OrdersAction =
  | { type: "NOT_SIGNED_IN" }
  | { type: "FETCH_SUCCESS"; orders: OrderSummary[] }
  | { type: "FETCH_ERROR" };

function ordersReducer(state: OrdersState, action: OrdersAction): OrdersState {
  switch (action.type) {
    case "NOT_SIGNED_IN":
      return { orders: [], loading: false };
    case "FETCH_SUCCESS":
      return { orders: action.orders, loading: false };
    case "FETCH_ERROR":
      return { orders: [], loading: false };
    default:
      return state;
  }
}

// I3 FIX: Fetch real orders from API instead of showing static placeholder
export default function OrdersPage() {
  const { userId, isSignedIn } = useAuth();
  const [state, dispatch] = useReducer(ordersReducer, { orders: [], loading: true });

  useEffect(() => {
    if (!isSignedIn || !userId) {
      dispatch({ type: "NOT_SIGNED_IN" });
      return;
    }

    // I3 FIX: Fetch orders from the /api/orders/mine endpoint
    fetch("/api/orders/mine")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch orders");
        return res.json();
      })
      .then((data) => dispatch({ type: "FETCH_SUCCESS", orders: data.data || [] }))
      .catch(() => dispatch({ type: "FETCH_ERROR" }));
  }, [userId, isSignedIn]);

  const { orders, loading } = state;

  if (!isSignedIn) {
    return (
      <div className="pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h1 className="font-heading text-4xl font-light tracking-wide mb-12">Order History</h1>
          </FadeIn>
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-4">Please sign in to view your orders.</p>
            <Link href="/sign-in" className="text-sm text-accent hover:underline">Sign in</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <nav className="mb-8 text-sm text-muted-foreground">
          <Link href="/account" className="hover:text-foreground transition-colors">Account</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Orders</span>
        </nav>
        <FadeIn>
          <h1 className="font-heading text-4xl font-light tracking-wide mb-12">Order History</h1>
        </FadeIn>

        {loading ? (
          <div className="text-center py-20">
            <div className="skeleton-shimmer h-6 w-48 mx-auto rounded" />
          </div>
        ) : orders.length === 0 ? (
          <FadeIn>
            <div className="text-center py-20">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No orders yet.</p>
              <Link href="/collections" className="text-sm text-accent hover:underline mt-2 inline-block">Start shopping</Link>
            </div>
          </FadeIn>
        ) : (
          <StaggerContainer className="space-y-4">
            {orders.map((order) => (
              <StaggerItem key={order.id}>
                <div className="glass-panel rounded-lg p-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Order #{order.id.slice(0, 8)}</span>
                    <span className="text-sm text-muted-foreground capitalize">{order.status}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                  <p className="font-medium mt-2 accent-gradient-text">{formatPrice(order.total)}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </div>
    </div>
  );
}
