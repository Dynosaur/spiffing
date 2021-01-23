import { Router } from '@angular/router';
import { Post, User } from 'spiff/app/api/interface';
import { PostService } from 'spiff/app/services/post.service';
import { DialogService } from 'spiff/app/services/dialog.service';
import { Component, OnInit } from '@angular/core';
import { UserAccountService } from 'spiff/app/services/user-account.service';

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

    constructor(private post: PostService, public dialog: DialogService, private router: Router, private account: UserAccountService) { }

    ngOnInit(): void {
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

    toProfile(username: string): void {
        this.router.navigate(['user', username]);
    }

    openPost(id: string): void {
        this.dialog.openViewPostDialog(id);
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
}
