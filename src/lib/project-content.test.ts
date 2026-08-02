import { describe, it, expect } from "vitest";
import { parseProjectBody } from "./project-content";

function ok(body: string, source = "test.md") {
  return parseProjectBody(body, source);
}

function errors(body: string, source = "test.md") {
  const result = parseProjectBody(body, source);
  expect(result.ok).toBe(false);
  return (
    result as { ok: false; diagnostics: { source: string; errors: string[] } }
  ).diagnostics.errors;
}

describe("parseProjectBody", () => {
  describe("valid bodies", () => {
    it("parses a title-only project", () => {
      const result = ok("### FlowX.AI Platform and SDKs");
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.content.title).toBe("FlowX.AI Platform and SDKs");
        expect(result.content.link).toBeUndefined();
        expect(result.content.description).toBeUndefined();
        expect(result.content.responsibilities).toEqual([]);
      }
    });

    it("parses a project with link, description, and responsibilities", () => {
      const body = [
        "### Contentfry Social Media Wall",
        "",
        "#### Link: https://contentfry.com/en/",
        "",
        "**Description**: Web application managing social media content.",
        "",
        "#### Responsibilities",
        "",
        "- Design and implement social wall card designer",
        "- Maintain backwards compatibility of iframe embed script",
        "- Implement various social wall templates",
      ].join("\n");

      const result = ok(body);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.content.title).toBe("Contentfry Social Media Wall");
        expect(result.content.link).toBe("https://contentfry.com/en/");
        expect(result.content.description).toBe(
          "Web application managing social media content."
        );
        expect(result.content.responsibilities).toHaveLength(1);
        expect(result.content.responsibilities[0].heading).toBe(
          "Responsibilities"
        );
        expect(result.content.responsibilities[0].bullets).toEqual([
          "Design and implement social wall card designer",
          "Maintain backwards compatibility of iframe embed script",
          "Implement various social wall templates",
        ]);
      }
    });

    it("parses a project with multiple responsibility sections", () => {
      const body = [
        "### Sports bets odds comparator",
        "",
        "#### Link: https://punepariu.ro",
        "",
        "**Description**: Self-managed website powered by CraftCMS.",
        "",
        "#### Responsibilities",
        "",
        "- Implement website according to design",
        "- Implement data display using Vue.js",
        "",
        "#### Other responsibilities",
        "",
        "- Handled technical interviews",
        "- Helped colleagues on Front End queries",
      ].join("\n");

      const result = ok(body);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.content.responsibilities).toHaveLength(2);
        expect(result.content.responsibilities[0].heading).toBe(
          "Responsibilities"
        );
        expect(result.content.responsibilities[0].bullets).toEqual([
          "Implement website according to design",
          "Implement data display using Vue.js",
        ]);
        expect(result.content.responsibilities[1].heading).toBe(
          "Other responsibilities"
        );
        expect(result.content.responsibilities[1].bullets).toEqual([
          "Handled technical interviews",
          "Helped colleagues on Front End queries",
        ]);
      }
    });

    it("parses a project without a link", () => {
      const body = [
        "### CSR Management Application",
        "",
        "**Description**: Web & Mobile application handling CSR events.",
        "",
        "#### Responsibilities",
        "",
        "- Maintained new features in Node.js backend",
      ].join("\n");

      const result = ok(body);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.content.link).toBeUndefined();
        expect(result.content.description).toBe(
          "Web & Mobile application handling CSR events."
        );
      }
    });

    it("parses a project without a description", () => {
      const body = [
        "### CSR Management Application",
        "",
        "#### Responsibilities",
        "",
        "- Maintained new features in Node.js backend",
      ].join("\n");

      const result = ok(body);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.content.description).toBeUndefined();
        expect(result.content.responsibilities).toHaveLength(1);
      }
    });

    it("accepts punctuation used by current portfolio copy", () => {
      const body = [
        '### Contentfry Social Media "Wall" Customiser & Creator',
        "",
        "#### Link: https://contentfry.com/en/",
        "",
        "**Description**: Web application managing social media content from various sources and embedding selected content inside iframes and/or dedicated pages.",
        "",
        "#### Responsibilities",
        "",
        "- Design and implement social wall card designer in Vue.js",
        "- Adjust and maintain backwards compatibility of iframe embed script",
      ].join("\n");

      const result = ok(body);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.content.title).toBe(
          'Contentfry Social Media "Wall" Customiser & Creator'
        );
        expect(result.content.description).toContain("and/or");
      }
    });
  });

  describe("rejection: missing title", () => {
    it("rejects an empty body", () => {
      const errs = errors("");
      expect(errs).toContain("missing title heading");
    });

    it("rejects body starting with description", () => {
      const errs = errors("**Description**: Some text");
      expect(errs).toContain("missing title heading");
    });
  });

  describe("rejection: empty fields", () => {
    it("rejects an empty description", () => {
      const body =
        "### Title\n\n**Description**: \n\n#### Responsibilities\n\n- bullet";
      const errs = errors(body);
      expect(errs).toContain("description is empty");
    });

    it("rejects an empty responsibility section", () => {
      const body = "### Title\n\n#### Responsibilities";
      const errs = errors(body);
      expect(errs).toContain(
        'responsibility section "Responsibilities" has no bullets'
      );
    });

    it("rejects empty bullet text", () => {
      const body = "### Title\n\n#### Responsibilities\n\n- ";
      const errs = errors(body);
      expect(errs).toContain('empty bullet in "Responsibilities"');
    });
  });

  describe("rejection: invalid link", () => {
    it("rejects a non-HTTP URL", () => {
      const body =
        "### Title\n\n#### Link: ftp://example.com\n\n#### Responsibilities\n\n- bullet";
      const errs = errors(body);
      expect(errs).toContain("link must be an absolute HTTP or HTTPS URL");
    });

    it("rejects a relative URL", () => {
      const body =
        "### Title\n\n#### Link: /some/path\n\n#### Responsibilities\n\n- bullet";
      const errs = errors(body);
      expect(errs).toContain("link must be an absolute HTTP or HTTPS URL");
    });

    it("rejects a malformed URL", () => {
      const body =
        "### Title\n\n#### Link: not-a-url\n\n#### Responsibilities\n\n- bullet";
      const errs = errors(body);
      expect(errs).toContain("link must be an absolute HTTP or HTTPS URL");
    });

    it("accepts http and https URLs", () => {
      const http = ok("### Title\n\n#### Link: http://example.com");
      const https = ok("### Title\n\n#### Link: https://example.com");
      expect(http.ok).toBe(true);
      expect(https.ok).toBe(true);
    });
  });

  describe("rejection: grammar order", () => {
    it("rejects link after responsibilities", () => {
      const body =
        "### Title\n\n#### Responsibilities\n\n- bullet\n\n#### Link: https://example.com";
      const errs = errors(body);
      expect(errs).toContain("link must appear before responsibility sections");
    });

    it("rejects unexpected content after fields", () => {
      const body =
        "### Title\n\nrandom text here\n\n#### Responsibilities\n\n- bullet";
      const errs = errors(body);
      expect(errs).toContain("unexpected content after project fields");
    });
  });

  describe("rejection: inline formatting", () => {
    it("rejects bold title", () => {
      const body = "### **Bold Title**";
      const errs = errors(body);
      expect(errs).toContain("title contains inline formatting");
    });

    it("rejects bold description", () => {
      const body = "### Title\n\n**Description**: **bold text**";
      const errs = errors(body);
      expect(errs).toContain("description contains inline formatting");
    });

    it("rejects double-backtick code in bullet", () => {
      const body = "### Title\n\n#### Responsibilities\n\n- use ``code`` here";
      const errs = errors(body);
      expect(errs).toContain(
        'bullet contains inline formatting in "Responsibilities"'
      );
    });

    it("rejects double-tilde strikethrough in bullet", () => {
      const body =
        "### Title\n\n#### Responsibilities\n\n- strikethrough ~~text~~";
      const errs = errors(body);
      expect(errs).toContain(
        'bullet contains inline formatting in "Responsibilities"'
      );
    });

    it("allows single tilde in description", () => {
      const body = "### Title\n\n**Description**: approximately ~500k users";
      const result = ok(body);
      expect(result.ok).toBe(true);
    });
  });

  describe("section names and bullet membership", () => {
    it("preserves exact section names", () => {
      const body = [
        "### Title",
        "",
        "#### Backend Work",
        "",
        "- bullet a",
        "",
        "#### Frontend Work",
        "",
        "- bullet b",
      ].join("\n");

      const result = ok(body);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.content.responsibilities[0].heading).toBe("Backend Work");
        expect(result.content.responsibilities[1].heading).toBe(
          "Frontend Work"
        );
      }
    });

    it("preserves bullet membership per section", () => {
      const body = [
        "### Title",
        "",
        "#### Section A",
        "",
        "- a1",
        "- a2",
        "",
        "#### Section B",
        "",
        "- b1",
      ].join("\n");

      const result = ok(body);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.content.responsibilities[0].bullets).toEqual([
          "a1",
          "a2",
        ]);
        expect(result.content.responsibilities[1].bullets).toEqual(["b1"]);
      }
    });
  });

  describe("diagnostics source", () => {
    it("includes source identifier in diagnostics", () => {
      const result = parseProjectBody("", "my-project.md");
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.diagnostics.source).toBe("my-project.md");
      }
    });
  });
});
