"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Loader2 } from "lucide-react";

import { useCart } from "@/components/shop/cart-provider";
import { Section, Container } from "@/components/craft";
import { Button } from "@/components/ui/button";

function SuccessContent() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    // Clear cart on success page load (payment completed)
    clearCart();

    // Clear pending order from session storage
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("pending_order_id");
    }

    // Handle both URL formats:
    // Our format: ?order=123
    // WooCommerce format: ?order-received=123&key=wc_order_xxx
    const ourOrderId = searchParams.get("order");
    const wcOrderId = searchParams.get("order-received");

    setOrderId(ourOrderId || wcOrderId);
  }, [clearCart, searchParams]);

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-6 text-center">
      <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center">
        <CheckCircle className="h-12 w-12 text-green-600" />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Thank you for your order!</h1>
        <p className="text-muted-foreground max-w-md">
          Your order has been placed successfully. We&apos;ll send you an
          email confirmation shortly.
        </p>
      </div>

      {orderId && (
        <div className="bg-muted px-6 py-4 rounded-lg">
          <p className="text-sm text-muted-foreground">Order Number</p>
          <p className="text-2xl font-bold">#{orderId}</p>
        </div>
      )}

      <div className="flex gap-4">
        <Button asChild>
          <Link href="/shop">Continue Shopping</Link>
        </Button>
        {orderId && (
          <Button variant="outline" asChild>
            <Link href={`/account/orders/${orderId}`}>View Order</Link>
          </Button>
        )}
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-6">
      <Loader2 className="h-8 w-8 animate-spin" />
      <p className="text-muted-foreground">Loading order details...</p>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Section>
      <Container>
        <Suspense fallback={<LoadingState />}>
          <SuccessContent />
        </Suspense>
      </Container>
    </Section>
  );
}
