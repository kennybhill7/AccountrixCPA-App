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

const ALLOWED_ATTRIBUTES: Record<string, string[]> = {
  'a': ['href', 'title'],
  'code': ['class'],
  'pre': ['class'],
  'table': ['class'],
  'th': ['scope'],
  'td': ['colspan', 'rowspan']
};

export function sanitizeHTML(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR: ALLOWED_ATTRIBUTES as any,
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