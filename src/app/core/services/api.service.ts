import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse, HttpContext } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { skipAuthContext } from '../interceptors/auth.interceptor';
import { ToastService } from './toast.service';

export interface ApiRequestOptions {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  params?: HttpParams | { [param: string]: string | string[] };
  responseType?: 'json' | 'text' | 'blob' | 'arraybuffer';
  withCredentials?: boolean;
  timeout?: number;
  skipAuth?: boolean;
  /**
   * When true, skips the default error handler (no toast, no error rewriting),
   * so the original HttpErrorResponse propagates with its status intact.
   * Used by auth flows that need to distinguish 401/403 from transient errors.
   */
  skipErrorHandler?: boolean;
  /** When true, skips Content-Type: application/json header (use for FormData). */
  isFormData?: boolean;
  /** Request body for methods that don't normally accept one (e.g. DELETE). */
  body?: any;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly toastService = inject(ToastService);
  private readonly baseUrl = environment.apiUrl;
  private readonly defaultTimeout = 30000;

  private buildUrl(endpoint: string): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    return `${this.baseUrl}/${cleanEndpoint}`;
  }

  private buildHeaders(options?: ApiRequestOptions): HttpHeaders {
    let headers = new HttpHeaders({
      'Accept': 'application/json',
      'ngrok-skip-browser-warning': 'true'
    });

    if (!options?.isFormData) {
      headers = headers.set('Content-Type', 'application/json');
    }

    if (options?.headers) {
      const customHeaders = options.headers instanceof HttpHeaders 
        ? options.headers 
        : new HttpHeaders(options.headers);
      
      customHeaders.keys().forEach(key => {
        const value = customHeaders.get(key);
        if (value) headers = headers.set(key, value);
      });
    }

    return headers;
  }

  /**
   * Applies the shared tail operators (timeout + error handling) to a request.
   * When `skipErrorHandler` is set the original HttpErrorResponse is preserved
   * (no toast, no rewrite) so callers can inspect the status.
   */
  private applyTail<T>(obs$: Observable<T>, options?: ApiRequestOptions): Observable<T> {
    const piped$ = obs$.pipe(timeout(options?.timeout || this.defaultTimeout));
    return options?.skipErrorHandler ? piped$ : piped$.pipe(catchError(this.handleError));
  }

  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = 'An unexpected error occurred';

    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      if (error.status === 0) {
        errorMessage = 'Could not connect to the server';
      } else if (error.status === 401) {
        errorMessage = 'Unauthorized. Please log in again';
      } else if (error.status === 403) {
        errorMessage = 'You do not have permission to perform this action';
      } else if (error.status === 404) {
        errorMessage = 'Resource not found';
      } else if (error.status >= 500) {
        errorMessage = 'Server error. Please try again later';
      } else if (error.error?.message) {
        errorMessage = error.error.message;
      }
    }

    console.error('API Error:', {
      status: error.status,
      message: errorMessage,
      error: error.error
    });

    this.toastService.show(errorMessage, 'danger');

    return throwError(() => new Error(errorMessage));
  }

  get<T = any>(endpoint: string, options?: ApiRequestOptions): Observable<T> {
    const url = this.buildUrl(endpoint);
    const headers = this.buildHeaders(options);
    
    return this.applyTail(this.http.get<T>(url, {
      headers,
      params: options?.params,
      withCredentials: options?.withCredentials,
      context: options?.skipAuth ? skipAuthContext() : undefined
    }), options);
  }

  post<T = any>(endpoint: string, body: any, options?: ApiRequestOptions): Observable<T> {
    const url = this.buildUrl(endpoint);
    const headers = this.buildHeaders(options);

    return this.applyTail(this.http.post<T>(url, body, {
      headers,
      params: options?.params,
      withCredentials: options?.withCredentials,
      context: options?.skipAuth ? skipAuthContext() : undefined
    }), options);
  }

  put<T = any>(endpoint: string, body: any, options?: ApiRequestOptions): Observable<T> {
    const url = this.buildUrl(endpoint);
    const headers = this.buildHeaders(options);

    return this.applyTail(this.http.put<T>(url, body, {
      headers,
      params: options?.params,
      withCredentials: options?.withCredentials,
      context: options?.skipAuth ? skipAuthContext() : undefined
    }), options);
  }

  patch<T = any>(endpoint: string, body: any, options?: ApiRequestOptions): Observable<T> {
    const url = this.buildUrl(endpoint);
    const headers = this.buildHeaders(options);

    return this.applyTail(this.http.patch<T>(url, body, {
      headers,
      params: options?.params,
      withCredentials: options?.withCredentials,
      context: options?.skipAuth ? skipAuthContext() : undefined
    }), options);
  }

  delete<T = any>(endpoint: string, options?: ApiRequestOptions): Observable<T> {
    const url = this.buildUrl(endpoint);
    const headers = this.buildHeaders(options);

    return this.applyTail(this.http.delete<T>(url, {
      headers,
      params: options?.params,
      body: options?.body,
      withCredentials: options?.withCredentials,
      context: options?.skipAuth ? skipAuthContext() : undefined
    }), options);
  }

  getBlob(endpoint: string, options?: ApiRequestOptions): Observable<Blob> {
    const url = this.buildUrl(endpoint);
    const headers = this.buildHeaders(options);

    return this.applyTail(this.http.get(url, {
      headers,
      params: options?.params,
      responseType: 'blob',
      withCredentials: options?.withCredentials,
      context: options?.skipAuth ? skipAuthContext() : undefined
    }), options);
  }
}
