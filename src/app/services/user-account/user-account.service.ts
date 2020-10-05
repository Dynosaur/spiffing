import { Injectable, EventEmitter } from '@angular/core';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { ApiEndpointService } from '@spiffing/api/services/endpoint/api-endpoint.service';

export const LOCAL_STORAGE_ACCOUNT_KEY = 'spf-account';

@Injectable({
    providedIn: 'root'
})
export class UserAccountService {

    public isSignedIn = false;
    public username: string;

    public signInEventStream = new EventEmitter<boolean>();

    constructor(private ls: LocalStorageService, private api: ApiEndpointService) { }

    public async login(username: string, password: string): Promise<LoginResult> {
        const request = await this.api.authenticate(username, password);

        if (request.ok) {
            switch (request.payload.status) {
                case 'OK':
                    this.username = username;
                    this.ls.write(LOCAL_STORAGE_ACCOUNT_KEY, { username, password });
                    this.setSignInStatus(true);
                    return { success: true };
                case 'REJECTED':
                    return { success: false, message: request.payload.message };
            }
        }
        return { success: false, message: request.errorMessage };

    }

    public logOut(): void {
        this.username = null;
        this.ls.delete(LOCAL_STORAGE_ACCOUNT_KEY);
        this.setSignInStatus(false);
    }

    public setSignInStatus(status: boolean): void {
        this.isSignedIn = status;
        // this.api.getUser();
        this.signInEventStream.emit(status);
    }
}

interface LoginResult {
    success: boolean;
    message?: string;
}
