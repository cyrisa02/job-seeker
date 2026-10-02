// src/emails/weekly-digest.tsx

import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Link,
  Hr,
} from "@react-email/components";
import * as React from "react";

interface WeeklyDigestProps {
  articles: Array<{ title: string; slug: string; author: string }>;
  resolvedQuestions: Array<{ title: string; slug: string }>;
  weekRange: string;
}

export default function WeeklyDigest({
  articles,
  resolvedQuestions,
  weekRange,
}: WeeklyDigestProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}> Votre récap hebdomadaire</Heading>
          <Text style={text}>Semaine du {weekRange}</Text>

          {articles.length > 0 && (
            <Section style={section}>
              <Heading as="h2" style={h2}>
                {" "}
                Nouveaux articles ({articles.length})
              </Heading>
              {articles.map((article, i) => (
                <Text key={i} style={item}>
                  <Link
                    href={`${baseUrl}/articles/${article.slug}`}
                    style={link}
                  >
                    {article.title}
                  </Link>
                  <Text style={author}>par {article.author}</Text>
                </Text>
              ))}
            </Section>
          )}

          {resolvedQuestions.length > 0 && (
            <Section style={section}>
              <Heading as="h2" style={h2}>
                ✅ Questions résolues ({resolvedQuestions.length})
              </Heading>
              {resolvedQuestions.map((q, i) => (
                <Text key={i} style={item}>
                  <Link href={`${baseUrl}/questions/${q.slug}`} style={link}>
                    {q.title}
                  </Link>
                </Text>
              ))}
            </Section>
          )}

          <Hr style={{ borderColor: "#e6ebf1", margin: "20px 0" }} />
          <Text
            style={{ color: "#8898aa", fontSize: "12px", textAlign: "center" }}
          >
            Vous recevez cet email car vous êtes inscrit à la newsletter de
            Plateforme Emploi 2026.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = { backgroundColor: "#f6f9fc", fontFamily: "sans-serif" };
const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "580px",
};
const h1 = {
  color: "#1a1a1a",
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
};
const h2 = {
  color: "#1a1a1a",
  fontSize: "18px",
  fontWeight: "bold",
  marginTop: "24px",
};
const text = { color: "#525f7f", fontSize: "14px", lineHeight: "24px" };
const section = { marginTop: "24px" };
const item = {
  borderBottom: "1px solid #eee",
  paddingBottom: "12px",
  marginBottom: "12px",
};
const link = { color: "#2563eb", textDecoration: "none", fontWeight: "600" };
const author = { color: "#888", fontSize: "12px", marginTop: "4px" };
const hr = { borderColor: "#e6ebf1", margin: "20px 0" };
const footer = {
  color: "#8898aa",
  fontSize: "12px",
  textAlign: "center" as const,
};
