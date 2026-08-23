import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { FileViewer } from '@capacitor/file-viewer';

/**
 * Whether a PDF can be shown inline, inside our own UI (an iframe in a modal).
 *
 * Only on the web, where the browser has a built-in viewer and blob: URLs work. On native,
 * `previewBlob` below opens the OS-level viewer instead via @capacitor/file-viewer.
 */
export function canPreviewPdfInline(): boolean {
  return !Capacitor.isNativePlatform();
}

/**
 * Saves a downloaded blob.
 *
 * On the web this is the usual object-URL + anchor click. Inside the native WebView that trick does
 * not reliably save anything, so the file is written to the cache directory and handed to the OS
 * share sheet, which is what lets the user store it in Files, mail it or send it on.
 */
export async function saveBlob(blob: Blob, fileName: string): Promise<void> {
  if (Capacitor.isNativePlatform()) {
    await Share.share({ title: fileName, url: await writeToCache(blob, fileName) });
    return;
  }

  saveWeb(blob, fileName);
}

/**
 * Opens a blob in the OS's own document viewer. Native-only: on the web, callers render the blob
 * inline via `canPreviewPdfInline()` instead, since there is no in-app viewer to hand a file to here.
 */
export async function previewBlob(blob: Blob, fileName: string): Promise<void> {
  await FileViewer.openDocumentFromLocalPath({ path: await writeToCache(blob, fileName) });
}

/** Strips characters that are illegal (or awkward) in a downloaded file name. */
export function sanitizeFileName(value: string): string {
  return value.trim().replace(/[\\/:*?"<>|]/g, '-').replace(/\s+/g, ' ');
}

function saveWeb(blob: Blob, fileName: string): void {
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  window.URL.revokeObjectURL(url);
}

async function writeToCache(blob: Blob, fileName: string): Promise<string> {
  const base64 = await blobToBase64(blob);

  const { uri } = await Filesystem.writeFile({
    path: fileName,
    data: base64,
    directory: Directory.Cache,
  });

  return uri;
}

/** Filesystem.writeFile expects raw base64, without the `data:...;base64,` prefix. */
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const result = reader.result as string;
      const separator = result.indexOf(',');
      resolve(separator >= 0 ? result.slice(separator + 1) : result);
    };
    reader.readAsDataURL(blob);
  });
}
