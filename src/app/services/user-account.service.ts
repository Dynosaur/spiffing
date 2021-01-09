import { ApiEndpointService } from 'spiff/app/api/services/api-endpoint.service';
import { Injectable, EventEmitter } from '@angular/core';
import { LOCAL_STORAGE_ACCOUNT_KEY, LocalStorageService } from './local-storage.service';

export type UserAccountEvent = 'ratedMapReady';

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
    ratedMap: { status: 'Loading' | 'Ready'; map: Map<string, boolean>; } = {
        status: 'Loading',
        map: new Map()
    };

    public signInEventStream = new EventEmitter<boolean>();
    accountEventStream = new EventEmitter<UserAccountEvent>();

    constructor(private ls: LocalStorageService, private api: ApiEndpointService) { }

    public async login(username: string, password: string): Promise<boolean> {
        this.loginInProgress = true;
        const authenticateRequest = await this.api.authorize(username, password);
        if (authenticateRequest.ok) {
            this.username = username;
            this.password = password;
            await this.onSuccessfulLogin();
            return true;
        }
        return false;
    }

    private async onSuccessfulLogin(): Promise<void> {
        const getUserRequest = await this.api.getUser(this.username);
        if (getUserRequest.ok) {
            this.id = getUserRequest.user._id;
            this.screenName = getUserRequest.user.screenname;
            this.createdTimestamp = getUserRequest.user.created;
        } else throw new Error('Could not find user after authenticating.');
        const getRatedPostsRequest = await this.api.getRatedPosts(this.username, this.password, this.id);
        if (getRatedPostsRequest.ok) {
            for (const rated of getRatedPostsRequest.ratedPosts.posts)
                if (rated.rating === 1) this.ratedMap.map.set(rated._id, true);
                else this.ratedMap.map.set(rated._id, false);
            this.ratedMap.status = 'Ready';
            this.accountEventStream.emit('ratedMapReady');
        } else {
            this.ratedMap.status = 'Ready';
            this.accountEventStream.emit('ratedMapReady');
            throw new Error('Could not get rated posts.');
        }
        this.ls.write(LOCAL_STORAGE_ACCOUNT_KEY, { username: this.username, password: this.password });
        this.loginInProgress = false;
        this.setSignInStatus(true);
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
