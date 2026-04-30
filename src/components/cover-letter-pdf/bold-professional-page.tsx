import { Fragment } from "react";
import { Link, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { CoverLetterDraft } from "@/lib/cover-letter-draft";
import { buildContactChunks } from "@/lib/cover-letter-pdf/shared-pdf";

const styles = StyleSheet.create({
  page: {
    paddingTop: 0,
    paddingBottom: 60,
    paddingHorizontal: 60,
    fontFamily: "Helvetica",
    fontSize: 10.5,
    color: "#334155",
    lineHeight: 1.6,
  },
  topBar: {
    height: 120,
    backgroundColor: "#2563eb",
    marginHorizontal: -60,
    marginBottom: 40,
    paddingHorizontal: 60,
    paddingTop: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingBottom: 20,
  },
  name: {
    fontSize: 32,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
  },
  topContact: {
    fontSize: 9,
    color: "#bfdbfe",
    textAlign: "right",
  },
  date: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    color: "#64748b",
    marginBottom: 20,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  recipientBlock: {
    marginBottom: 35,
    backgroundColor: "#f8fafc",
    padding: 15,
    borderRadius: 4,
    borderLeft: 4,
    borderLeftColor: "#2563eb",
  },
  recipientName: {
    fontFamily: "Helvetica-Bold",
    color: "#1e293b",
    fontSize: 11,
    marginBottom: 2,
  },
  subject: {
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
    color: "#1e293b",
    marginBottom: 25,
    borderBottom: 1,
    borderBottomColor: "#e2e8f0",
    paddingBottom: 8,
  },
  body: {
    marginBottom: 35,
    textAlign: "justify",
  },
  signOff: {
    marginTop: 20,
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 60,
    right: 60,
    borderTop: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 15,
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
    fontSize: 8,
    color: "#94a3b8",
  },
});

export function BoldProfessionalPage({ draft }: { draft: CoverLetterDraft }) {
  const contactChunks = buildContactChunks(draft.contact);

  return (
    <Page size="LETTER" style={styles.page}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.name}>{draft.contact.fullName || "Your Name"}</Text>
          <Text style={{ color: "#bfdbfe", fontSize: 11, marginTop: 4 }}>
            {draft.contact.professionalTitle}
          </Text>
        </View>
        <View style={styles.topContact}>
          {draft.contact.email && <Text>{draft.contact.email}</Text>}
          {draft.contact.phone && <Text>{draft.contact.phone}</Text>}
          {draft.contact.location && <Text>{draft.contact.location}</Text>}
        </View>
      </View>

      <Text style={styles.date}>{draft.date}</Text>

      <View style={styles.recipientBlock}>
        <Text style={styles.recipientName}>{draft.recipient.name}</Text>
        {draft.recipient.role && <Text>{draft.recipient.role}</Text>}
        {draft.recipient.company && <Text>{draft.recipient.company}</Text>}
        {draft.recipient.address && <Text>{draft.recipient.address}</Text>}
      </View>

      {draft.subject && <Text style={styles.subject}>SUBJECT: {draft.subject}</Text>}

      <Text style={styles.body}>{draft.body}</Text>

      <View style={styles.signOff}>
        <Text>{draft.signOff}</Text>
        <Text style={{ fontFamily: "Helvetica-Bold", color: "#2563eb", fontSize: 13, marginTop: 8 }}>
          {draft.contact.fullName}
        </Text>
      </View>

      <View style={styles.footer}>
        {contactChunks.filter(c => c.kind === "link").map((chunk, i) => (
          <Fragment key={i}>
            {i > 0 && <Text>•</Text>}
            <Link src={chunk.href} style={{ color: "#94a3b8", textDecoration: "none" }}>
              {chunk.label}
            </Link>
          </Fragment>
        ))}
      </View>
    </Page>
  );
}
