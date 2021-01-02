import { Injectable } from '@angular/core';
import { ApiHttpService } from 'spiff/app/api/services/api-http.service';
import { Authenticate, CreatePost, Deregister, GetPost, GetPosts, GetUser, Patch, Register } from 'spiff/app/api/interface';

@Injectable({
    providedIn: 'root'
})
export class ApiEndpointService {

    constructor(private api: ApiHttpService) { }

    static basicAuth(username: string, password: string): string {
        return 'Basic ' + btoa(username + ':' + password);
    }

    async getPosts(id: string): Promise<GetPosts.Tx> {
        return await this.api.get<GetPosts.Tx>(['api', 'posts'], { author: id }, { });
    }

    async createPost(uid: string, username: string, password: string, title: string, content: string): Promise<CreatePost.Tx> {
        const authorization = ApiEndpointService.basicAuth(username, password);
        const response = await this.api.post<CreatePost.Tx>(['api', 'post'], {
            author: uid,
            content,
            title
        }, { authorization });
        return response;
    }

    async getUser(id: string): Promise<GetUser.Tx> {
        const response = await this.api.get<GetUser.Tx>(['api', 'user', id], {}, {});
        return response;
    }

    async register(username: string, password: string): Promise<Register.Tx> {
        const authorization = ApiEndpointService.basicAuth(username, password);
        return await this.api.post<Register.Tx>(['api', 'user', username], {}, { authorization });
    }

    async authenticate(username: string, password: string): Promise<Authenticate.Tx> {
        const authorization = ApiEndpointService.basicAuth(username, password);
        return await this.api.post<Authenticate.Tx>(['api', 'authenticate'], {}, { authorization });
    }

    async deregister(username: string, password: string): Promise<Deregister.Tx> {
        const authorization = ApiEndpointService.basicAuth(username, password);
        return await this.api.delete<Deregister.Tx>(['api', 'user', username], { authorization });
    }

    async updateUserData(
        username: string,
        password: string,
        update: {
            username?: string;
            password?: string;
        }
    ): Promise<Patch.Tx> {
        const authorization = ApiEndpointService.basicAuth(username, password);
        return await this.api.patch<Patch.Tx>(['api', 'user', username], update, { authorization });
    }

    async getPost(id: string): Promise<GetPost.Tx> {
        return await this.api.get<GetPost.Tx>(['api', 'post', id], {}, {});
    }
}
