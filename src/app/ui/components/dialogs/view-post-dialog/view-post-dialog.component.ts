import { Router } from '@angular/router';
import { Post, User } from 'spiff/app/api/interface';
import { MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { ApiEndpointService } from 'spiff/app/api/services/api-endpoint.service';
import { UserAccountService } from 'spiff/app/services/user-account.service';

@Component({
    selector: 'spiff-view-post-dialog',
    templateUrl: './view-post-dialog.component.html',
    styleUrls: ['./view-post-dialog.component.scss']
})
export class ViewPostDialogComponent implements OnInit {
    post: Post;
    author: User;
    postId: string;

    constructor(private api: ApiEndpointService,
                private router: Router,
                private dialog: MatDialogRef<ViewPostDialogComponent>,
                private account: UserAccountService) { }

    async ngOnInit(): Promise<void> {
        const postRequest = await this.api.getPost(this.postId);
        if (postRequest.ok) {
            this.post = postRequest.post;
            const userRequest = await this.api.getUser(this.post.author);
            if (userRequest.ok)
                this.author = userRequest.user;
        } else throw new Error('idk error');
    }

    toProfile(username: string): void {
        this.router.navigate(['user', username]);
        this.dialog.close();
    }

    async likePost(): Promise<void> {
        const rateRequest = await this.api.ratePost(this.account.username, this.account.password, this.postId, 1);
        if (rateRequest.ok) {
            this.post.likes++;
        }
    }

    async dislikePost(): Promise<void> {
        const rateRequest = await this.api.ratePost(this.account.username, this.account.password, this.postId, -1);
        if (rateRequest.ok) {
            this.post.dislikes++;
        }
    }

}
