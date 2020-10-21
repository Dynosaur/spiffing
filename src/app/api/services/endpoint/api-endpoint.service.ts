import { Injectable } from '@angular/core';
import { AuthenticateResponse, CreatePostResponse, GetPostsResponse, GetUserResponse, RegisterResponse, DeregisterResponse,
ChangeUserDataResponse } from '../../interface';
import { ApiHttpService, HttpResponse } from '../http/api-http.service';

@Injectable({
    providedIn: 'root'
})
export class ApiEndpointService {

    constructor(private api: ApiHttpService) { }

    public static basicAuth(username: string, password: string): string {
        return 'Basic ' + btoa(username + ':' + password);
    }

    public async getPosts(author: string): Promise<HttpResponse<GetPostsResponse>> {
        return await this.api.get<GetPostsResponse>(['api', 'posts'], { author }, {});
    }

    public async createPost(username: string, password: string, title: string, content: string): Promise<CreatePostResponse> {
        const authorization = ApiEndpointService.basicAuth(username, password);
        const response = await this.api.post<CreatePostResponse>(['api', username, 'post'], { title, content, author: username }, { authorization });
        return response.payload;
    }

    public async getUser(username: string): Promise<GetUserResponse> {
        const response = await this.api.get<GetUserResponse>(['api', 'user', username], {}, {});
        return response.payload;
    }

    public async register(username: string, password: string): Promise<HttpResponse<RegisterResponse>> {
        const authorization = ApiEndpointService.basicAuth(username, password);
        return await this.api.post(['api', 'user', username], {}, { authorization });
    }

    public async authenticate(username: string, password: string): Promise<HttpResponse<AuthenticateResponse>> {
        const authorization = ApiEndpointService.basicAuth(username, password);
        return await this.api.post(['api', 'authenticate'], {}, { authorization });
    }

    async deregister(username: string, password: string): Promise<HttpResponse<DeregisterResponse>> {
        const authorization = ApiEndpointService.basicAuth(username, password);
        return await this.api.delete(['api', 'user', username], { authorization });
    }

    async updateUserData(username: string, password: string, update: { username?: string; password?: string; }): Promise<HttpResponse<ChangeUserDataResponse>> {
        const authorization = ApiEndpointService.basicAuth(username, password);
        return await this.api.patch<ChangeUserDataResponse>(['api', 'user', username], update, { authorization });
    }
}
