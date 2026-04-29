import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Hr,
} from "@react-email/components";

interface OrderDeliveredProps {
  orderNumber: string;
  customerName: string;
  items: { name: string; quantity: number; price: number }[];
  storeName: string;
  reviewUrl?: string;
}

export function OrderDelivered({
  orderNumber,
  customerName,
  items,
  storeName,
  reviewUrl,
}: OrderDeliveredProps) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: "Inter, sans-serif", backgroundColor: "#fafafa" }}>
        <Container style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
          <Text style={{ fontSize: 32, fontWeight: 300, textAlign: "center", marginBottom: 8 }}>
            {storeName}
          </Text>
          <Text style={{ textAlign: "center", color: "#666", marginBottom: 40 }}>
            Your order has been delivered!
          </Text>

          <Section style={{ background: "#fff", padding: 32, borderRadius: 8 }}>
            <Text style={{ marginTop: 0 }}>Dear {customerName},</Text>
            <Text>
              Your order has been delivered! We hope you love your new pieces.
              If you have any issues, please don&apos;t hesitate to reach out.
            </Text>

            <Text style={{ fontSize: 18, marginTop: 32 }}>Order #{orderNumber}</Text>

            <Hr style={{ borderColor: "#eee" }} />

            <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>Items delivered:</Text>
            {items.map((item, i) => (
              <Section key={i} style={{ padding: "8px 0", borderBottom: "1px solid #eee" }}>
                <Text style={{ margin: 0, display: "inline-block", width: "70%" }}>{item.name}</Text>
                <Text style={{ margin: 0, display: "inline-block", width: "15%", textAlign: "center" }}>×{item.quantity}</Text>
                <Text style={{ margin: 0, display: "inline-block", width: "15%", textAlign: "right" }}>${(item.price / 100).toFixed(2)}</Text>
              </Section>
            ))}

            {reviewUrl && (
              <Section style={{ textAlign: "center", marginTop: 32 }}>
                <Text style={{ fontSize: 16, marginBottom: 16 }}>How did we do?</Text>
                <a
                  href={reviewUrl}
                  style={{
                    display: "inline-block",
                    background: "#000",
                    color: "#fff",
                    padding: "12px 32px",
                    textDecoration: "none",
                    fontSize: 14,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  Leave a Review
                </a>
              </Section>
            )}
          </Section>

          <Text style={{ textAlign: "center", color: "#999", fontSize: 12, marginTop: 40 }}>
            © {new Date().getFullYear()} {storeName}. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
