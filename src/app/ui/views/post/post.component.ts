import { Post, User } from 'spiff/app/api/interface/data-types';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ApiEndpointService } from 'spiff/app/api/services/api-endpoint.service';
import { GetPostError, PostService } from 'spiff/app/services/post.service';
import { UserAccountEvent, UserAccountService } from 'spiff/app/services/user-account.service';

interface ViewPost extends Post {
    author: User;
}

@Component({
    selector: 'spiff-post',
    templateUrl: './post.component.html',
    styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
    post: ViewPost;
    date: string;
    liked: boolean;
    disliked: boolean;
    loading = true;
    canDisplay = false;
    errorMessage: string;

    constructor(private postSrvc: PostService,
                private route: ActivatedRoute,
                private account: UserAccountService,
                private api: ApiEndpointService) { }

    ngOnInit(): void {
        this.route.params.subscribe(async params => {
            try {
                this.post = await this.postSrvc.getPostById(params.id, true) as ViewPost;
                this.date = new Date(this.post.date * 1000).toLocaleString();
                if (this.account.ratedMap.status === 'Loading') {
                    this.account.accountEventStream.subscribe((event: UserAccountEvent) => {
                        if (event === 'ratedMapReady') {
                            if (this.account.ratedMap.map.has(this.post._id)) {
                                const rating = this.account.ratedMap.map.get(this.post._id);
                                this.liked = rating;
                                this.disliked = !rating;
                            } else {
                                this.liked = false;
                                this.disliked = false;
                            }
                        }
                    });
                } else {
                    if (this.account.ratedMap.map.has(this.post._id)) {
                        const rating = this.account.ratedMap.map.get(this.post._id);
                        this.liked = rating;
                        this.disliked = !rating;
                    } else {
                        this.liked = false;
                        this.disliked = false;
                    }
                }
            } catch (error) {
                if (error instanceof GetPostError) {
                    this.errorMessage = error.error;
                } else throw error;
            }
            this.loading = false;
            this.canDisplay = !!this.post;
        });
    }

    async likePost(): Promise<void> {
        if (this.liked) {
            const rateRequest = await this.api.ratePost(this.account.username, this.account.password, this.post._id, 0);
            if (rateRequest.ok === true) {
                this.account.ratedMap.map.delete(this.post._id);
                this.liked = false;
                this.post.likes--;
            } else throw new Error('Error while liking post in Post View: ' + rateRequest.error);
        } else {
            const rateRequest = await this.api.ratePost(this.account.username, this.account.password, this.post._id, 1);
            if (rateRequest.ok === true) {
                this.account.ratedMap.map.set(this.post._id, true);
                this.liked = true;
                this.post.likes++;
                if (this.disliked) {
                    this.disliked = false;
                    this.post.dislikes--;
                }
            } else throw new Error('Error while liking post in Post View: ' + rateRequest.error);
        }
    }

    async dislikePost(): Promise<void> {
        if (this.disliked) {
            const rateRequest = await this.api.ratePost(this.account.username, this.account.password, this.post._id, 0);
            if (rateRequest.ok === true) {
                this.account.ratedMap.map.delete(this.post._id);
                this.disliked = false;
                this.post.dislikes--;
            } else throw new Error('Error while liking post in Post View: ' + rateRequest.error);
        } else {
            const rateRequest = await this.api.ratePost(this.account.username, this.account.password, this.post._id, -1);
            if (rateRequest.ok === true) {
                this.account.ratedMap.map.set(this.post._id, false);
                this.disliked = true;
                this.post.dislikes++;
                if (this.liked) {
                    this.liked = false;
                    this.post.likes--;
                }
            } else throw new Error('Error while liking post in Post View: ' + rateRequest.error);
        }
    }

}
