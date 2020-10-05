import { Injectable } from '@angular/core';
import { AuthenticateResponse, CreatePostResponse, GetPostsResponse, GetPostsSuccessResponse, GetUserResponse, RegisterResponse, ResponseStatus } from '../../interface';
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

    public async POSTPost(title: string, content: string, author: string): Promise<CreatePostResponse> {
        const response = await this.api.post<CreatePostResponse>(['post', 'create', title], { content, author }, {}, {});
        return response.payload;
    }

    public async GETUser(username: string): Promise<GetUserResponse> {
        const response = await this.api.get<GetUserResponse>(['user', username], {}, {});
        return response.payload;
    }

    public async register(username: string, password: string): Promise<HttpResponse<RegisterResponse>> {
        const authorization = ApiEndpointService.basicAuth(username, password);
        return await this.api.post(['api', 'register'], {}, {}, { authorization });
    }

    public async authenticate(username: string, password: string): Promise<HttpResponse<AuthenticateResponse>> {
        const authorization = ApiEndpointService.basicAuth(username, password);
        return await this.api.post(['api', 'authenticate'], {}, {}, { authorization });
    }
}
