import { Injectable } from '@angular/core';
import { ApiEndpointService } from '../endpoint/api-endpoint.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export default class ApiUserService {

    constructor(private api: ApiEndpointService) { }

    // TODO REWORK THIS INTO SERVERSIDE
    public async assertUsernamePassword(username: string, password: string): Promise<boolean> {
        // const res = await this.api.GETUser(username);
        // console.log(res);
        // return (res.status === 'OK') ? res.data.password === password : false;
        return false;
    }

    // Broken, please implement a server side method to validate user accounts
    // public async doesUserAccountExist(username: string): Promise<boolean> {
    //     const res = await this.api.get(`/user/${username}`);
    //     return res.data.userExists;
    // }

    async createNewUser(username: string, password: string): Promise<any | HttpErrorResponse> {
        try {
            const response = await this.api.register(username, password);
            // const data = await this.http.post('/user', { username, password });
            return response;
        } catch (e) {
            if (e instanceof HttpErrorResponse) {
                return e;
            } else {
                throw e;
            }
        }
    }

    // Unused
    // async assertUserCredentials(username: string, password: string): Promise<boolean | HttpErrorResponse> {
    //     try {
    //         const res = await this.http.get('/user/' + username);
    //         console.log(res);
    //         return res.data.user.password === password;
    //     } catch (e) {
    //         console.log(e);
    //         if (e instanceof HttpErrorResponse) {
    //             if (e.status === 410) {
    //                 return false;
    //             }
    //             if (e.status === 0) {
    //                 return e;
    //             }
    //             return e;
    //         } else {
    //             throw e;
    //         }
    //     }
    // }
}
