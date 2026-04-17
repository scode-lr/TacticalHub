export interface SubmissionCommentEntry {
  text: string;
  date: string;
  adminId: number;
}

export function parseSubmissionComment(raw: string | null | undefined): SubmissionCommentEntry[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map(e => ({
        text: e.text ?? e.Text ?? '',
        date: e.date ?? e.Date ?? new Date().toISOString(),
        adminId: e.adminId ?? e.AdminId ?? 0,
      }));
    }
  } catch { /* plain string fallback */ }
  return [{ text: raw, date: new Date().toISOString(), adminId: 0 }];
}

export function latestComment(raw: string | null | undefined): string | null {
  const entries = parseSubmissionComment(raw);
  return entries.length > 0 ? entries[entries.length - 1].text : null;
}
