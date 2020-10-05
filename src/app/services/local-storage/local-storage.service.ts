import { Injectable } from '@angular/core';
import { LocalStorageResult } from './local-storage-result';

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {

    public write(key: string, data: object): void {
        localStorage.setItem(key, JSON.stringify(data));
    }

    public read<T>(key: string): LocalStorageResult<T> {
        const data = JSON.parse(localStorage.getItem(key));
        return {
            valid: !!data,
            data: data || null
        };
    }

    public delete(key: string): void {
        localStorage.removeItem(key);
    }
}
