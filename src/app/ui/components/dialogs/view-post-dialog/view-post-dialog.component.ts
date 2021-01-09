import { Router } from '@angular/router';
import { Post, User } from 'spiff/app/api/interface';
import { MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { ApiEndpointService } from 'spiff/app/api/services/api-endpoint.service';
import { UserAccountEvent, UserAccountService } from 'spiff/app/services/user-account.service';

@Component({
    selector: 'spiff-view-post-dialog',
    templateUrl: './view-post-dialog.component.html',
    styleUrls: ['./view-post-dialog.component.scss']
})
export class ViewPostDialogComponent implements OnInit {
    loading = true;
    post: Post;
    author: User;
    postId: string;
    liked = false;
    disliked = false;

    constructor(private api: ApiEndpointService,
                private router: Router,
                private dialog: MatDialogRef<ViewPostDialogComponent>,
                private account: UserAccountService) { }

    async ngOnInit(): Promise<void> {
        const postRequest = await this.api.getPost(this.postId);
        if (postRequest.ok) {
            this.post = postRequest.post;
            const userRequest = await this.api.getUser(this.post.author);
            if (userRequest.ok) this.author = userRequest.user;
            if (this.account.ratedMap.status === 'Loading') {
                this.account.accountEventStream.subscribe((event: UserAccountEvent) => {
                    if (event === 'ratedMapReady') this.getUserRating();
                });
            } else this.getUserRating();
            this.loading = false;
        } else throw new Error('idk error');
    }

    getUserRating(): void {
        if (this.account.ratedMap.map.has(this.postId)) {
            const rating = this.account.ratedMap.map.get(this.postId);
            this.liked = rating;
            this.disliked = !rating;
        } else {
            this.liked = false;
            this.disliked = false;
        }
    }

    toProfile(username: string): void {
        this.router.navigate(['user', username]);
        this.dialog.close();
    }

    async likePost(): Promise<void> {
        if (this.liked) {
            const rateRequest = await this.api.ratePost(this.account.username, this.account.password, this.postId, 0);
            if (rateRequest.ok) {
                this.post.likes--;
                this.account.ratedMap.map.delete(this.postId);
                this.liked = false;
            }
        } else if (this.disliked) {
            const rateRequest = await this.api.ratePost(this.account.username, this.account.password, this.postId, 1);
            if (rateRequest.ok) {
                this.post.dislikes--;
                this.post.likes++;
                this.liked = true;
                this.disliked = false;
                this.account.ratedMap.map.set(this.postId, true);
            }
        } else {
            const rateRequest = await this.api.ratePost(this.account.username, this.account.password, this.postId, 1);
            if (rateRequest.ok) {
                this.post.likes++;
                this.liked = true;
                this.account.ratedMap.map.set(this.postId, true);
            }
        }
    }

    async dislikePost(): Promise<void> {
        if (this.disliked) {
            const rateRequest = await this.api.ratePost(this.account.username, this.account.password, this.postId, 0);
            if (rateRequest.ok) {
                this.post.dislikes--;
                this.disliked = false;
                this.account.ratedMap.map.delete(this.postId);
            }
        } else if (this.liked) {
            const rateRequest = await this.api.ratePost(this.account.username, this.account.password, this.postId, -1);
            if (rateRequest.ok) {
                this.post.dislikes++;
                this.post.likes--;
                this.liked = false;
                this.disliked = true;
                this.account.ratedMap.map.set(this.postId, false);
            }
        } else {
            const rateRequest = await this.api.ratePost(this.account.username, this.account.password, this.postId, -1);
            if (rateRequest.ok) {
                this.post.dislikes++;
                this.disliked = true;
                this.account.ratedMap.map.set(this.postId, false);
            }
        }
    }

}
