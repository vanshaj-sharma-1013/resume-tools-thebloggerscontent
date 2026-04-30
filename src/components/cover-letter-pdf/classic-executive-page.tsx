import { Fragment } from "react";
import { Link, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import type { CoverLetterDraft } from "@/lib/cover-letter-draft";
import { buildContactChunks } from "@/lib/cover-letter-pdf/shared-pdf";

const styles = StyleSheet.create({
  page: {
    paddingTop: 72,
    paddingBottom: 72,
    paddingHorizontal: 72,
    fontFamily: "Times-Roman",
    fontSize: 11,
    color: "#000000",
    lineHeight: 1.5,
  },
  header: {
    alignItems: "center",
    marginBottom: 48,
    borderBottom: 1,
    borderBottomColor: "#000000",
    paddingBottom: 24,
  },
  name: {
    fontSize: 22,
    fontFamily: "Times-Bold",
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    fontSize: 9,
    fontFamily: "Times-Roman",
  },
  date: {
    marginBottom: 24,
  },
  recipientBlock: {
    marginBottom: 32,
  },
  recipientName: {
    fontFamily: "Times-Bold",
    marginBottom: 2,
  },
  subject: {
    fontFamily: "Times-Bold",
    textDecoration: "underline",
    marginBottom: 24,
  },
  body: {
    marginBottom: 32,
    textAlign: "justify",
  },
  signOff: {
    marginTop: 24,
  },
});

export function ClassicExecutivePage({ draft }: { draft: CoverLetterDraft }) {
  const contactChunks = buildContactChunks(draft.contact);

  return (
    <Page size="LETTER" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.name}>{draft.contact.fullName || "Your Name"}</Text>
        <View style={styles.contactRow}>
          {contactChunks.map((chunk, i) => (
            <Fragment key={i}>
              {i > 0 && <Text>|</Text>}
              {chunk.kind === "mailto" || chunk.kind === "link" ? (
                <Link src={chunk.href} style={{ color: "#000000", textDecoration: "none" }}>
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

      {draft.subject && <Text style={styles.subject}>RE: {draft.subject}</Text>}

      <Text style={styles.body}>{draft.body}</Text>

      <View style={styles.signOff}>
        <Text>{draft.signOff}</Text>
        <Text style={{ fontFamily: "Times-Bold", marginTop: 24 }}>
          {draft.contact.fullName}
        </Text>
      </View>
    </Page>
  );
}
