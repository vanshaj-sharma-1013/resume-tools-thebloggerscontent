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
  splitSkillsIntoColumns,
} from "@/lib/resume-pdf/shared-pdf";
import { withHttp } from "@/lib/resume-pdf/contact-url";

const GRAY = "#6b7280";
const DARK = "#171717";

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 36,
    paddingHorizontal: 44,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: DARK,
    lineHeight: 1.45,
  },
  name: {
    fontFamily: "Helvetica-Bold",
    fontSize: 20,
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "#000000",
  },
  title: {
    fontFamily: "Helvetica",
    fontSize: 11,
    textAlign: "center",
    color: GRAY,
    marginTop: 10,
  },
  contact: {
    marginTop: 10,
    fontSize: 9,
    textAlign: "center",
    color: GRAY,
    lineHeight: 1.5,
  },
  rule: {
    height: 1,
    backgroundColor: "#000000",
    marginTop: 14,
    marginBottom: 12,
  },
  sectionGroup: {
    paddingTop: 12,
    marginBottom: 8,
  },
  sectionTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    color: "#000000",
    marginTop: 12,
    marginBottom: 8,
  },
  sectionTitleFirst: {
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    color: "#000000",
    marginTop: 4,
    marginBottom: 8,
  },
  about: {
    fontSize: 10,
    lineHeight: 1.55,
    color: DARK,
    textAlign: "left",
  },
  orgLine: {
    fontSize: 9,
    color: GRAY,
    marginTop: 10,
  },
  orgLineFirst: {
    fontSize: 9,
    color: GRAY,
    marginTop: 4,
  },
  roleBold: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    color: "#000000",
    marginTop: 4,
  },
  expSpacer: { marginBottom: 14 },
  bulletRow: { flexDirection: "row", marginTop: 3 },
  bullet: { width: 10, fontSize: 10 },
  bulletText: { flex: 1, fontSize: 10, lineHeight: 1.45 },
  skillCol: { flex: 1, paddingHorizontal: 4 },
  skillBullet: { flexDirection: "row", marginTop: 3 },
  eduSchoolLine: {
    fontSize: 9,
    color: GRAY,
    marginTop: 8,
  },
  eduSchoolLineFirst: { fontSize: 9, color: GRAY, marginTop: 4 },
  footerBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 10,
    backgroundColor: "#4b5563",
  },
  langLine: {
    fontSize: 10,
    lineHeight: 1.5,
    color: DARK,
  },
});

type Props = { draft: ResumeDraft };

/** Build centered contact with text labels (no emoji) for reliable PDF fonts */
function centeredContactParts(contact: ResumeDraft["contact"]): string[] {
  const parts: string[] = [];
  if (contact.phone.trim()) parts.push(`Tel. ${contact.phone.trim()}`);
  if (contact.email.trim()) parts.push(contact.email.trim());
  if (contact.location.trim()) parts.push(contact.location.trim());
  return parts;
}

export function CenteredMinimalPage({ draft }: Props) {
  const { contact, summary } = draft;
  const skills = parseSkillTokens(draft.skills);
  const experiences = experienceRows(draft);
  const educations = educationRows(draft);
  const contactChunks = buildContactChunks(contact);
  const simpleParts = centeredContactParts(contact);
  const skillCols = splitSkillsIntoColumns(skills, 3);
  const languages = parseLanguageTokens(draft.languages);

  return (
    <Page size="LETTER" style={styles.page}>
      <View wrap={false}>
        <Text style={styles.name}>
          {(contact.fullName.trim() || "Your name").toUpperCase()}
        </Text>
        {contact.professionalTitle.trim() ? (
          <Text style={styles.title}>
            {contact.professionalTitle.trim()}
          </Text>
        ) : null}
        {simpleParts.length > 0 ? (
          <Text style={styles.contact}>
            {simpleParts.join("   ·   ")}
          </Text>
        ) : contactChunks.length > 0 ? (
          <Text style={styles.contact}>
            {contactChunks.map((chunk, i) => (
              <Fragment key={i}>
                {i > 0 ? <Text> · </Text> : null}
                {chunk.kind === "mailto" ? (
                  <Link
                    src={chunk.href}
                    style={{ color: "#1d4ed8", textDecoration: "none" }}
                  >
                    {chunk.label}
                  </Link>
                ) : null}
                {chunk.kind === "link" ? (
                  <Link
                    src={chunk.href}
                    style={{ color: "#1d4ed8", textDecoration: "none" }}
                  >
                    {chunk.label}
                  </Link>
                ) : null}
                {chunk.kind === "text" ? <Text>{chunk.label}</Text> : null}
              </Fragment>
            ))}
          </Text>
        ) : null}
        <View style={styles.rule} />
      </View>

      {summary.trim() ? (
        <View style={styles.sectionGroup}>
          <Text style={styles.sectionTitleFirst}>About me</Text>
          <Text style={styles.about}>{summary.trim()}</Text>
        </View>
      ) : null}

      {educations.length > 0 ? (
        <View style={styles.sectionGroup}>
          <Text style={styles.sectionTitle}>Education</Text>
          {educations.map((edu, idx) => {
            const range = edu.year.trim();
            const org = edu.school.trim() || "School";
            const line = range ? `${org} | ${range}` : org;
            return (
              <View key={edu.id}>
                <Text
                  style={idx === 0 ? styles.eduSchoolLineFirst : styles.eduSchoolLine}
                >
                  {line}
                </Text>
                {edu.degree.trim() ? (
                  <Text style={styles.roleBold}>{edu.degree.trim()}</Text>
                ) : null}
              </View>
            );
          })}
        </View>
      ) : null}

      {experiences.length > 0 ? (
        <View style={styles.sectionGroup}>
          <Text style={styles.sectionTitle}>Work experience</Text>
          {experiences.map((exp, idx) => {
            const bullets = parseBulletLines(exp.bullets);
            const range = formatDateRange(
              exp.startDate,
              exp.endDate,
              exp.current,
            );
            const company = exp.company.trim() || "Company";
            const role = exp.role.trim() || "Role";
            const orgLine = range ? `${company} | ${range}` : company;
            const isLast = idx === experiences.length - 1;
            return (
              <View
                key={exp.id}
                style={isLast ? undefined : styles.expSpacer}
              >
                <Text
                  style={idx === 0 ? styles.orgLineFirst : styles.orgLine}
                >
                  {orgLine}
                </Text>
                <Text style={styles.roleBold}>{role}</Text>
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

      {skills.length > 0 ? (
        <View style={{ ...styles.sectionGroup, marginBottom: 12 }}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <View style={{ flexDirection: "row", marginTop: 4 }}>
            {skillCols.map((col, ci) => (
              <View key={ci} style={styles.skillCol}>
                {col.map((s, si) => (
                  <View key={si} style={styles.skillBullet}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={{ ...styles.bulletText, flex: 1 }}>{s}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {languages.length > 0 ? (
        <View style={styles.sectionGroup}>
          <Text style={styles.sectionTitle}>Languages</Text>
          <Text style={styles.langLine}>{languages.join("  ·  ")}</Text>
        </View>
      ) : null}

      <View style={styles.footerBar} fixed />
    </Page>
  );
}
