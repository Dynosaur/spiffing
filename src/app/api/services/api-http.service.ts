import { Injectable } from '@angular/core';
import { environment as env } from 'spiff/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

interface Headers {
    [header: string]: string;
}

@Injectable({ providedIn: 'root' })
export class ApiHttpService {

    private apiUrl = env.apiHost;
    private doFakeDelay = true;

    constructor(private http: HttpClient) { }

    private createUrl(path: string[], query: object): string {
        Object.keys(query).forEach(key => { if (!query[key]) delete query[key]; });
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

    private async request<T>(
        method: string,
        path: string[],
        query: object,
        body: object,
        headers: Headers
    ): Promise<T> {
        const url = this.createUrl(path, query);
        console.log(`[NET] ${method} ${url}`);

        try {
            return await this.http.request<T>(method, url, { body, headers }).toPromise();
        } catch (error) {
            if (error instanceof HttpErrorResponse) {
                if (error.error instanceof ProgressEvent) {
                    throw new Error('NoConnection');
                }
                if (error.error.hasOwnProperty('error') && error.error.hasOwnProperty('ok')) {
                    return error.error;
                }
            }
            console.error('[NET] Request Error!');
            console.log(error);
            throw error;
        }
    }

    async get<T>(path: string[], query: object, headers: Headers): Promise<T> {
        return await this.request<T>('GET', path, query, {}, headers);
    }

    async post<T>(path: string[], body: object, headers: Headers): Promise<T> {
        return await this.request<T>('POST', path, {}, body, headers);
    }

    async delete<T>(path: string[], headers: Headers): Promise<T> {
        return await this.request<T>('DELETE', path, {}, {}, headers);
    }

    async patch<T>(path: string[], body: object, headers: Headers): Promise<T> {
        return await this.request<T>('PATCH', path, {}, body, headers);
    }

}
