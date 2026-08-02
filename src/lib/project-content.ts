/**
 * Project content seam — validates Markdown body against the canonical
 * ordered grammar and returns render facts or source-specific diagnostics.
 *
 * Canonical grammar (ordered):
 *   1. ### title
 *   2. optional #### Link: <absolute HTTP(S) URL>
 *   3. optional **Description**: plain text
 *   4. zero or more #### <name> responsibility sections with bullet points
 */

// --- Types ---

export interface ProjectContentDiagnostics {
  source: string;
  errors: string[];
}

export interface ProjectResponsibilitySection {
  heading: string;
  bullets: string[];
}

export interface ProjectContent {
  title: string;
  link?: string;
  description?: string;
  responsibilities: ProjectResponsibilitySection[];
}

export type ProjectContentResult =
  | { ok: true; content: ProjectContent }
  | { ok: false; diagnostics: ProjectContentDiagnostics };

// --- Helpers ---

function isBlank(line: string): boolean {
  return line.trim() === "";
}

function isInlineMarkdown(text: string): boolean {
  return /\*\*|__|~~|``/.test(text);
}

function isValidHttpUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

// --- Parser ---

export function parseProjectBody(
  body: string,
  source: string
): ProjectContentResult {
  const errors: string[] = [];
  const lines = body.split("\n");
  let i = 0;

  // Skip leading blank lines
  while (i < lines.length && isBlank(lines[i])) i++;

  // 1. Title — must be first ### heading
  const titleMatch = lines[i]?.match(/^###\s+(.+)$/);
  if (!titleMatch) {
    errors.push(`missing title heading`);
    return { ok: false, diagnostics: { source, errors } };
  }
  const title = titleMatch[1].trim();
  if (isInlineMarkdown(title)) {
    errors.push(`title contains inline formatting`);
  }
  i++;

  // Skip blank lines after title
  while (i < lines.length && isBlank(lines[i])) i++;

  // 2. Optional link
  let link: string | undefined;
  const linkMatch = lines[i]?.match(/^####\s+[Ll]ink:\s*(.+)$/);
  if (linkMatch) {
    const url = linkMatch[1].trim();
    if (!isValidHttpUrl(url)) {
      errors.push(`link must be an absolute HTTP or HTTPS URL`);
    }
    link = url;
    i++;
    while (i < lines.length && isBlank(lines[i])) i++;
  }

  // 3. Optional description
  let description: string | undefined;
  const descMatch = lines[i]?.match(/^\*\*Description\*\*:\s*(.+)$/);
  if (descMatch) {
    const text = descMatch[1].trim();
    if (text === "") {
      errors.push(`description is empty`);
    }
    if (isInlineMarkdown(text)) {
      errors.push(`description contains inline formatting`);
    }
    description = text;
    i++;
    while (i < lines.length && isBlank(lines[i])) i++;
  }

  // 4. Responsibility sections
  const responsibilities: ProjectResponsibilitySection[] = [];

  while (i < lines.length) {
    if (isBlank(lines[i])) {
      i++;
      continue;
    }

    const headingMatch = lines[i].match(/^####\s+(.+)$/);
    if (headingMatch) {
      const heading = headingMatch[1].trim();
      if (/^[Ll]ink:/.test(heading)) {
        errors.push(`link must appear before responsibility sections`);
      }
      i++;

      const bullets: string[] = [];
      while (i < lines.length && !lines[i].match(/^#{2,4}\s/)) {
        if (isBlank(lines[i])) {
          i++;
          continue;
        }
        const bulletLine = lines[i].match(/^[-*]\s*(.*)$/);
        if (bulletLine) {
          const text = bulletLine[1].trim();
          if (text === "") {
            errors.push(`empty bullet in "${heading}"`);
          }
          if (isInlineMarkdown(text)) {
            errors.push(`bullet contains inline formatting in "${heading}"`);
          }
          bullets.push(text);
        } else {
          errors.push(
            `non-bullet content in responsibility section "${heading}"`
          );
        }
        i++;
      }

      if (bullets.length === 0) {
        errors.push(`responsibility section "${heading}" has no bullets`);
      }

      responsibilities.push({ heading, bullets });
    } else {
      errors.push(`unexpected content after project fields`);
      break;
    }
  }

  if (errors.length > 0) {
    return { ok: false, diagnostics: { source, errors } };
  }

  return {
    ok: true,
    content: { title, link, description, responsibilities },
  };
}
