import { Injectable, EventEmitter } from '@angular/core';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { ApiEndpointService } from '@spiffing/api/services/endpoint/api-endpoint.service';

export const LOCAL_STORAGE_ACCOUNT_KEY = 'spf-account';

@Injectable({
    providedIn: 'root'
})
export class UserAccountService {

    isSignedIn = false;
    loginInProgress = false;

    username: string;
    password: string;
    screenName: string;
    createdTimestamp: number;

    public signInEventStream = new EventEmitter<boolean>();

    constructor(private ls: LocalStorageService, private api: ApiEndpointService) { }

    public async login(username: string, password: string): Promise<
    { status: 'OK' | 'FAILED' | 'ABSENT' } |
    { status: 'OTHER'; message: string; }
    > {
        this.loginInProgress = true;
        const request = await this.api.authenticate(username, password);

        if (request.ok) {
            switch (request.payload.status) {
                case 'OK':
                    this.username = username;
                    this.password = password;
                    const userDataReq = await this.api.getUser(this.username);
                    switch (userDataReq.status) {
                        case 'OK':
                            this.screenName = userDataReq.data.screenName;
                            this.createdTimestamp = userDataReq.data.created;
                            break;
                        case 'NO_RESULTS':
                            throw new Error('Unexpected NO_RESULTS status from API.');
                    }
                    this.ls.write(LOCAL_STORAGE_ACCOUNT_KEY, { username, password });
                    this.loginInProgress = false;
                    this.setSignInStatus(true);
                    return { status: 'OK' };
                case 'REJECTED':
                    this.loginInProgress = false;
                    return { status: 'FAILED' };
                case 'MISSING_RECORD':
                    this.loginInProgress = false;
                    return { status: 'ABSENT' };
            }
        }
        return { status: 'OTHER', message: request.errorMessage };

    }

    public logOut(): void {
        this.username = null;
        this.password = null;
        this.screenName = null;
        this.createdTimestamp = 0;
        this.ls.delete(LOCAL_STORAGE_ACCOUNT_KEY);
        this.setSignInStatus(false);
    }

    public setSignInStatus(status: boolean): void {
        this.isSignedIn = status;
        // this.api.getUser();
        this.signInEventStream.emit(status);
    }

    changeUsername(newUsername: string): void {
        this.username = newUsername;
        this.ls.write(LOCAL_STORAGE_ACCOUNT_KEY, { username: newUsername, password: this.password });
        this.signInEventStream.emit(true);
    }
}

interface LoginResult {
    success: boolean;
    message?: string;
}
