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

interface OrderConfirmationProps {
  orderNumber: string;
  customerName: string;
  items: { name: string; quantity: number; price: number }[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  storeName: string;
}

export function OrderConfirmation({
  orderNumber,
  customerName,
  items,
  subtotal,
  shipping,
  tax,
  total,
  storeName,
}: OrderConfirmationProps) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: "Inter, sans-serif", backgroundColor: "#fafafa" }}>
        <Container style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
          <Text style={{ fontSize: 32, fontWeight: 300, textAlign: "center", marginBottom: 8 }}>
            {storeName}
          </Text>
          <Text style={{ textAlign: "center", color: "#666", marginBottom: 40 }}>
            Order Confirmation
          </Text>

          <Section style={{ background: "#fff", padding: 32, borderRadius: 8 }}>
            <Text style={{ marginTop: 0 }}>Dear {customerName},</Text>
            <Text>Thank you for your order. We're preparing your items with care.</Text>

            <Text style={{ fontSize: 18, marginTop: 32 }}>Order #{orderNumber}</Text>

            <Hr style={{ borderColor: "#eee" }} />

            {items.map((item, i) => (
              <Row key={i} style={{ padding: "12px 0", borderBottom: "1px solid #eee" }}>
                <Column>{item.name}</Column>
                <Column style={{ textAlign: "center" }}>{item.quantity}</Column>
                <Column style={{ textAlign: "right" }}>${(item.price / 100).toFixed(2)}</Column>
              </Row>
            ))}

            <Section style={{ marginTop: 24, textAlign: "right" }}>
              <Text style={{ margin: "4px 0", color: "#666" }}>Subtotal: ${(subtotal / 100).toFixed(2)}</Text>
              <Text style={{ margin: "4px 0", color: "#666" }}>Shipping: ${(shipping / 100).toFixed(2)}</Text>
              <Text style={{ margin: "4px 0", color: "#666" }}>Tax: ${(tax / 100).toFixed(2)}</Text>
              <Text style={{ margin: "12px 0", fontSize: 18, fontWeight: 600 }}>
                Total: ${(total / 100).toFixed(2)}
              </Text>
            </Section>
          </Section>

          <Text style={{ textAlign: "center", color: "#999", fontSize: 12, marginTop: 40 }}>
            © {new Date().getFullYear()} {storeName}. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
