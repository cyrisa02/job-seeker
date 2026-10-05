// src/emails/answer-approved.tsx

import { Html, Head, Body, Container, Text, Heading, Link, Hr, Button } from "@react-email/components";

interface AnswerApprovedProps {
  questionTitle: string;
  questionSlug: string;
  answerContent: string;
  authorName: string;
}

export default function AnswerApproved({
  questionTitle,
  questionSlug,
  answerContent,
  authorName,
}: AnswerApprovedProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: "#f6f9fc", fontFamily: "sans-serif" }}>
        <Container style={{ backgroundColor: "#ffffff", margin: "0 auto", padding: "20px 0 48px", maxWidth: "580px" }}>
          <Heading style={{ color: "#1a1a1a", fontSize: "24px", fontWeight: "bold", textAlign: "center" }}>
            ✅ Nouvelle réponse approuvée
          </Heading>
          <Text style={{ color: "#525f7f", fontSize: "14px", textAlign: "center" }}>
            Une réponse a été ajoutée à votre question
          </Text>

          <div style={{ backgroundColor: "#f8f9fa", padding: "16px", borderRadius: "8px", margin: "24px 0" }}>
            <Text style={{ color: "#1a1a1a", fontSize: "16px", fontWeight: "bold", margin: "0 0 8px 0" }}>
              {questionTitle}
            </Text>
          </div>

          <Text style={{ color: "#525f7f", fontSize: "14px", lineHeight: "24px" }}>
            <strong>{authorName}</strong> a répondu :
          </Text>

          <div style={{ backgroundColor: "#f8f9fa", padding: "16px", borderRadius: "8px", margin: "16px 0", borderLeft: "4px solid #2563eb" }}>
            <Text style={{ color: "#1a1a1a", fontSize: "14px", lineHeight: "24px", margin: 0 }}>
              {answerContent.length > 200 ? answerContent.substring(0, 200) + "..." : answerContent}
            </Text>
          </div>

          <div style={{ textAlign: "center", margin: "32px 0" }}>
            <Button
              href={`${baseUrl}/questions/${questionSlug}`}
              style={{
                backgroundColor: "#2563eb",
                color: "#ffffff",
                padding: "12px 24px",
                borderRadius: "6px",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Voir la réponse complète
            </Button>
          </div>

          <Hr style={{ borderColor: "#e6ebf1", margin: "20px 0" }} />
          <Text style={{ color: "#8898aa", fontSize: "12px", textAlign: "center" }}>
            Vous recevez cet email car vous avez posé cette question sur Plateforme Emploi 2026.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}