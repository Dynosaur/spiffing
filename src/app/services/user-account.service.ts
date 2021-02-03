import { User } from 'spiff/app/api/interface/data-types.ts';
import { ApiService } from 'spiff/app/api/services/api.service';
import { Injectable, EventEmitter } from '@angular/core';
import { LOCAL_STORAGE_ACCOUNT_KEY, LocalStorageService } from 'spiff/app/services/local-storage.service';
import { ICreatePost, IDeregister, IGetRatedPosts, IPatch, IRatePost } from 'spiff/app/api/interface';

export type UserAccountEvent = 'LOG_IN' | 'LOG_OUT' | 'PASSWORD_CHANGE';

@Injectable({
    providedIn: 'root'
})
export class UserAccountService {
    state = false;
    password: string;
    user: User = null;
    events = new EventEmitter<UserAccountEvent>();
    ratedPosts = new Map<string, boolean>();

    constructor(private ls: LocalStorageService, private api: ApiService) { }

    async login(username: string, password: string): Promise<boolean> {
        const authenticateRequest = await this.api.authorize(username, password);
        if (authenticateRequest.ok) {
            this.password = password;
            const getUserRequest = await this.api.getUsers({ username });
            if (getUserRequest.ok) {
                this.user = getUserRequest.users[0];
                const getRatedPostsRequest = await this.getRatedPosts();
                if (getRatedPostsRequest.ok) {
                    for (const rated of getRatedPostsRequest.ratedPosts.posts)
                        if (rated.rating === 1) this.ratedPosts.set(rated._id, true);
                        else this.ratedPosts.set(rated._id, false);
                } else throw new Error('Could not get rated posts.');
                this.events.emit('LOG_IN');
            } else throw new Error('Could not find user after authenticating.');
            this.ls.write(LOCAL_STORAGE_ACCOUNT_KEY, { username, password });
            return true;
        }
        return false;
    }

    logOut(): void {
        this.user = null;
        this.ls.delete(LOCAL_STORAGE_ACCOUNT_KEY);
        this.events.emit('LOG_OUT');
    }

    async deregister(): Promise<IDeregister.Tx> {
        const deregisterResponse = await this.api.deregister(this.user.username, this.password);
        if (deregisterResponse.ok === true) this.logOut();
        return deregisterResponse;
    }

    async patch(changes: {
        username?: string;
        password?: string;
        screenname?: string;
    }): Promise<IPatch.Tx> {
        return await this.api.patch(this.user.username, this.password, changes);
    }

    async createPost(title: string, content: string): Promise<ICreatePost.Tx> {
        return await this.api.createPost(this.user.username, this.password, title, content);
    }

    async ratePost(postId: string, rating: -1 | 0 | 1): Promise<IRatePost.Tx> {
        return await this.api.ratePost(this.user.username, this.password, postId, rating);
    }

    async getRatedPosts(): Promise<IGetRatedPosts.Tx> {
        return await this.api.getRatedPosts(this.user.username, this.password, this.user._id);
    }

    usernameChanged(newUsername: string): void {
        this.user.username = newUsername;
        this.ls.write(LOCAL_STORAGE_ACCOUNT_KEY, { username: newUsername, password: this.password });
    }

    passwordChanged(password: string): void {
        this.password = password;
        this.ls.write(LOCAL_STORAGE_ACCOUNT_KEY, { username: this.user.username, password: this.password });
        this.events.emit('PASSWORD_CHANGE');
    }
}
