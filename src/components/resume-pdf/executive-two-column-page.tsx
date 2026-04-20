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

const BLUE = "#2563eb";
const GRAY = "#6b7280";
const LINE = "#e5e7eb";

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 36,
    paddingHorizontal: 40,
    fontFamily: "Helvetica",
    fontSize: 9,
    color: "#111111",
    lineHeight: 1.45,
  },
  name: {
    fontFamily: "Helvetica-Bold",
    fontSize: 18,
    color: "#000000",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  headline: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    color: BLUE,
    marginTop: 10,
    lineHeight: 1.4,
  },
  contact: { marginTop: 10, fontSize: 8, lineHeight: 1.5 },
  row: { flexDirection: "row", marginTop: 12 },
  colMain: { width: "57%", paddingRight: 10 },
  colSide: {
    width: "43%",
    paddingLeft: 12,
    borderLeftWidth: 1,
    borderLeftColor: LINE,
  },
  sectionLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    color: "#000000",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
    paddingBottom: 4,
    borderBottomWidth: 2,
    borderBottomColor: "#000000",
  },
  summary: {
    fontSize: 9,
    color: "#374151",
    lineHeight: 1.5,
    marginBottom: 10,
  },
  expRole: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    color: "#000000",
    marginTop: 8,
  },
  expCompany: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    color: BLUE,
    marginTop: 5,
  },
  expDates: {
    fontSize: 8,
    color: GRAY,
    marginTop: 3,
  },
  bulletRow: {
    flexDirection: "row",
    marginTop: 3,
  },
  bullet: { width: 10, fontSize: 9 },
  bulletText: { flex: 1, fontSize: 9, color: "#374151", lineHeight: 1.45 },
  jobDivider: {
    marginTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: LINE,
  },
  sideSection: { marginBottom: 12 },
  sideLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    color: "#000000",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    paddingBottom: 3,
  },
  skillCol: { width: "48%", paddingRight: 6 },
  skillRow: {
    flexDirection: "row",
    marginTop: 5,
    alignItems: "flex-start",
  },
  skillRowFirst: {
    flexDirection: "row",
    marginTop: 2,
    alignItems: "flex-start",
  },
  skillBullet: { width: 9, fontSize: 9, color: "#111111" },
  skillText: { flex: 1, fontSize: 9, color: "#111111", lineHeight: 1.35 },
  eduDegree: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    color: "#000000",
    marginTop: 6,
  },
  eduSchool: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    color: BLUE,
    marginTop: 2,
  },
  eduMeta: { fontSize: 8, color: GRAY, marginTop: 2 },
  langLine: {
    fontSize: 9,
    color: "#111111",
    lineHeight: 1.5,
    marginTop: 2,
  },
});

type Props = { draft: ResumeDraft };

function formatHeadline(title: string): string {
  return title
    .split(/[,|]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .join(" | ");
}

export function ExecutiveTwoColumnPage({ draft }: Props) {
  const { contact, summary } = draft;
  const skills = parseSkillTokens(draft.skills);
  const experiences = experienceRows(draft);
  const educations = educationRows(draft);
  const contactChunks = buildContactChunks(contact);
  const headline = contact.professionalTitle.trim()
    ? formatHeadline(contact.professionalTitle.trim())
    : "";
  const skillColumns = splitSkillsIntoColumns(skills, 2);
  const languages = parseLanguageTokens(draft.languages);

  return (
    <Page size="LETTER" style={styles.page}>
      <View wrap={false}>
        <Text style={styles.name}>
          {(contact.fullName.trim() || "Your name").toUpperCase()}
        </Text>
        {headline ? <Text style={styles.headline}>{headline}</Text> : null}
        {contactChunks.length > 0 ? (
          <Text style={styles.contact}>
            {contactChunks.map((chunk, i) => (
              <Fragment key={i}>
                {i > 0 ? <Text style={{ color: GRAY }}> · </Text> : null}
                {chunk.kind === "mailto" ? (
                  <Link
                    src={chunk.href}
                    style={{ color: BLUE, textDecoration: "none" }}
                  >
                    {chunk.label}
                  </Link>
                ) : null}
                {chunk.kind === "link" ? (
                  <Link
                    src={chunk.href}
                    style={{ color: BLUE, textDecoration: "none" }}
                  >
                    {chunk.label}
                  </Link>
                ) : null}
                {chunk.kind === "text" ? (
                  <Text style={{ color: "#374151" }}>{chunk.label}</Text>
                ) : null}
              </Fragment>
            ))}
          </Text>
        ) : null}
      </View>

      <View style={styles.row}>
        <View style={styles.colMain}>
          {summary.trim() ? (
            <View style={{ marginBottom: 8 }}>
              <Text style={styles.sectionLabel}>Summary</Text>
              <Text style={styles.summary}>{summary.trim()}</Text>
            </View>
          ) : null}

          {experiences.length > 0 ? (
            <View>
              <Text style={styles.sectionLabel}>Experience</Text>
              {experiences.map((exp, idx) => {
                const bullets = parseBulletLines(exp.bullets);
                const range = formatDateRange(
                  exp.startDate,
                  exp.endDate,
                  exp.current,
                );
                const role = exp.role.trim() || "Role";
                const company = exp.company.trim();
                const isLast = idx === experiences.length - 1;
                return (
                  <View
                    key={exp.id}
                    style={!isLast ? styles.jobDivider : { marginBottom: 4 }}
                  >
                    <Text
                      style={
                        idx === 0
                          ? { ...styles.expRole, marginTop: 0 }
                          : styles.expRole
                      }
                    >
                      {role}
                    </Text>
                    {company ? (
                      <Text style={styles.expCompany}>{company}</Text>
                    ) : null}
                    {range ? <Text style={styles.expDates}>{range}</Text> : null}
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
        </View>

        <View style={styles.colSide}>
          {skills.length > 0 ? (
            <View style={styles.sideSection}>
              <Text style={styles.sideLabel}>Skills</Text>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                {skillColumns.map((col, ci) => (
                  <View key={ci} style={styles.skillCol}>
                    {col.map((skill, si) => {
                      const isFirst = ci === 0 && si === 0;
                      return (
                        <View
                          key={`${skill}-${ci}-${si}`}
                          style={isFirst ? styles.skillRowFirst : styles.skillRow}
                        >
                          <Text style={styles.skillBullet}>•</Text>
                          <Text style={styles.skillText}>{skill}</Text>
                        </View>
                      );
                    })}
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          {educations.length > 0 ? (
            <View style={styles.sideSection}>
              <Text style={styles.sideLabel}>Education</Text>
              {educations.map((edu) => (
                <View key={edu.id} wrap={false}>
                  <Text style={styles.eduDegree}>
                    {edu.degree.trim() || "Degree"}
                  </Text>
                  {edu.school.trim() ? (
                    <Text style={styles.eduSchool}>{edu.school.trim()}</Text>
                  ) : null}
                  {edu.year.trim() ? (
                    <Text style={styles.eduMeta}>{edu.year.trim()}</Text>
                  ) : null}
                </View>
              ))}
            </View>
          ) : null}

          {languages.length > 0 ? (
            <View style={styles.sideSection}>
              <Text style={styles.sideLabel}>Languages</Text>
              <Text style={styles.langLine}>{languages.join("  ·  ")}</Text>
            </View>
          ) : null}
        </View>
      </View>
    </Page>
  );
}
