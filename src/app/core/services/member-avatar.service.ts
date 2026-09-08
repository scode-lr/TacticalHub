import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of, shareReplay } from 'rxjs';
import { ApiService } from './api.service';

/**
 * Resolves and caches *other* users' profile photos.
 *
 * Member photos are private and club-scoped: they can only be read as an
 * authenticated blob from `GET /clubs/{clubId}/users/{userId}/avatar`, so they
 * cannot be bound directly to `<img src>`. Each photo is downloaded once,
 * turned into an object URL and kept for the rest of the session, which is what
 * lets a members list re-render (or paginate back and forth) without refetching.
 *
 * The current user's own photo is not handled here — see `UserService.avatarUrl`.
 */
@Injectable({ providedIn: 'root' })
export class MemberAvatarService {
  private readonly apiService = inject(ApiService);

  /** Keyed by `${clubId}:${userId}` so a photo is never reused across clubs. */
  private readonly cache = new Map<string, Observable<string | null>>();
  private readonly objectUrls = new Set<string>();

  /**
   * Emits the member's photo as an object URL, or `null` when the member has no
   * photo or it cannot be read (404 / not authorized) — callers decide their own
   * placeholder. Concurrent and repeated calls for the same member share a
   * single request and a single object URL.
   */
  getMemberAvatarUrl(clubId: number, userId: number): Observable<string | null> {
    const key = `${clubId}:${userId}`;
    const cached = this.cache.get(key);
    if (cached) return cached;

    const avatar$ = this.apiService
      .getBlob(`clubs/${clubId}/users/${userId}/avatar`, { skipErrorHandler: true })
      .pipe(
        map(blob => {
          const objectUrl = URL.createObjectURL(blob);
          this.objectUrls.add(objectUrl);
          return objectUrl;
        }),
        // The photo is optional: fail silently so the list keeps its placeholder.
        // The failure is cached too, otherwise every re-render would retry it.
        catchError(() => of(null)),
        shareReplay({ bufferSize: 1, refCount: false })
      );

    this.cache.set(key, avatar$);
    return avatar$;
  }

  /**
   * Revokes every cached object URL and empties the cache.
   * Called on logout so blobs never outlive the session they belong to.
   */
  clear(): void {
    for (const objectUrl of this.objectUrls) {
      URL.revokeObjectURL(objectUrl);
    }
    this.objectUrls.clear();
    this.cache.clear();
  }
}
