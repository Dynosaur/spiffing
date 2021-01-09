import { ApiEndpointService } from 'spiff/app/api/services/api-endpoint.service';
import { Injectable, EventEmitter } from '@angular/core';
import { LOCAL_STORAGE_ACCOUNT_KEY, LocalStorageService } from './local-storage.service';

@Injectable({
    providedIn: 'root'
})
export class UserAccountService {
    id: string;
    username: string;
    password: string;
    screenName: string;
    isSignedIn = false;
    loginInProgress = false;
    createdTimestamp: number;

    public signInEventStream = new EventEmitter<boolean>();

    constructor(private ls: LocalStorageService, private api: ApiEndpointService) { }

    public async login(username: string, password: string): Promise<boolean> {
        this.loginInProgress = true;
        const authenticateRequest = await this.api.authorize(username, password);
        if (authenticateRequest.ok) {
            this.username = username;
            this.password = password;
            const getUserRequest = await this.api.getUser(this.username);
            if (getUserRequest.ok) {
                this.id = getUserRequest.user._id;
                this.screenName = getUserRequest.user.screenname;
                this.createdTimestamp = getUserRequest.user.created;
            } else {
                throw new Error('Could not find user after authenticating.');
            }
            this.ls.write(LOCAL_STORAGE_ACCOUNT_KEY, { username, password });
            this.loginInProgress = false;
            this.setSignInStatus(true);
            return true;
        }
        return false;
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
        this.signInEventStream.emit(status);
    }

    changeUsername(newUsername: string): void {
        this.username = newUsername;
        this.ls.write(LOCAL_STORAGE_ACCOUNT_KEY, { username: newUsername, password: this.password });
        this.signInEventStream.emit(true);
    }
}
