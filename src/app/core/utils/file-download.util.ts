import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

/**
 * Saves a downloaded blob.
 *
 * On the web this is the usual object-URL + anchor click. Inside the native WebView that trick does
 * not reliably save anything, so the file is written to the cache directory and handed to the OS
 * share sheet, which is what lets the user store it in Files, mail it or send it on.
 */
/**
 * Whether a PDF can be shown inside the app.
 *
 * Only on the web, where the browser has a built-in viewer. The Android WebView cannot render a
 * PDF at all and iOS is unreliable with blob URLs, so on native the file goes to the OS viewer
 * instead — which previews it just as well, only outside the app.
 */
export function canPreviewPdfInline(): boolean {
  return !Capacitor.isNativePlatform();
}

export async function saveBlob(blob: Blob, fileName: string): Promise<void> {
  if (Capacitor.isNativePlatform()) {
    await saveNative(blob, fileName);
    return;
  }

  saveWeb(blob, fileName);
}

function saveWeb(blob: Blob, fileName: string): void {
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  window.URL.revokeObjectURL(url);
}

async function saveNative(blob: Blob, fileName: string): Promise<void> {
  const base64 = await blobToBase64(blob);

  const { uri } = await Filesystem.writeFile({
    path: fileName,
    data: base64,
    directory: Directory.Cache,
  });

  await Share.share({ title: fileName, url: uri });
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
