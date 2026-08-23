import { ensureRichTextHtml } from './rich-text.util';

describe('ensureRichTextHtml', () => {
  it('converts non-breaking spaces in rich-text content to wrapping spaces', () => {
    const html = ensureRichTextHtml('<p>Tota&nbsp;la&nbsp;plantilla</p>');

    expect(html).toBe('<p>Tota la plantilla</p>');
  });

  it('does not alter non-breaking-space entities inside attributes', () => {
    const html = ensureRichTextHtml('<a href="https://example.com/a&nbsp;b">Link&nbsp;text</a>');

    expect(html).toContain('href="https://example.com/a&nbsp;b"');
    expect(html).toContain('>Link text</a>');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
  });
});
