import { Injectable } from '@angular/core';
import { AuthenticateEndpoint, CreatePostEndpoint, DeregisterEndpoint, GetPostEndpoint, GetPostsEndpoint, GetUserEndpoint, PatchEndpoint,
RegisterEndpoint } from '../../interface/responses';
import { ApiHttpService, HttpResponse } from '../http/api-http.service';

@Injectable({
    providedIn: 'root'
})
export class ApiEndpointService {

    constructor(private api: ApiHttpService) { }

    static basicAuth(username: string, password: string): string {
        return 'Basic ' + btoa(username + ':' + password);
    }

    async getPosts(author: string): Promise<HttpResponse<GetPostsEndpoint>> {
        return await this.api.get<GetPostsEndpoint>(['api', 'posts'], { author }, {});
    }

    async createPost(username: string, password: string, title: string, content: string): Promise<CreatePostEndpoint> {
        const authorization = ApiEndpointService.basicAuth(username, password);
        const response = await this.api.post<CreatePostEndpoint>(['api', username, 'post'], {
            author: username,
            content,
            title
        }, { authorization });
        return response.payload;
    }

    async getUser(username: string): Promise<GetUserEndpoint> {
        const response = await this.api.get<GetUserEndpoint>(['api', 'user', username], {}, {});
        return response.payload;
    }

    async register(username: string, password: string): Promise<HttpResponse<RegisterEndpoint>> {
        const authorization = ApiEndpointService.basicAuth(username, password);
        return await this.api.post(['api', 'user', username], {}, { authorization });
    }

    async authenticate(username: string, password: string): Promise<HttpResponse<AuthenticateEndpoint>> {
        const authorization = ApiEndpointService.basicAuth(username, password);
        return await this.api.post(['api', 'authenticate'], {}, { authorization });
    }

    async deregister(username: string, password: string): Promise<HttpResponse<DeregisterEndpoint>> {
        const authorization = ApiEndpointService.basicAuth(username, password);
        return await this.api.delete(['api', 'user', username], { authorization });
    }

    async updateUserData(
        username: string,
        password: string,
        update: {
            username?: string;
            password?: string;
        }
    ): Promise<HttpResponse<PatchEndpoint>> {
        const authorization = ApiEndpointService.basicAuth(username, password);
        return await this.api.patch(['api', 'user', username], update, { authorization });
    }

    async getPost(id: string): Promise<HttpResponse<GetPostEndpoint>> {
        return await this.api.get(['api', 'post', id], {}, {});
    }
}
