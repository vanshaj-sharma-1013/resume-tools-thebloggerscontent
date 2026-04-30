import { Fragment } from "react";
import { Link, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { CoverLetterDraft } from "@/lib/cover-letter-draft";
import { buildContactChunks } from "@/lib/cover-letter-pdf/shared-pdf";

const styles = StyleSheet.create({
  page: {
    paddingTop: 50,
    paddingBottom: 50,
    paddingHorizontal: 50,
    fontFamily: "Times-Roman",
    fontSize: 11,
    color: "#2d3748",
    lineHeight: 1.7,
  },
  sidebarDecoration: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
    backgroundColor: "#7c3aed",
  },
  header: {
    marginBottom: 40,
    paddingLeft: 10,
  },
  name: {
    fontSize: 28,
    fontFamily: "Times-Bold",
    color: "#4c1d95",
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    fontSize: 10,
    fontFamily: "Helvetica",
    textTransform: "uppercase",
    letterSpacing: 2,
    color: "#7c3aed",
    marginBottom: 15,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    fontSize: 9,
    fontFamily: "Helvetica",
    color: "#6b7280",
  },
  date: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#9ca3af",
    marginBottom: 30,
    paddingLeft: 10,
  },
  recipientBlock: {
    marginBottom: 35,
    paddingLeft: 10,
    fontFamily: "Helvetica",
    fontSize: 10,
  },
  recipientName: {
    fontFamily: "Helvetica-Bold",
    color: "#1f2937",
    fontSize: 11,
    marginBottom: 3,
  },
  subject: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
    color: "#4c1d95",
    marginBottom: 25,
    paddingLeft: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  body: {
    marginBottom: 35,
    textAlign: "justify",
    paddingLeft: 10,
  },
  signOff: {
    marginTop: 25,
    paddingLeft: 10,
  },
});

export function CreativeElegantPage({ draft }: { draft: CoverLetterDraft }) {
  const contactChunks = buildContactChunks(draft.contact);

  return (
    <Page size="LETTER" style={styles.page}>
      <View style={styles.sidebarDecoration} />

      <View style={styles.header}>
        <Text style={styles.name}>{draft.contact.fullName || "Your Name"}</Text>
        {draft.contact.professionalTitle && (
          <Text style={styles.title}>{draft.contact.professionalTitle}</Text>
        )}
        <View style={styles.contactRow}>
          {contactChunks.map((chunk, i) => (
            <Fragment key={i}>
              {i > 0 && <Text>/</Text>}
              {chunk.kind === "mailto" || chunk.kind === "link" ? (
                <Link src={chunk.href} style={{ color: "#7c3aed", textDecoration: "none" }}>
                  {chunk.label}
                </Link>
              ) : (
                <Text>{chunk.label}</Text>
              )}
            </Fragment>
          ))}
        </View>
      </View>

      <Text style={styles.date}>{draft.date}</Text>

      <View style={styles.recipientBlock}>
        <Text style={styles.recipientName}>{draft.recipient.name}</Text>
        {draft.recipient.role && <Text>{draft.recipient.role}</Text>}
        {draft.recipient.company && <Text>{draft.recipient.company}</Text>}
        {draft.recipient.address && <Text>{draft.recipient.address}</Text>}
      </View>

      {draft.subject && <Text style={styles.subject}>{draft.subject}</Text>}

      <Text style={styles.body}>{draft.body}</Text>

      <View style={styles.signOff}>
        <Text>{draft.signOff}</Text>
        <Text style={{ fontFamily: "Times-Bold", color: "#4c1d95", fontSize: 14, marginTop: 8 }}>
          {draft.contact.fullName}
        </Text>
      </View>
    </Page>
  );
}
