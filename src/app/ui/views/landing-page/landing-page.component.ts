import { Title } from '@angular/platform-browser';
import { Post, User } from 'spiff/app/api/interface';
import { PostService } from 'spiff/app/services/post.service';
import { DialogService } from 'spiff/app/services/dialog.service';
import { Component, OnInit } from '@angular/core';
import { UserAccountService } from 'spiff/app/services/user-account.service';
import { ApiEndpointService } from 'spiff/app/api/services/api-endpoint.service';

interface PostWithAuthorUser extends Post {
    author: User;
}

@Component({
    selector: 'spiff-landing-page',
    templateUrl: './landing-page.component.html',
    styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
    posts: PostWithAuthorUser[];
    loadingPosts: boolean;
    postStatus: 'Ok' | 'None' | 'Error' = 'None';

    constructor(private title: Title,
                private post: PostService,
                public dialog: DialogService,
                private account: UserAccountService,
                private api: ApiEndpointService) { }

    ngOnInit(): void {
        this.title.setTitle('spiffing');
        this.fetchPosts();
    }

    async fetchPosts(): Promise<void> {
        this.loadingPosts = true;
        try {
            this.posts = await this.post.getPostsByUserId(undefined, true) as any;
            this.postStatus = this.posts.length ? 'Ok' : 'None';
        } catch (error) {
            if (error.message === 'NoConnection') {
                this.posts = [];
            }
            this.postStatus = 'Error';
        }
        this.loadingPosts = false;
    }

    isPostLiked(postId: string): boolean {
        if (this.account.ratedMap.map.has(postId)) return this.account.ratedMap.map.get(postId);
        else return false;
    }

    isPostDisliked(postId: string): boolean {
        if (this.account.ratedMap.map.has(postId)) return !this.account.ratedMap.map.get(postId);
        else return false;
    }

    toTimestamp(post: Post): string {
        return new Date(post.date * 1000).toLocaleString();
    }

    async likePost(post: Post): Promise<void> {
        if (post === undefined || post === null) throw new Error('LandingPageComponent: provided post to like was ' + post);
        if (this.account.ratedMap.map.get(post._id) === true) {
            const rateRequest = await this.api.ratePost(this.account.username, this.account.password, post._id, 0);
            if (rateRequest.ok === true) {
                this.account.ratedMap.map.delete(post._id);
                post.likes--;
            } else throw new Error('Error while liking post in Post View: ' + rateRequest.error);
        } else {
            const rateRequest = await this.api.ratePost(this.account.username, this.account.password, post._id, 1);
            if (rateRequest.ok === true) {
                if (this.account.ratedMap.map.get(post._id) === false) post.dislikes--;
                this.account.ratedMap.map.set(post._id, true);
                post.likes++;
            } else throw new Error('Error while liking post in Post View: ' + rateRequest.error);
        }
    }

    async dislikePost(post: Post): Promise<void> {
        if (post === undefined || post === null) throw new Error('LandingPageComponent: provided post to like was ' + post);
        if (this.account.ratedMap.map.get(post._id) === false) {
            const rateRequest = await this.api.ratePost(this.account.username, this.account.password, post._id, 0);
            if (rateRequest.ok === true) {
                this.account.ratedMap.map.delete(post._id);
                post.dislikes--;
            } else throw new Error('Error while liking post in Post View: ' + rateRequest.error);
        } else {
            const rateRequest = await this.api.ratePost(this.account.username, this.account.password, post._id, -1);
            if (rateRequest.ok === true) {
                if (this.account.ratedMap.map.get(post._id) === true) post.likes--;
                this.account.ratedMap.map.set(post._id, false);
                post.dislikes++;
            } else throw new Error('Error while liking post in Post View: ' + rateRequest.error);
        }
    }
}
