import DOMPurify from 'isomorphic-dompurify';

const ALLOWED_TAGS = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'br', 'hr',
  'ul', 'ol', 'li',
  'strong', 'em', 'b', 'i',
  'a', 'code', 'pre',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'blockquote', 'div', 'span'
];

// DOMPurify expects ALLOWED_ATTR as a FLAT string array (a per-tag Record is
// silently ignored and strips every attribute — href, scope, colspan, ...).
// Event handlers (onclick etc.) and javascript: URLs are always removed by
// DOMPurify regardless of this list.
const ALLOWED_ATTR = [
  'href', 'title', 'scope', 'colspan', 'rowspan',
  'alt', 'src', 'class', 'id', 'target', 'rel',
];

// External links must carry rel="noopener" so lesson content can't tab-nab.
// Hook registered once at module load; applies to every sanitize call.
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A') {
    const href = node.getAttribute('href') || '';
    if (/^(https?:)?\/\//i.test(href)) {
      const rel = (node.getAttribute('rel') || '').split(/\s+/).filter(Boolean);
      if (!rel.includes('noopener')) rel.push('noopener');
      node.setAttribute('rel', rel.join(' '));
    }
  }
});

export function sanitizeHTML(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false, // strict allowlist: no data-* passthrough
    KEEP_CONTENT: true,
  });
}

export function stripHTML(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

export function extractTextContent(html: string): string {
  const sanitized = sanitizeHTML(html);
  return stripHTML(sanitized);
}
