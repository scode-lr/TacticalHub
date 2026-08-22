const HTML_START_PATTERN = /^\s*</;

function escapePlainText(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function hardenLinks(html: string): string {
  if (!html.includes('<a')) return html;
  const doc = new DOMParser().parseFromString(html, 'text/html');
  doc.querySelectorAll('a').forEach(anchor => {
    anchor.setAttribute('target', '_blank');
    anchor.setAttribute('rel', 'noopener noreferrer');
  });
  return doc.body.innerHTML;
}

/**
 * Normalizes club-information content into safe, renderable HTML.
 *
 * Content authored with the rich-text editor already arrives as HTML
 * (e.g. `<p>...</p>`). Content created before the editor existed is plain
 * text and must be escaped rather than interpreted as markup, otherwise
 * stray `<`/`&` characters already present in old records would be
 * mis-rendered. Angular's `[innerHTML]` binding still sanitizes the
 * result afterwards; this only decides how to treat legacy plain text
 * and enforces safe `target`/`rel` on links.
 */
export function ensureRichTextHtml(content: string | null | undefined): string {
  if (!content) return '';

  const html = HTML_START_PATTERN.test(content)
    ? content
    : `<p>${escapePlainText(content).split(/\r?\n/).join('<br>')}</p>`;

  return hardenLinks(html);
}

/**
 * Plain-text excerpt of rich-text content, for previews (card lists, notifications) that must not
 * render markup. Legacy plain-text content passes through unchanged, tags included, and it is
 * whitespace-collapsed since block tags otherwise butt words together (`</p><p>` -> no space).
 */
export function richTextToPlainText(content: string | null | undefined): string {
  if (!content) return '';
  if (!HTML_START_PATTERN.test(content)) return content;

  const doc = new DOMParser().parseFromString(content, 'text/html');
  return (doc.body.textContent ?? '').replace(/\s+/g, ' ').trim();
}
