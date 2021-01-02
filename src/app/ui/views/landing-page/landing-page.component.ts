import { Post } from 'spiff/app/api/interface';
import { Router } from '@angular/router';
import { PostService } from 'spiff/app/services/post.service';
import { DialogService } from 'spiff/app/services/dialog.service';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'spiff-landing-page',
    templateUrl: './landing-page.component.html',
    styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
    posts: Post[];
    loadingPosts: boolean;
    postStatus: 'Ok' | 'None' | 'Error' = 'None';

    constructor(private post: PostService, public dialog: DialogService, private router: Router) { }

    ngOnInit(): void {
        this.fetchPosts();
    }

    async fetchPosts(): Promise<void> {
        this.loadingPosts = true;
        try {
            this.posts = await this.post.getPostsByUserId(undefined);
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
        console.log('hello');
        this.dialog.openViewPostDialog(id);
    }
}
