import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Row,
  Column,
  Text,
  Hr,
} from "@react-email/components";

interface OrderShippedProps {
  orderNumber: string;
  customerName: string;
  trackingNumber?: string;
  trackingUrl?: string;
  carrier?: string;
  estimatedDelivery?: string;
  items: { name: string; quantity: number; price: number }[];
  shippingAddress: string;
  storeName: string;
}

export function OrderShipped({
  orderNumber,
  customerName,
  trackingNumber,
  trackingUrl,
  carrier,
  estimatedDelivery,
  items,
  shippingAddress,
  storeName,
}: OrderShippedProps) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: "Inter, sans-serif", backgroundColor: "#fafafa" }}>
        <Container style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
          <Text style={{ fontSize: 32, fontWeight: 300, textAlign: "center", marginBottom: 8 }}>
            {storeName}
          </Text>
          <Text style={{ textAlign: "center", color: "#666", marginBottom: 40 }}>
            Your order is on its way!
          </Text>

          <Section style={{ background: "#fff", padding: 32, borderRadius: 8 }}>
            <Text style={{ marginTop: 0 }}>Dear {customerName},</Text>
            <Text>Great news! Your order has been shipped and is on its way to you.</Text>

            <Text style={{ fontSize: 18, marginTop: 32 }}>Order #{orderNumber}</Text>

            {trackingNumber && (
              <Section style={{ background: "#f5f5f5", padding: 16, borderRadius: 8, marginTop: 16 }}>
                <Text style={{ margin: 0, fontSize: 14, color: "#666" }}>Tracking Information</Text>
                <Text style={{ margin: "8px 0 0", fontWeight: 600 }}>
                  {carrier && `${carrier}: `}{trackingNumber}
                </Text>
                {trackingUrl && (
                  <Text style={{ margin: "8px 0 0" }}>
                    <a href={trackingUrl} style={{ color: "#C8A96E", textDecoration: "underline" }}>
                      Track your package →
                    </a>
                  </Text>
                )}
              </Section>
            )}

            {estimatedDelivery && (
              <Text style={{ marginTop: 16 }}>
                <strong>Estimated Delivery:</strong> {estimatedDelivery}
              </Text>
            )}

            <Hr style={{ borderColor: "#eee", marginTop: 24 }} />

            <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>Items in this shipment:</Text>
            {items.map((item, i) => (
              <Row key={i} style={{ padding: "8px 0", borderBottom: "1px solid #eee" }}>
                <Column>{item.name}</Column>
                <Column style={{ textAlign: "center" }}>×{item.quantity}</Column>
                <Column style={{ textAlign: "right" }}>${(item.price / 100).toFixed(2)}</Column>
              </Row>
            ))}

            <Hr style={{ borderColor: "#eee", marginTop: 16 }} />

            <Text style={{ fontSize: 14, color: "#666", marginBottom: 4 }}>Shipping to:</Text>
            <Text style={{ fontSize: 14, whiteSpace: "pre-line" }}>{shippingAddress}</Text>
          </Section>

          <Text style={{ textAlign: "center", color: "#999", fontSize: 12, marginTop: 40 }}>
            © {new Date().getFullYear()} {storeName}. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
