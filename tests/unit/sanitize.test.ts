import { describe, it, expect } from "vitest";
import { sanitizeHTML, stripHTML } from "@/lib/sanitize";

describe("sanitizeHTML attribute allowlist (flat ALLOWED_ATTR)", () => {
  it("keeps href and title on links", () => {
    const out = sanitizeHTML('<a href="https://x" title="t">link</a>');
    expect(out).toContain('href="https://x"');
    expect(out).toContain('title="t"');
    expect(out).toContain(">link</a>");
  });

  it("keeps th scope and td colspan/rowspan in tables", () => {
    const out = sanitizeHTML(
      '<table><thead><tr><th scope="col">H</th></tr></thead>' +
        '<tbody><tr><td colspan="2" rowspan="3">c</td></tr></tbody></table>'
    );
    expect(out).toContain('scope="col"');
    expect(out).toContain('colspan="2"');
    expect(out).toContain('rowspan="3"');
  });

  it("keeps class on code/pre blocks", () => {
    const out = sanitizeHTML('<pre class="lang-js"><code class="lang-js">x</code></pre>');
    expect(out).toContain('class="lang-js"');
  });

  it("still strips onclick and other event handlers", () => {
    const out = sanitizeHTML('<a href="https://x" onclick="alert(1)">link</a>');
    expect(out).not.toContain("onclick");
    expect(out).toContain('href="https://x"');
  });

  it("still strips <script> entirely", () => {
    const out = sanitizeHTML('<p>ok</p><script>alert(1)</script>');
    expect(out).not.toContain("<script");
    expect(out).not.toContain("alert(1)");
    expect(out).toContain("<p>ok</p>");
  });

  it("still strips javascript: URLs", () => {
    const out = sanitizeHTML('<a href="javascript:alert(1)">bad</a>');
    expect(out).not.toContain("javascript:");
  });

  it("strips attributes not in the allowlist (e.g. style)", () => {
    const out = sanitizeHTML('<p style="color:red" data-x="1">t</p>');
    expect(out).not.toContain("style=");
    expect(out).not.toContain("data-x");
  });
});

describe("sanitizeHTML external-link rel=noopener hook", () => {
  it("adds rel=noopener to absolute http(s) links", () => {
    const out = sanitizeHTML('<a href="https://example.com">x</a>');
    expect(out).toMatch(/rel="[^"]*noopener[^"]*"/);
  });

  it("preserves an existing rel value while adding noopener", () => {
    const out = sanitizeHTML('<a href="https://example.com" rel="nofollow">x</a>');
    expect(out).toMatch(/rel="[^"]*nofollow[^"]*"/);
    expect(out).toMatch(/rel="[^"]*noopener[^"]*"/);
  });

  it("does not add noopener to relative/internal links", () => {
    const out = sanitizeHTML('<a href="/learn/m1/w1">x</a>');
    expect(out).not.toContain("noopener");
    expect(out).toContain('href="/learn/m1/w1"');
  });
});

describe("stripHTML", () => {
  it("removes tags and trims", () => {
    expect(stripHTML("  <p>hello <strong>world</strong></p> ")).toBe("hello world");
  });
});
