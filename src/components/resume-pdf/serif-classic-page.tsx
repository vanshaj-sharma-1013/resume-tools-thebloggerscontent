import { Fragment } from "react";
import { Link, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { ResumeDraft } from "@/lib/resume-draft";
import {
  buildContactChunks,
  educationRows,
  experienceRows,
  formatDateRange,
  parseBulletLines,
  parseLanguageTokens,
  parseSkillTokens,
} from "@/lib/resume-pdf/shared-pdf";

const styles = StyleSheet.create({
  page: {
    paddingTop: 42,
    paddingBottom: 40,
    paddingHorizontal: 48,
    fontFamily: "Times-Roman",
    fontSize: 10.5,
    color: "#000000",
    lineHeight: 1.4,
  },
  header: { textAlign: "center", marginBottom: 18 },
  name: { fontFamily: "Times-Bold", fontSize: 21, marginBottom: 4 },
  contact: { fontSize: 9.5, color: "#27272a" },
  sectionTitle: {
    fontFamily: "Times-Bold",
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginTop: 18,
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    paddingBottom: 2,
  },
  sectionTitleFirst: {
    fontFamily: "Times-Bold",
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginTop: 4,
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    paddingBottom: 2,
  },
  summary: { fontSize: 10.5, fontStyle: "italic", marginBottom: 6 },
  expRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  expRowFirst: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  bold: { fontFamily: "Times-Bold" },
  italic: { fontStyle: "italic" },
  muted: { color: "#3f3f46" },
  bulletRow: {
    flexDirection: "row",
    marginTop: 3,
    paddingLeft: 4,
  },
  bullet: { width: 12 },
  bulletText: { flex: 1 },
  eduItem: { marginTop: 8 },
  eduItemFirst: { marginTop: 4 },
  skillsLine: { marginTop: 4, lineHeight: 1.5 },
  langLine: { marginTop: 4, lineHeight: 1.5, fontStyle: "italic" },
});

type Props = { draft: ResumeDraft };

export function SerifClassicPage({ draft }: Props) {
  const { contact, summary } = draft;
  const skills = parseSkillTokens(draft.skills);
  const experiences = experienceRows(draft);
  const educations = educationRows(draft);
  const contactChunks = buildContactChunks(contact);
  const languages = parseLanguageTokens(draft.languages);

  return (
    <Page size="LETTER" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.name}>{contact.fullName || "Your name"}</Text>
        <Text style={styles.contact}>
          {contactChunks.map((chunk, i) => (
            <Fragment key={i}>
              {i > 0 ? " | " : ""}
              {chunk.kind === "mailto" ? (
                <Link
                  src={chunk.href}
                  style={{ color: "#000", textDecoration: "none" }}
                >
                  {chunk.label}
                </Link>
              ) : null}
              {chunk.kind === "link" ? (
                <Link
                  src={chunk.href}
                  style={{ color: "#000", textDecoration: "none" }}
                >
                  {chunk.label}
                </Link>
              ) : null}
              {chunk.kind === "text" ? <Text>{chunk.label}</Text> : null}
            </Fragment>
          ))}
        </Text>
      </View>

      {summary.trim() ? (
        <View>
          <Text style={styles.sectionTitleFirst}>Professional Summary</Text>
          <Text style={styles.summary}>{summary.trim()}</Text>
        </View>
      ) : null}

      {experiences.length > 0 ? (
        <View>
          <Text
            style={summary.trim() ? styles.sectionTitle : styles.sectionTitleFirst}
          >
            Experience
          </Text>
          {experiences.map((exp, idx) => {
            const bullets = parseBulletLines(exp.bullets);
            const range = formatDateRange(
              exp.startDate,
              exp.endDate,
              exp.current,
            );
            return (
              <View key={exp.id} style={{ marginBottom: 10 }}>
                <View style={idx === 0 ? styles.expRowFirst : styles.expRow}>
                  <Text style={styles.bold}>{exp.company || "Company"}</Text>
                  <Text>{range}</Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 2,
                  }}
                >
                  <Text style={styles.italic}>{exp.role || "Role"}</Text>
                </View>
                {bullets.map((line, i) => (
                  <View key={i} style={styles.bulletRow}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.bulletText}>{line}</Text>
                  </View>
                ))}
              </View>
            );
          })}
        </View>
      ) : null}

      {educations.length > 0 ? (
        <View>
          <Text style={styles.sectionTitle}>Education</Text>
          {educations.map((edu, idx) => (
            <View
              key={edu.id}
              style={idx === 0 ? styles.eduItemFirst : styles.eduItem}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={styles.bold}>{edu.school || "School"}</Text>
                <Text>{edu.year}</Text>
              </View>
              <Text style={styles.italic}>{edu.degree}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {skills.length > 0 ? (
        <View>
          <Text style={styles.sectionTitle}>Skills</Text>
          <Text style={styles.skillsLine}>{skills.join(" • ")}</Text>
        </View>
      ) : null}

      {languages.length > 0 ? (
        <View>
          <Text style={styles.sectionTitle}>Languages</Text>
          <Text style={styles.langLine}>{languages.join("   ·   ")}</Text>
        </View>
      ) : null}
    </Page>
  );
}
