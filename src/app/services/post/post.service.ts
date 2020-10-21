import { Injectable, EventEmitter } from '@angular/core';
import { PostStatus, GetPostsResult } from './post-status';
import { UserAccountService } from '../user-account/user-account.service';
import { ApiEndpointService } from '../../api/services/endpoint/api-endpoint.service';

@Injectable({
    providedIn: 'root'
})
export class PostService {

    public postEventStream = new EventEmitter<string>();

    constructor(private user: UserAccountService, private api: ApiEndpointService) { }

    public async createPost(title: string, content: string): Promise<PostStatus> {
        if (this.user.isSignedIn) {
            const res = await this.api.createPost(this.user.username, this.user.password, title, content);
            if (res.status === 'CREATED') {
                this.postEventStream.emit('New post');
                return {
                    success: true,
                    message: null
                };
            } else {
                return {
                    success: false,
                    message: res.message
                };
            }
        } else {
            return {
                success: false,
                message: 'You must be signed in to create a post'
            };
        }
    }

    public async getPosts(): Promise<GetPostsResult> {
        return this.getPostsByUser(this.user.username);
    }

    public async getPostsByUser(username: string): Promise<GetPostsResult> {
        const res = await this.api.getPosts(username);
        if (res.ok) {
            switch (res.payload.status) {
                case 'OK':
                    return {
                        count: res.payload.data.length,
                        posts: res.payload.data
                    };
                case 'NO_RESULTS':
                    return {
                        count: 0,
                        posts: null
                    };
            }
        } else {
            throw new Error(res.error);
        }
    }
}
