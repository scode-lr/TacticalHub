import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface ApiRequestOptions {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  params?: HttpParams | { [param: string]: string | string[] };
  responseType?: 'json' | 'text' | 'blob' | 'arraybuffer';
  withCredentials?: boolean;
  timeout?: number;
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
  private readonly baseUrl = environment.apiUrl;
  private readonly defaultTimeout = 30000;

  private buildUrl(endpoint: string): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    return `${this.baseUrl}/${cleanEndpoint}`;
  }

  private buildHeaders(options?: ApiRequestOptions): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    const token = localStorage.getItem('token');
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
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

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unexpected error occurred';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
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

    return throwError(() => new Error(errorMessage));
  }

  get<T = any>(endpoint: string, options?: ApiRequestOptions): Observable<T> {
    const url = this.buildUrl(endpoint);
    const headers = this.buildHeaders(options);
    
    console.log('[GET]', url, { params: options?.params });
    
    return this.http.get<T>(url, {
      headers,
      params: options?.params,
      withCredentials: options?.withCredentials
    }).pipe(
      timeout(options?.timeout || this.defaultTimeout),
      catchError(this.handleError)
    );
  }

  post<T = any>(endpoint: string, body: any, options?: ApiRequestOptions): Observable<T> {
    const url = this.buildUrl(endpoint);
    const headers = this.buildHeaders(options);
    
    console.log('[POST]', url, { body, params: options?.params });
    
    return this.http.post<T>(url, body, {
      headers,
      params: options?.params,
      withCredentials: options?.withCredentials
    }).pipe(
      timeout(options?.timeout || this.defaultTimeout),
      catchError(this.handleError)
    );
  }

  put<T = any>(endpoint: string, body: any, options?: ApiRequestOptions): Observable<T> {
    const url = this.buildUrl(endpoint);
    const headers = this.buildHeaders(options);
    
    console.log('[PUT]', url, { body, params: options?.params });
    
    return this.http.put<T>(url, body, {
      headers,
      params: options?.params,
      withCredentials: options?.withCredentials
    }).pipe(
      timeout(options?.timeout || this.defaultTimeout),
      catchError(this.handleError)
    );
  }

  patch<T = any>(endpoint: string, body: any, options?: ApiRequestOptions): Observable<T> {
    const url = this.buildUrl(endpoint);
    const headers = this.buildHeaders(options);
    
    console.log('[PATCH]', url, { body, params: options?.params });
    
    return this.http.patch<T>(url, body, {
      headers,
      params: options?.params,
      withCredentials: options?.withCredentials
    }).pipe(
      timeout(options?.timeout || this.defaultTimeout),
      catchError(this.handleError)
    );
  }

  delete<T = any>(endpoint: string, options?: ApiRequestOptions): Observable<T> {
    const url = this.buildUrl(endpoint);
    const headers = this.buildHeaders(options);
    
    console.log('[DELETE]', url, { params: options?.params });
    
    return this.http.delete<T>(url, {
      headers,
      params: options?.params,
      withCredentials: options?.withCredentials
    }).pipe(
      timeout(options?.timeout || this.defaultTimeout),
      catchError(this.handleError)
    );
  }
}
