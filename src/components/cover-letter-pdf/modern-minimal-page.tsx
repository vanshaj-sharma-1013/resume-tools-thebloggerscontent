import { Fragment } from "react";
import { Link, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { CoverLetterDraft } from "@/lib/cover-letter-draft";
import { buildContactChunks } from "@/lib/cover-letter-pdf/shared-pdf";

const styles = StyleSheet.create({
  page: {
    paddingTop: 60,
    paddingBottom: 60,
    paddingHorizontal: 60,
    fontFamily: "Helvetica",
    fontSize: 11,
    color: "#1e293b",
    lineHeight: 1.6,
  },
  header: {
    marginBottom: 40,
  },
  name: {
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    marginBottom: 4,
  },
  title: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 12,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    fontSize: 10,
    color: "#475569",
  },
  divider: {
    height: 1,
    backgroundColor: "#e2e8f0",
    marginVertical: 20,
  },
  recipientBlock: {
    marginBottom: 30,
  },
  recipientName: {
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  date: {
    marginBottom: 20,
    color: "#64748b",
  },
  subject: {
    fontFamily: "Helvetica-Bold",
    marginBottom: 20,
    fontSize: 12,
    color: "#0f172a",
  },
  body: {
    marginBottom: 30,
    textAlign: "justify",
  },
  signOff: {
    marginTop: 20,
  },
});

export function ModernMinimalPage({ draft }: { draft: CoverLetterDraft }) {
  const contactChunks = buildContactChunks(draft.contact);

  return (
    <Page size="LETTER" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.name}>{draft.contact.fullName || "Your Name"}</Text>
        {draft.contact.professionalTitle && (
          <Text style={styles.title}>{draft.contact.professionalTitle}</Text>
        )}
        <View style={styles.contactRow}>
          {contactChunks.map((chunk, i) => (
            <Fragment key={i}>
              {i > 0 && <Text>•</Text>}
              {chunk.kind === "mailto" || chunk.kind === "link" ? (
                <Link src={chunk.href} style={{ color: "#2563eb", textDecoration: "none" }}>
                  {chunk.label}
                </Link>
              ) : (
                <Text>{chunk.label}</Text>
              )}
            </Fragment>
          ))}
        </View>
      </View>

      <View style={styles.divider} />

      <Text style={styles.date}>{draft.date}</Text>

      <View style={styles.recipientBlock}>
        <Text style={styles.recipientName}>{draft.recipient.name}</Text>
        {draft.recipient.role && <Text>{draft.recipient.role}</Text>}
        {draft.recipient.company && <Text>{draft.recipient.company}</Text>}
        {draft.recipient.address && <Text>{draft.recipient.address}</Text>}
      </View>

      {draft.subject && <Text style={styles.subject}>Subject: {draft.subject}</Text>}

      <Text style={styles.body}>{draft.body}</Text>

      <View style={styles.signOff}>
        <Text>{draft.signOff}</Text>
        <Text style={{ fontFamily: "Helvetica-Bold", marginTop: 4 }}>
          {draft.contact.fullName}
        </Text>
      </View>
    </Page>
  );
}
