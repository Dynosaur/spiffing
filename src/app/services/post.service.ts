import { Post } from 'spiff/app/api/interface';
import { ApiEndpointService } from 'spiff/app/api/services/api-endpoint.service';
import { UserAccountService } from 'spiff/app/services/user-account.service';
import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class PostService {

    public postEventStream = new EventEmitter<string>();

    constructor(private user: UserAccountService, private api: ApiEndpointService) { }

    public async createPost(title: string, content: string): Promise<string> {
        if (this.user.isSignedIn) {
            const createRequest = await this.api.createPost(this.user.id, this.user.username, this.user.password, title, content);
            if (createRequest.ok) {
                this.postEventStream.emit('New post');
                return null;
            } else {
                return 'Request failed.';
            }
        } else {
            return 'You must be signed in to create a post';
        }
    }

    public async getPosts(): Promise<Post[]> {
        return this.getPostsByUserId(this.user.id);
    }

    public async getPostsByUserId(id: string): Promise<Post[]> {
        const postsRequest = await this.api.getPosts(id);
        if (postsRequest.ok === true) {
            return postsRequest.posts;
        } else {
            console.error(`Error while requesting posts: ${postsRequest.error}`);
            return [];
        }
    }
}