import { Injectable } from '@angular/core';

export interface FileValidationResult {
    valid: boolean;
    errorKey?: string;
}

@Injectable({
    providedIn: 'root'
})
export class FileValidationService {
    // Allowed file types (safe document and image formats)
    private readonly ALLOWED_FILE_TYPES = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
        'text/plain'
    ];

    // Blocked file extensions (security-vulnerable files)
    private readonly BLOCKED_EXTENSIONS = [
        '.exe', '.bat', '.cmd', '.com', '.pif', '.scr', '.vbs', '.js', '.jar',
        '.msi', '.app', '.deb', '.rpm', '.dmg', '.pkg', '.sh', '.ps1', '.psm1',
        '.dll', '.sys', '.drv', '.bin', '.iso', '.apk', '.ipa'
    ];

    private readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

    /**
     * Validates a file based on extension, MIME type, and size
     * @param file The file to validate
     * @returns FileValidationResult with validation status and error key if invalid
     */
    validateFile(file: File): FileValidationResult {
        // Check file extension
        const fileName = file.name.toLowerCase();
        const hasBlockedExtension = this.BLOCKED_EXTENSIONS.some(ext => fileName.endsWith(ext));

        if (hasBlockedExtension) {
            return {
                valid: false,
                errorKey: 'member.proposals.form.fileTypeError'
            };
        }

        // Check MIME type
        if (!this.ALLOWED_FILE_TYPES.includes(file.type)) {
            return {
                valid: false,
                errorKey: 'member.proposals.form.fileTypeError'
            };
        }

        // Check file size
        if (file.size > this.MAX_FILE_SIZE) {
            return {
                valid: false,
                errorKey: 'member.proposals.form.fileSizeError'
            };
        }

        return { valid: true };
    }

    /**
     * Gets the maximum allowed file size in bytes
     */
    getMaxFileSize(): number {
        return this.MAX_FILE_SIZE;
    }

    /**
     * Gets the list of allowed file types
     */
    getAllowedFileTypes(): string[] {
        return [...this.ALLOWED_FILE_TYPES];
    }
}
