import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { environment as env } from '@spiffing/env/environment';
import { Response } from 'interface';

export type HttpError = 'NoResponse';

export interface HttpResponse<T> {
    ok: boolean;
    error?: HttpError;
    errorMessage?: string;
    payload?: T;
}

interface Headers {
    [header: string]: string;
}

@Injectable({ providedIn: 'root' })
export class ApiHttpService {

    private apiUrl = env.apiHost;
    private doFakeDelay = true;

    constructor(private http: HttpClient) { }

    private createUrl(path: string[], query: unknown): string {
        let fullPath = this.apiUrl + '/';
        fullPath += path.join('/');
        if (query) {
            const queryKeys = Object.keys(query);
            if (queryKeys.length) {
                const firstKey = queryKeys.shift();
                fullPath += `?${firstKey}=${query[firstKey]}`;
                queryKeys.forEach(key => fullPath += `&${key}=${query[key]}`);
            }
        }
        return fullPath;
    }

    private fakeWait(): Promise<void> {
        if (this.doFakeDelay) {
            const delay = Math.random() * 2000 + 100;
            return new Promise(resolve => setTimeout(() => resolve(), delay));
        }
    }

    private async request<T extends Response>(method: string, path: string[], query: object, body: object, headers: Headers): Promise<HttpResponse<T>> {
        const url = this.createUrl(path, query);
        console.log(`[NET] ${method} ${url}`);
        await this.fakeWait();

        try {
            const payload = await this.http.request<T>(method, url, { body, headers }).toPromise();
            console.log(payload);
            switch (payload.status) {
                case 'INCOMPLETE':
                case 'MALFORMED':
                    throw new Error(payload.message);
            }
            return { ok: true, payload };
        } catch (error) {
            console.error('[NET] Request Error!');
            if (error instanceof HttpErrorResponse) {
                if (error.error instanceof ProgressEvent) {
                    return { ok: false, error: 'NoResponse', errorMessage: 'Could not connect to our services.', payload: null };
                }
            }
            console.log(error);
            throw error;
        }
    }

    public async get<T extends Response>(path: string[], query: object, headers: { [header: string]: string }): Promise<HttpResponse<T>> {
        return await this.request<T>('GET', path, query, {}, headers);
    }

    public async post<T extends Response>(path: string[], query: object, body: object, headers: { [header: string]: string }): Promise<HttpResponse<T>> {
        return await this.request<T>('POST', path, query, body, headers);
    }

}
