const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const PRIMARY = "#E7000B";

function esc(str) {
  return String(str ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]));
}

function fmtDate(d) {
  if (!d) return "Present";
  const [y, m] = d.split("-");
  const mi = parseInt(m, 10) - 1;
  return `${MONTHS[mi] ?? ""} ${y}`;
}

function dateRange(start, end) {
  if (!start && !end) return "";
  return `${fmtDate(start)} - ${end ? fmtDate(end) : "Present"}`;
}

function bullets(highlights = []) {
  if (!highlights.length) return "";
  return `<ul>${highlights.map((h) => `<li>${esc(h)}</li>`).join("")}</ul>`;
}

function heading(text) {
  return `<h2>${esc(text)}</h2>`;
}

function render(resume) {
  const b = resume.basics || {};
  const contactBits = [
    b.email && esc(b.email),
    b.phone && esc(b.phone),
    b.location && (b.location.city || b.location.countryCode)
      ? esc([b.location.city, b.location.countryCode].filter(Boolean).join(", "))
      : null,
    b.url ? `<a href="${esc(b.url)}">${esc(b.url.replace(/^https?:\/\//, ""))}</a>` : null,
    ...(b.profiles || []).map((p) => `<a href="${esc(p.url)}">${esc(p.url.replace(/^https?:\/\//, ""))}</a>`),
  ].filter(Boolean);

  const education = (resume.education || [])
    .map(
      (e) => `
      <div class="entry-row">
        <div><strong>${esc(e.institution)}</strong>${e.studyType ? `, ${esc(e.studyType)}${e.area ? ` in ${esc(e.area)}` : ""}` : ""}${e.score ? ` (${esc(e.score)})` : ""}</div>
        <div class="dates">${[e.location, esc(dateRange(e.startDate, e.endDate))].filter(Boolean).join(" | ")}</div>
      </div>`
    )
    .join("");

  const skills = (resume.skills || [])
    .map((s) => `<div class="skill-row"><strong>${esc(s.name)}:</strong> ${(s.keywords || []).map(esc).join(", ")}</div>`)
    .join("");

  const certificates = (resume.certificates || [])
    .map((c) => esc([c.name, c.issuer, c.date].filter(Boolean).join(", ")))
    .join("; ");

  const awards = (resume.awards || [])
    .map((a) => esc([a.title, a.awarder].filter(Boolean).join(", ")))
    .join("; ");

  const languages = (resume.languages || [])
    .map((l) => esc([l.language, l.fluency].filter(Boolean).join(" - ")))
    .join(", ");

  const coreCompetencies = resume.coreCompetencies && resume.coreCompetencies.length
    ? `<p class="summary">${resume.coreCompetencies.map(esc).join(", ")}</p>`
    : "";

  const work = (resume.work || [])
    .map(
      (w) => `
      <div class="item">
        <div class="entry-row">
          <div><strong>${esc(w.name)}</strong> | <em>${esc(w.position)}</em></div>
          <div class="dates">${esc(dateRange(w.startDate, w.endDate))}</div>
        </div>
        ${w.location ? `<div class="location">${esc(w.location)}</div>` : ""}
        ${bullets(w.highlights)}
      </div>`
    )
    .join("");

  const projects = (resume.projects || [])
    .map(
      (p) => `
      <div class="item">
        <div class="entry-row">
          <div><strong>${esc(p.name)}</strong>${p.description ? `, <em>${esc(p.description)}</em>` : ""}</div>
        </div>
        ${bullets(p.highlights)}
      </div>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${esc(b.name)} - Resume</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  @page { size: A4; margin: 0.5in; }
  * { box-sizing: border-box; }
  body {
    font-family: "IBM Plex Serif", Georgia, serif;
    color: #111;
    font-size: 9.5pt;
    line-height: 1.3;
    max-width: 7.5in;
    margin: 0 auto;
  }
  h1 { font-size: 17pt; margin: 0 0 2px; text-align: center; }
  .label { text-align: center; margin: 0 0 4px; font-size: 9.5pt; color: #333; }
  .contact { text-align: center; font-size: 8.5pt; margin-bottom: 8px; }
  .contact a { color: #111; text-decoration: none; }
  h2 {
    font-size: 10pt;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: ${PRIMARY};
    margin: 12px 0 5px;
    padding-bottom: 2px;
    border-bottom: 1.5px solid ${PRIMARY};
  }
  h2:first-of-type { margin-top: 0; }
  .summary { margin: 0 0 4px; }
  .entry-row { display: flex; justify-content: space-between; gap: 12px; }
  .location { font-size: 8.5pt; color: #555; margin-bottom: 1px; }
  .dates { white-space: nowrap; font-size: 8.5pt; color: #333; }
  ul { margin: 3px 0 6px; padding-left: 18px; list-style: disc; }
  li { margin-bottom: 2px; }
  li::marker { color: ${PRIMARY}; }
  .item { margin-bottom: 7px; }
  .skill-row { margin-bottom: 3px; }
</style>
</head>
<body>
  <h1>${esc(b.name)}</h1>
  ${b.label ? `<p class="label">${esc(b.label)}</p>` : ""}
  <p class="contact">${contactBits.join(" &nbsp;|&nbsp; ")}</p>

  ${resume.summary ? `${heading("Summary")}<p class="summary">${esc(resume.summary)}</p>` : ""}

  ${coreCompetencies ? `${heading("Core Competencies")}${coreCompetencies}` : ""}

  ${work ? `${heading("Experience")}${work}` : ""}

  ${projects ? `${heading("Projects")}${projects}` : ""}

  ${education ? `${heading("Education")}${education}` : ""}

  ${skills ? `${heading("Skills")}${skills}` : ""}

  ${certificates ? `${heading("Certifications")}<p class="summary">${certificates}</p>` : ""}

  ${awards ? `${heading("Awards")}<p class="summary">${awards}</p>` : ""}

  ${languages ? `${heading("Languages")}<p class="summary">${languages}</p>` : ""}
</body>
</html>`;
}

module.exports = { render };
