import { Injectable } from '@angular/core';
import { ApiHttpService } from 'spiff/app/api/services/api-http.service';
import { IAuthorize, ICreatePost, IDeregister, IGetPost, IGetPosts, IGetUser, IPatch, IRatePost, IRegister } from 'spiff/app/api/interface';

@Injectable({
    providedIn: 'root'
})
export class ApiEndpointService {

    constructor(private api: ApiHttpService) { }

    static basicAuth(username: string, password: string): string {
        return 'Basic ' + btoa(username + ':' + password);
    }

    async getPosts(id: string): Promise<IGetPosts.Tx> {
        return await this.api.get<IGetPosts.Tx>(['api', 'posts'], { author: id }, { });
    }

    async createPost(uid: string, username: string, password: string, title: string, content: string): Promise<ICreatePost.Tx> {
        const authorization = ApiEndpointService.basicAuth(username, password);
        const response = await this.api.post<ICreatePost.Tx>(['api', 'post'], {
            author: uid,
            content,
            title
        }, { authorization });
        return response;
    }

    async getUser(id: string): Promise<IGetUser.Tx> {
        const response = await this.api.get<IGetUser.Tx>(['api', 'user', id], {}, {});
        return response;
    }

    async register(username: string, password: string): Promise<IRegister.Tx> {
        const authorization = ApiEndpointService.basicAuth(username, password);
        return await this.api.post<IRegister.Tx>(['api', 'user', username], {}, { authorization });
    }

    async authorize(username: string, password: string): Promise<IAuthorize.Tx> {
        const authorization = ApiEndpointService.basicAuth(username, password);
        return await this.api.post<IAuthorize.Tx>(['api', 'authorize'], {}, { authorization });
    }

    async deregister(username: string, password: string): Promise<IDeregister.Tx> {
        const authorization = ApiEndpointService.basicAuth(username, password);
        return await this.api.delete<IDeregister.Tx>(['api', 'user', username], { authorization });
    }

    async updateUserData(
        username: string,
        password: string,
        update: {
            username?: string;
            password?: string;
        }
    ): Promise<IPatch.Tx> {
        const authorization = ApiEndpointService.basicAuth(username, password);
        return await this.api.patch<IPatch.Tx>(['api', 'user', username], update, { authorization });
    }

    async getPost(id: string): Promise<IGetPost.Tx> {
        return await this.api.get<IGetPost.Tx>(['api', 'post', id], {}, {});
    }

    async ratePost(username: string, password: string, postId: string, rating: number): Promise<IRatePost.Tx> {
        return await this.api.post<IRatePost.Tx>(['api', 'rate', 'post', postId], { rating }, {
            authorization: ApiEndpointService.basicAuth(username, password)
        });
    }
}
