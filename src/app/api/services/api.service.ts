import { Injectable } from '@angular/core';
import { ApiHttpService } from 'spiff/app/api/services/api-http.service';
import { basicAuthorization } from 'spiff/app/util/basic-auth';
import { IAuthorize, ICreatePost, IDeregister, IGetPosts, IGetRatedPosts, IGetUsers, IPatch, IRatePost, IRegister } from 'spiff/app/api/interface';

@Injectable({ providedIn: 'root' })
export class ApiService {
    constructor(private http: ApiHttpService) { }

    async register(username: string, password: string): Promise<IRegister.Tx> {
        return await this.http.post<IRegister.Tx>(['api', 'user', username], {}, {
            authorization: basicAuthorization(username, password)
        });
    }

    async authorize(username: string, password: string): Promise<IAuthorize.Tx> {
        return await this.http.post<IAuthorize.Tx>(['api', 'authorize'], {}, {
            authorization: basicAuthorization(username, password)
        });
    }

    async deregister(username: string, password: string): Promise<IDeregister.Tx> {
        return await this.http.delete<IDeregister.Tx>(['api', 'user', username], {
            authorization: basicAuthorization(username, password)
        });
    }

    async patch(username: string, password: string, changes: {
        username?: string;
        password?: string;
        screenname?: string;
    }): Promise<IPatch.Tx> {
        return await this.http.patch<IPatch.Tx>(['api', 'user', username], changes, {
            authorization: basicAuthorization(username, password)
        });
    }

    async getPosts(query: {
        author?: string;
        id?: string;
        ids?: string;
        include?: string;
        title?: string
    }): Promise<IGetPosts.Tx> {
        return await this.http.get<IGetPosts.Tx>(['api', 'posts'], query);
    }

    async createPost(username: string, password: string, title: string, content: string): Promise<ICreatePost.Tx> {
        return await this.http.post<ICreatePost.Tx>(['api', 'post'], { title, content },
            { authorization: basicAuthorization(username, password) }
        );
    }

    async ratePost(username: string, password: string, postId: string, rating: -1 | 0 | 1): Promise<IRatePost.Tx> {
        return await this.http.post<IRatePost.Tx>(['api', 'rate', 'post', postId], { rating },
            { authorization: basicAuthorization(username, password) }
        );
    }

    async getRatedPosts(username: string, password: string, uid: string): Promise<IGetRatedPosts.Tx> {
        return await this.http.get<IGetRatedPosts.Tx>(['api', 'rated', uid], {},
            { authorization: basicAuthorization(username, password) }
        );
    }

    async getUsers(query: { id?: string; ids?: string[]; username?: string; usernames?: string[]; } = {}): Promise<IGetUsers.Tx> {
        return await this.http.get<IGetUsers.Tx>(['api', 'users'], {
            ... query.id  && { id: query.id },
            ... query.ids && { ids: query.ids.join(',') },
            ... query.username  && { username: query.username },
            ... query.usernames && { usernames: query.usernames.join(',') }
        });
    }
}
