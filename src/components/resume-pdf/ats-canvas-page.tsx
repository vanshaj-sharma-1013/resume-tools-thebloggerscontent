import { Fragment } from "react";
import { Link, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { ResumeDraft } from "@/lib/resume-draft";
import type { PdfThemeTokens } from "@/lib/resume-pdf/theme-tokens";
import {
  buildContactChunks,
  educationRows,
  experienceRows,
  formatDateRange,
  parseBulletLines,
  parseLanguageTokens,
  parseSkillTokens,
} from "@/lib/resume-pdf/shared-pdf";
import { withHttp } from "@/lib/resume-pdf/contact-url";

const styles = StyleSheet.create({
  page: {
    paddingTop: 42,
    paddingBottom: 40,
    paddingHorizontal: 44,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#111111",
    lineHeight: 1.45,
  },
  muted: { color: "#3f3f46", fontFamily: "Helvetica" },
  sectionBlock: { marginTop: 10 },
  bulletRow: {
    flexDirection: "row",
    marginTop: 3,
    paddingLeft: 2,
  },
  bulletGlyph: {
    width: 10,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#111111",
  },
  bulletText: {
    flex: 1,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#111111",
    lineHeight: 1.45,
  },
  expTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 10,
  },
  expTopRowFirst: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 8,
  },
  expRole: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
    color: "#111111",
    maxWidth: "72%",
  },
  expDates: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: "#3f3f46",
    textAlign: "right",
    maxWidth: "28%",
  },
  expCompany: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1f2937",
    marginTop: 5,
    marginBottom: 8,
  },
  expBlockAfterBullets: {
    marginBottom: 14,
  },
  summary: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#111111",
    lineHeight: 1.5,
    textAlign: "left",
  },
  skillsLine: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#111111",
    lineHeight: 1.5,
  },
  eduRow: {
    marginTop: 8,
  },
  eduBold: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    color: "#111111",
  },
  eduMeta: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: "#3f3f46",
    marginTop: 2,
  },
});

type Props = { draft: ResumeDraft; t: PdfThemeTokens };

export function AtsCanvasPage({ draft, t }: Props) {
  const { contact, summary } = draft;
  const skills = parseSkillTokens(draft.skills);
  const experiences = experienceRows(draft);
  const educations = educationRows(draft);
  const contactChunks = buildContactChunks(contact);
  const languages = parseLanguageTokens(draft.languages);

  const sectionTitle = (label: string) => (
    <View
      style={{
        marginTop: t.sectionGap,
        marginBottom: 6,
        flexDirection: "row",
        alignItems: "center",
      }}
      wrap={false}
    >
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontFamily: "Helvetica-Bold",
            fontSize: t.sectionTitleSize,
            color: "#111111",
            letterSpacing: 1.1,
            textTransform: "uppercase",
          }}
        >
          {label}
        </Text>
        <View
          style={{
            marginTop: 4,
            height: 2,
            width: t.nameRuleWidth === "full" ? "100%" : t.nameRuleWidth,
            backgroundColor: t.accent,
          }}
        />
      </View>
    </View>
  );

  return (
    <Page size="LETTER" style={styles.page}>
      <View style={{ marginBottom: t.headerMarginBottom }} wrap={false}>
        <Text
          style={{
            fontFamily: "Helvetica-Bold",
            fontSize: t.nameSize,
            color: "#0a0a0a",
          }}
        >
          {contact.fullName.trim() || "Your name"}
        </Text>
        {contact.professionalTitle.trim() ? (
          <Text
            style={{
              fontFamily: "Helvetica",
              fontSize: t.titleSize,
              color: "#27272a",
              marginTop: 8,
            }}
          >
            {contact.professionalTitle.trim()}
          </Text>
        ) : null}
        {contactChunks.length > 0 ? (
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontSize: t.contactSize, lineHeight: 1.45 }}>
              {contactChunks.map((chunk, i) => (
                <Fragment key={i}>
                  {i > 0 ? <Text style={styles.muted}> · </Text> : null}
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
                  {chunk.kind === "text" ? (
                    <Text style={styles.muted}>{chunk.label}</Text>
                  ) : null}
                </Fragment>
              ))}
            </Text>
          </View>
        ) : null}
      </View>

      {summary.trim() ? (
        <View style={styles.sectionBlock}>
          {sectionTitle("Professional summary")}
          <Text style={styles.summary}>{summary.trim()}</Text>
        </View>
      ) : null}

      {experiences.length > 0 ? (
        <View style={styles.sectionBlock}>
          {sectionTitle("Experience")}
          {experiences.map((exp, jobIndex) => {
            const bullets = parseBulletLines(exp.bullets);
            const range = formatDateRange(
              exp.startDate,
              exp.endDate,
              exp.current,
            );
            const role = exp.role.trim() || "Role";
            const company = exp.company.trim();
            const isLast = jobIndex === experiences.length - 1;
            return (
              <View
                key={exp.id}
                style={isLast ? undefined : styles.expBlockAfterBullets}
              >
                <View
                  style={
                    jobIndex === 0 ? styles.expTopRowFirst : styles.expTopRow
                  }
                >
                  <Text style={styles.expRole}>{role}</Text>
                  {range ? (
                    <Text style={styles.expDates}>{range}</Text>
                  ) : null}
                </View>
                {company ? (
                  <Text style={styles.expCompany}>{company}</Text>
                ) : (
                  <View style={{ marginBottom: 8 }} />
                )}
                {bullets.map((line, i) => (
                  <View key={`${exp.id}-b-${i}`} style={styles.bulletRow}>
                    <Text style={styles.bulletGlyph}>•</Text>
                    <Text style={styles.bulletText}>{line}</Text>
                  </View>
                ))}
              </View>
            );
          })}
        </View>
      ) : null}

      {educations.length > 0 ? (
        <View style={styles.sectionBlock}>
          {sectionTitle("Education")}
          {educations.map((edu) => (
            <View key={edu.id} style={styles.eduRow}>
              <Text style={styles.eduBold}>
                {[edu.school.trim(), edu.degree.trim()]
                  .filter(Boolean)
                  .join(" — ") || "Education"}
              </Text>
              {edu.year.trim() ? (
                <Text style={styles.eduMeta}>{edu.year.trim()}</Text>
              ) : null}
            </View>
          ))}
        </View>
      ) : null}

      {skills.length > 0 ? (
        <View style={styles.sectionBlock}>
          {sectionTitle("Skills")}
          <Text style={styles.skillsLine}>{skills.join(" · ")}</Text>
        </View>
      ) : null}

      {languages.length > 0 ? (
        <View style={styles.sectionBlock}>
          {sectionTitle("Languages")}
          <Text style={styles.skillsLine}>{languages.join(" · ")}</Text>
        </View>
      ) : null}
    </Page>
  );
}
